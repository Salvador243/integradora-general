import { Injectable, Inject } from '@nestjs/common';
import type { GarageRepository } from '../../../domain/repositories/garage.repository';

@Injectable()
export class DeleteGarageUseCase {
	constructor(
		@Inject('GarageRepository')
		private readonly garageRepository: GarageRepository,
	) {}

	async execute(uuid: string): Promise<void> {
		// Verificar que el garage existe
		const existingGarage = await this.garageRepository.findByUuid(uuid);
		if (!existingGarage) {
			throw new Error('Garage no encontrado');
		}

		const deleted = await this.garageRepository.delete(uuid);

		if (!deleted) {
			throw new Error('Error al eliminar el garage');
		}
	}
}
