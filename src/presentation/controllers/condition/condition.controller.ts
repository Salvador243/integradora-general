import { Body, Controller, Delete, Get, Param, Post, Put, Query, ValidationPipe } from "@nestjs/common";
import { CreateConditionUseCase } from "../../../application/use-cases/condition/create-condition.use-case";
import { DeleteConditionUseCase } from "../../../application/use-cases/condition/delete-condition.use-case";
import { GetConditionByUuidUseCase } from "../../../application/use-cases/condition/get-condition-by-id.use-case";
import { GetConditionsUseCase } from "../../../application/use-cases/condition/get-conditions.use-case";
import { UpdateConditionUseCase } from "../../../application/use-cases/condition/update-condition.use-case";
import { CreateConditionDto } from "../../dtos/condition/create-condition.dto";
import { UpdateConditionDto } from "../../dtos/condition/update-condition.dto";

@Controller('condition')
export class ConditionController {
  constructor(
    private readonly createConditionUseCase: CreateConditionUseCase,
    private readonly getConditionsUseCase: GetConditionsUseCase,
    private readonly getConditionByUuidUseCase: GetConditionByUuidUseCase,
    private readonly updateConditionUseCase: UpdateConditionUseCase,
    private readonly deleteConditionUseCase: DeleteConditionUseCase,
  ) {}

  @Post('create')
  async create(@Body(ValidationPipe) createConditionDto: CreateConditionDto) {
    const condition = await this.createConditionUseCase.execute(
      createConditionDto.code,
      createConditionDto.description,
      createConditionDto.status ?? true,
    );
    return {
      success: true,
      message: 'Condición creada exitosamente',
      data: condition,
    };
  }

  @Get('get-all')
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 10;

    const conditions = await this.getConditionsUseCase.execute(pageNumber, limitNumber);
    return {
      success: true,
      message: 'Condiciones obtenidas exitosamente',
      data: conditions,
    };
  }

  @Get('get-by-uuid/:uuid')
  async findOne(@Param('uuid') uuid: string) {
    const condition = await this.getConditionByUuidUseCase.execute(uuid);
    return {
      success: true,
      message: 'Condición obtenida exitosamente',
      data: condition,
    };
  }

  @Put('update-condition/:uuid')
  async update(@Param('uuid') uuid: string, @Body(ValidationPipe) updateConditionDto: UpdateConditionDto) {
    const condition = await this.updateConditionUseCase.execute(uuid, updateConditionDto);
    return {
      success: true,
      message: 'Condición actualizada exitosamente',
      data: condition,
    };
  }

  @Delete('delete-condition/:uuid')
  async delete(@Param('uuid') uuid: string) {
    const condition = await this.deleteConditionUseCase.execute(uuid);
    return {
      success: true,
      message: 'Condición eliminada exitosamente',
      data: condition,
    };
  }
}
