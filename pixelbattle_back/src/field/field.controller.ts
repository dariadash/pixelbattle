import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { Public } from 'src/decorators/public.decorator';
import { Field } from './field.entity';
import { FieldService } from './field.service';

@Controller()
export class FieldController {
    constructor(private readonly fieldService: FieldService) { }

    @Post()
    setPixel(@Body() field: Field) {
        return this.fieldService.setPixel(field)
    }

    @Public()
    @Get()
    async getAllFields(@Res() res: any) {
        res.json(this.fieldService.getPixels())
    }
}
