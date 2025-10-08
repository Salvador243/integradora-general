import { Inject, Injectable } from "@nestjs/common";
import { Categorie } from "src/domain/entities/categorie/categorie.entity";
import type { CategorieRepository } from "src/domain/repositories/categorie.repository";

@Injectable()
export class GetCategorieByUuidUseCase {
	constructor(
		@Inject('CategorieRepository')
		private readonly categorieRepository: CategorieRepository,
  ) {}

	async execute(uuid: string): Promise<Categorie | null> {
		return this.categorieRepository.findByUuid(uuid);
	}
}