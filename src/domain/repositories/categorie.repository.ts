import { Categorie } from "../entities/categorie/categorie.entity";

export interface CategorieRepository {
	create(tool: Omit<Categorie, "uuid">): Promise<Categorie>;

	findAll(page: number, limit: number): Promise<{ categories: Categorie[]; total: number }>;

	findByUuid(uuid: string): Promise<Categorie | null>;

	update(
		uuid: string,
		tool: Partial<Omit<Categorie, "uuid">>,
	): Promise<Categorie | null>;

	delete(uuid: string): Promise<boolean>;
}