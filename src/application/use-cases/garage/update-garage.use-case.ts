import { Injectable, Inject } from '@nestjs/common';
import type { GarageRepository } from '../../../domain/repositories/garage.repository';
import { Garage } from '../../../domain/entities/garage/garage.entity';

@Injectable()
export class UpdateGarageUseCase {
	constructor(
		@Inject('GarageRepository')
		private readonly garageRepository: GarageRepository,
	) {}

	async execute(
		uuid: string,
		updateData: Partial<Omit<Garage, 'uuid'>>,
	): Promise<Garage> {
		// Verificar que el garage existe
		const existingGarage = await this.garageRepository.findByUuid(uuid);
		if (!existingGarage) {
			throw new Error('Garage no encontrado');
		}

		// Si se está actualizando el código, verificar que no exista otro garage con ese código
		if (updateData.code) {
			const garagesResult = await this.garageRepository.findAll(1, 1000);
			const codeExists = garagesResult.garages.some(
				(garage) => garage.code === updateData.code && garage.uuid !== uuid,
			);

			if (codeExists) {
				throw new Error('Ya existe un garage con este código');
			}
		}

		const updatedGarage = await this.garageRepository.update(uuid, updateData);

		if (!updatedGarage) {
			throw new Error('Error al actualizar el garage');
		}

		return updatedGarage;
	}
}
