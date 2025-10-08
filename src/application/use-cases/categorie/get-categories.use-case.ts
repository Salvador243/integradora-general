import { Inject, Injectable } from '@nestjs/common';
import { Categorie } from 'src/domain/entities/categorie/categorie.entity';
import type { CategorieRepository } from 'src/domain/repositories/categorie.repository';

@Injectable()
export class GetCategoriesUseCase {
	constructor(
		@Inject('CategorieRepository')
		private readonly categorieRepository: CategorieRepository,
	) {}

	async execute(
		page: number,
		limit: number,
	): Promise<{ categories: Categorie[]; total: number }> {
		return this.categorieRepository.findAll(page, limit);
	}
}
