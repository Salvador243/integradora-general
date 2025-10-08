import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategorieEntity } from '../../infrastructure/database/entities/categorie.entity';
import { CategorieController } from '../controllers/categorie/categorie.controller';
import { CATEGORIE_USE_CASES } from 'src/application/use-cases/categorie/exports-provider.use-case';
import { ApiCategorieRepository } from '../../infrastructure/repositories/api-categorie.repository';

@Module({
	imports: [TypeOrmModule.forFeature([CategorieEntity])],
	controllers: [CategorieController],
	providers: [
		// Use Cases
		...CATEGORIE_USE_CASES,
		// Repository
		{
			provide: 'CategorieRepository',
			useClass: ApiCategorieRepository,
		},
	],
})
export class CategorieModule {}
