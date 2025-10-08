import { Inject, Injectable } from '@nestjs/common';
import type { CategorieRepository } from 'src/domain/repositories/categorie.repository';

@Injectable()
export class DeleteCategorieUseCase {
	constructor(
		@Inject('CategorieRepository')
		private readonly categorieRepository: CategorieRepository,
	) {}

	async execute(uuid: string): Promise<void> {
		await this.categorieRepository.delete(uuid);
	}
}
