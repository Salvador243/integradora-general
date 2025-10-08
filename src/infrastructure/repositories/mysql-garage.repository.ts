import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { GarageRepository } from "../../domain/repositories/garage.repository";
import { Garage } from "../../domain/entities/garage/garage.entity";
import { GarageEntity } from "../database/entities/garage.entity";

@Injectable()
export class MySqlGarageRepository implements GarageRepository {
	constructor(
		@InjectRepository(GarageEntity)
		private readonly garageRepository: Repository<GarageEntity>,
	) {}

	async create(garage: Omit<Garage, "uuid">): Promise<Garage> {
		const garageEntity = this.garageRepository.create(garage);
		const savedGarage = await this.garageRepository.save(garageEntity);
		return new Garage(
			savedGarage.uuid,
			savedGarage.code,
			savedGarage.name,
			savedGarage.status,
		);
	}

	async findAll(
		page: number,
		limit: number,
	): Promise<{ garages: Garage[]; total: number }> {
		const skip = (page - 1) * limit;
		const [garageEntities, total] = await this.garageRepository.findAndCount({
			skip,
			take: limit,
			order: { name: "ASC" },
		});

		const garages = garageEntities.map(
			(entity) =>
				new Garage(entity.uuid, entity.code, entity.name, entity.status),
		);

		return { garages, total };
	}

	async findByUuid(uuid: string): Promise<Garage | null> {
		const garageEntity = await this.garageRepository.findOne({
			where: { uuid },
		});

		if (!garageEntity) {
			return null;
		}

		return new Garage(
			garageEntity.uuid,
			garageEntity.code,
			garageEntity.name,
			garageEntity.status,
		);
	}

	async update(
		uuid: string,
		garage: Partial<Omit<Garage, "uuid">>,
	): Promise<Garage | null> {
		const updateResult = await this.garageRepository.update({ uuid }, garage);

		if (updateResult.affected === 0) {
			return null;
		}

		return await this.findByUuid(uuid);
	}

	async delete(uuid: string): Promise<boolean> {
		const deleteResult = await this.garageRepository.delete({ uuid });
		return deleteResult.affected ? deleteResult.affected > 0 : false;
	}
}
