import { Body, Controller, Delete, Get, Param, Post, Put, Query, ValidationPipe } from "@nestjs/common";
import { CreateCategorieUseCase } from "../../../application/use-cases/categorie/create-categorie.use-case";
import { DeleteCategorieUseCase } from "../../../application/use-cases/categorie/delete-categorie.use-case";
import { GetCategorieByUuidUseCase } from "../../../application/use-cases/categorie/get-categorie-by-id.use-case";
import { GetCategoriesUseCase } from "../../../application/use-cases/categorie/get-categories.use-case";
import { UpdateCategorieUseCase } from "../../../application/use-cases/categorie/update-categorie.use-case";
import { CreateCategorieDto } from "../../dtos/categorie/create-categorie.dto";

@Controller('categorie')
export class CategorieController {
  constructor(
    private readonly createCategorieUseCase: CreateCategorieUseCase,
    private readonly getCategoriesUseCase: GetCategoriesUseCase,
    private readonly getCategorieByUuidUseCase: GetCategorieByUuidUseCase,
    private readonly updateCategorieUseCase: UpdateCategorieUseCase,
    private readonly deleteCategorieUseCase: DeleteCategorieUseCase,
  ) {}

  @Post('create')
  async create(@Body(ValidationPipe) createCategorieDto: CreateCategorieDto) {
    const categorie = await this.createCategorieUseCase.execute(
      createCategorieDto.name,
      createCategorieDto.code,
      createCategorieDto.status ?? true,
    );
    return {
      success: true,
      message: 'Categoria creada exitosamente',
      data: categorie,
    };
  }

  @Get('get-all')
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 10;

    const categories = await this.getCategoriesUseCase.execute(pageNumber, limitNumber);
    return {
      success: true,
      message: 'Categorias obtenidas exitosamente',
      data: categories,
    };
  }

  @Get('get-by-uuid/:uuid')
  async findOne(@Param('uuid') uuid: string) {
    const categorie = await this.getCategorieByUuidUseCase.execute(uuid);
    return {
      success: true,
      message: 'Categoria obtenida exitosamente',
      data: categorie,
    };
  }

  @Put('update-categorie/:uuid')
  async update(@Param('uuid') uuid: string, @Body() updateCategorieDto: CreateCategorieDto) {
    const categorie = await this.updateCategorieUseCase.execute(uuid, updateCategorieDto);
    return {
      success: true,
      message: 'Categoria actualizada exitosamente',
      data: categorie,
    };
  }

  @Delete('delete-categorie/:uuid')
  async delete(@Param('uuid') uuid: string) {
    const categorie = await this.deleteCategorieUseCase.execute(uuid);
    return {
      success: true,
      message: 'Categoria eliminada exitosamente',
      data: categorie,
    };
  }
}