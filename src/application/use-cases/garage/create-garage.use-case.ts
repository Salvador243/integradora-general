import { Injectable, Inject } from '@nestjs/common';
import type { GarageRepository } from '../../../domain/repositories/garage.repository';
import { Garage } from '../../../domain/entities/garage/garage.entity';

@Injectable()
export class CreateGarageUseCase {
	constructor(
		@Inject('GarageRepository')
		private readonly garageRepository: GarageRepository,
	) {}

	async execute(
		code: string,
		name: string,
		status: boolean = true,
	): Promise<Garage> {
		// Validar que el código no exista
		const existingGarage = await this.garageRepository.findAll(1, 1000);
		const codeExists = existingGarage.garages.some(
			(garage) => garage.code === code,
		);

		if (codeExists) {
			throw new Error('Ya existe un garage con este código');
		}

		return await this.garageRepository.create({
			code,
			name,
			status,
		});
	}
}
