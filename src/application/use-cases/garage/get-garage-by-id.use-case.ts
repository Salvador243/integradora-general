import { Injectable, Inject } from '@nestjs/common';
import type { GarageRepository } from '../../../domain/repositories/garage.repository';
import { Garage } from '../../../domain/entities/garage/garage.entity';

@Injectable()
export class GetGarageByIdUseCase {
	constructor(
		@Inject('GarageRepository')
		private readonly garageRepository: GarageRepository,
	) {}

	async execute(uuid: string): Promise<Garage> {
		const garage = await this.garageRepository.findByUuid(uuid);

		if (!garage) {
			throw new Error('Garage no encontrado');
		}

		return garage;
	}
}
