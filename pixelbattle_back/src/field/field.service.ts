import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Field } from './field.entity';

type Pixel = Pick<Field, 'col' | 'row' | 'color'>

type PixelsMap = {
    [row: string]: {
        [col: string]: string
    }
}

@Injectable()
export class FieldService {
    public currentPixels: PixelsMap = {}

    private GRID_SIZE: number
    private CANVAS_SIZE: number
    private rows: number
    private cols: number

    private fallbackColor = '#fff'

    constructor(
        @InjectRepository(Field)
        private fieldRepository: Repository<Field>,
        private configService: ConfigService,
    ) {
        const gridSize = Number(this.configService.get('GRID_SIZE')) || 20
        const canvasSize = Number(this.configService.get('CANVAS_SIZE')) || 10000
        if (canvasSize % gridSize !== 0) {
            // eslint-disable-next-line no-console
            console.warn(`[field] CANVAS_SIZE (${canvasSize}) is not divisible by GRID_SIZE (${gridSize}), pixel mapping may break`)
        }
        this.GRID_SIZE = gridSize
        this.CANVAS_SIZE = canvasSize
        this.rows = this.CANVAS_SIZE / this.GRID_SIZE
        this.cols = this.CANVAS_SIZE / this.GRID_SIZE
        this.getAllFields().then(
            (data) => {
                this.currentPixels = data
            }
        )
    }

    getPixels() {
        const pixels: Pixel[] = []
        for (const row of Object.keys(this.currentPixels).map(Number)) {
            for (const col of Object.keys(this.currentPixels).map(Number)) {
                pixels.push({
                    row: Number(row),
                    col: Number(col),
                    color: this.currentPixels[Number(row)][Number(col)]
                })
            }
        }
        return pixels
    }

    setPixel(field: Field) {
        if (!this.isInBounds(field.row, field.col)) {
            return null
        }
        if (typeof this.currentPixels[field.row] === 'undefined') {
            this.currentPixels[field.row] = {}
        }
        if (this.currentPixels[field.row][field.col] === field.color) {
            return null
        }
        this.currentPixels[field.row][field.col] = field.color
        return this.fieldRepository.upsert(field, ['row', 'col'])
    }

    async getAllFields() {
        const data = await this.fieldRepository.find()
        return this.fieldPixels(data)
    }

    private fieldPixels(currentPixels: Pixel[]): PixelsMap {
        const byCoord = new Map<string, string>()
        for (const p of currentPixels) {
            byCoord.set(`${p.row}:${p.col}`, p.color)
        }
        const allPixels: PixelsMap = {};
        for (let i = 0; i < this.rows; i++) {
            allPixels[i] = {}
            for (let j = 0; j < this.cols; j++) {
                allPixels[i][j] = byCoord.get(`${i}:${j}`) ?? this.fallbackColor
            }
        }
        return allPixels
    }

    private isInBounds(row: number, col: number) {
        return Number.isInteger(row) && Number.isInteger(col)
            && row >= 0 && row < this.rows
            && col >= 0 && col < this.cols
    }

}
