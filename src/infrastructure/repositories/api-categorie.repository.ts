import { Injectable } from '@nestjs/common';
import { CategorieRepository } from '../../domain/repositories/categorie.repository';
import { Categorie } from '../../domain/entities/categorie/categorie.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategorieEntity } from '../database/entities/categorie.entity';

@Injectable()
export class ApiCategorieRepository implements CategorieRepository {
	constructor(
		@InjectRepository(CategorieEntity)
		private readonly categorieRepository: Repository<CategorieEntity>,
	) {}

	async create(categorie: Omit<Categorie, 'uuid'>): Promise<Categorie> {
		const categorieEntity = this.categorieRepository.create(categorie);
		const savedCategorie = await this.categorieRepository.save(categorieEntity);
		return new Categorie(
			savedCategorie.uuid,
			savedCategorie.name,
			savedCategorie.code,
			savedCategorie.status,
		);
	}

	async findAll(
		page: number,
		limit: number,
	): Promise<{ categories: Categorie[]; total: number }> {
		const skip = (page - 1) * limit;
		const [categoryEntities, total] = await this.categorieRepository.findAndCount({
			skip,
			take: limit,
			order: { name: 'ASC' },
		});

		const categories = categoryEntities.map(
			(entity) =>
				new Categorie(entity.uuid, entity.name, entity.code, entity.status),
		);

		return {
			categories,
			total,
		};
	}

	async findByUuid(uuid: string): Promise<Categorie | null> {
		const categorieEntity = await this.categorieRepository.findOneBy({ uuid });
		if (!categorieEntity) return null;
		return new Categorie(
			categorieEntity.uuid,
			categorieEntity.name,
			categorieEntity.code,
			categorieEntity.status,
		);
	}

	async update(
		uuid: string,
		categorie: Partial<Omit<Categorie, 'uuid'>>,
	): Promise<Categorie | null> {
		const categorieEntity = await this.categorieRepository.findOneBy({ uuid });
		if (!categorieEntity) return null;
		const updatedCategorieEntity = this.categorieRepository.merge(categorieEntity, categorie);
		const updatedCategorie = await this.categorieRepository.save(updatedCategorieEntity);
		return new Categorie(
			updatedCategorie.uuid,
			updatedCategorie.name,
			updatedCategorie.code,
			updatedCategorie.status,
		);
	}

	async delete(uuid: string): Promise<boolean> {
		const deleted = await this.categorieRepository.delete(uuid);
		return deleted.affected ? deleted.affected > 0 : false;
	}
}
