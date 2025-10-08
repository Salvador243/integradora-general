import { Garage } from "../entities/garage/garage.entity";

export interface GarageRepository {
	create(garage: Omit<Garage, "uuid">): Promise<Garage>;

	findAll(
		page: number,
		limit: number,
	): Promise<{ garages: Garage[]; total: number }>;

	findByUuid(uuid: string): Promise<Garage | null>;

	update(
		uuid: string,
		garage: Partial<Omit<Garage, "uuid">>,
	): Promise<Garage | null>;

	delete(uuid: string): Promise<boolean>;
}
