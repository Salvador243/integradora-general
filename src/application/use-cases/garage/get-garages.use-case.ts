import { Injectable, Inject } from '@nestjs/common';
import type { GarageRepository } from '../../../domain/repositories/garage.repository';
import { Garage } from '../../../domain/entities/garage/garage.entity';

@Injectable()
export class GetGaragesUseCase {
	constructor(
		@Inject('GarageRepository')
		private readonly garageRepository: GarageRepository,
	) {}

	async execute(
		page: number = 1,
		limit: number = 10,
	): Promise<{
		garages: Garage[];
		total: number;
		page: number;
		totalPages: number;
	}> {
		if (page < 1) page = 1;
		if (limit < 1 || limit > 100) limit = 10;

		const result = await this.garageRepository.findAll(page, limit);
		const totalPages = Math.ceil(result.total / limit);

		return {
			garages: result.garages,
			total: result.total,
			page,
			totalPages,
		};
	}
}
