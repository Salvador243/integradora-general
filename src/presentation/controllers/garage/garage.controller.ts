import {
	Controller,
	Get,
	Post,
	Put,
	Delete,
	Body,
	Param,
	Query,
	ValidationPipe,
} from '@nestjs/common';
import { CreateGarageDto } from '../../dtos/garage/create-garage.dto';
import { UpdateGarageDto } from '../../dtos/garage/update-garage.dto';
import { CreateGarageUseCase } from '../../../application/use-cases/garage/create-garage.use-case';
import { GetGaragesUseCase } from '../../../application/use-cases/garage/get-garages.use-case';
import { GetGarageByIdUseCase } from '../../../application/use-cases/garage/get-garage-by-id.use-case';
import { UpdateGarageUseCase } from '../../../application/use-cases/garage/update-garage.use-case';
import { DeleteGarageUseCase } from '../../../application/use-cases/garage/delete-garage.use-case';

@Controller('garage')
export class GarageController {
	constructor(
		private readonly createGarageUseCase: CreateGarageUseCase,
		private readonly getGaragesUseCase: GetGaragesUseCase,
		private readonly getGarageByIdUseCase: GetGarageByIdUseCase,
		private readonly updateGarageUseCase: UpdateGarageUseCase,
		private readonly deleteGarageUseCase: DeleteGarageUseCase,
	) {}

	@Post('create')
	async create(@Body(ValidationPipe) createGarageDto: CreateGarageDto) {
		const garage = await this.createGarageUseCase.execute(
			createGarageDto.code,
			createGarageDto.name,
			createGarageDto.status ?? true,
		);

		return {
			success: true,
			message: 'Garage creado exitosamente',
			data: garage,
		};
	}

	@Get('get-all')
	async findAll(
		@Query('page') page: string = '1',
		@Query('limit') limit: string = '10',
	) {
		const pageNumber = parseInt(page, 10) || 1;
		const limitNumber = parseInt(limit, 10) || 10;

		const result = await this.getGaragesUseCase.execute(
			pageNumber,
			limitNumber,
		);

		return {
			success: true,
			message: 'Garages obtenidos exitosamente',
			data: result,
		};
	}

	@Get('get-by-uuid/:uuid')
	async findOne(@Param('uuid') uuid: string) {
		const garage = await this.getGarageByIdUseCase.execute(uuid);

		return {
			success: true,
			message: 'Garage obtenido exitosamente',
			data: garage,
		};
	}

	@Put('update-garage/:uuid')
	async update(
		@Param('uuid') uuid: string,
		@Body(ValidationPipe) updateGarageDto: UpdateGarageDto,
	) {
		const garage = await this.updateGarageUseCase.execute(
			uuid,
			updateGarageDto,
		);

		return {
			success: true,
			message: 'Garage actualizado exitosamente',
			data: garage,
		};
	}

	@Delete('delete-garage/:uuid')
	async remove(@Param('uuid') uuid: string) {
		await this.deleteGarageUseCase.execute(uuid);

		return {
			success: true,
			message: 'Garage eliminado exitosamente',
		};
	}
}
