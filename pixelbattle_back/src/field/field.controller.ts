import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/decorators/public.decorator';
import { Field } from './field.entity';
import { FieldService } from './field.service';

@ApiTags('field')
@Controller()
export class FieldController {
    constructor(private readonly fieldService: FieldService) { }

    @Post()
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'Draw a pixel on the canvas' })
    @ApiOkResponse({ description: 'Upsert result' })
    setPixel(@Body() field: Field) {
        return this.fieldService.setPixel(field)
    }

    @Public()
    @Get()
    @ApiOperation({ summary: 'Get all canvas pixels' })
    @ApiOkResponse({ description: 'Pixel list' })
    async getAllFields(@Res() res: any) {
        res.json(this.fieldService.getPixels())
    }
}
