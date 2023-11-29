import { Injectable } from '@nestjs/common';
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
    public currentPixels: PixelsMap

    private GRID_SIZE = 20
    // private CANVAS_SIZE = 10000
    private CANVAS_SIZE = 500
    private rows: number
    private cols: number

    private fallbackColor = '#fff'

    constructor(
        @InjectRepository(Field)
        private fieldRepository: Repository<Field>,
    ) {
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
        this.currentPixels[field.row][field.col] = field.color
        return this.fieldRepository.upsert(field, ['row', 'col'])
    }

    async getAllFields() {
        const data = await this.fieldRepository.find()
        return this.fieldPixels(data)
    }

    private fieldPixels(currentPixels: Pixel[]): PixelsMap {
        const allPixels: PixelsMap = {};
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                const foundValue = currentPixels.find(
                    (p) => p.col === j && p.row === i
                )
                if (typeof allPixels[i] === 'undefined') {
                    allPixels[i] = {}
                }
                if (foundValue) {
                    allPixels[i][j] = foundValue.color
                    continue
                }
                allPixels[i][j] = this.fallbackColor
            }
        }
        return allPixels
    }

}
