import { Provider } from '@nestjs/common';
import { CreateCategorieUseCase } from './create-categorie.use-case';
import { DeleteCategorieUseCase } from './delete-categorie.use-case';
import { GetCategorieByUuidUseCase } from './get-categorie-by-id.use-case';
import { UpdateCategorieUseCase } from './update-categorie.use-case';
import { GetCategoriesUseCase } from './get-categories.use-case';

export const CATEGORIE_USE_CASES: Provider[] = [
	CreateCategorieUseCase,
	DeleteCategorieUseCase,
	GetCategorieByUuidUseCase,
	UpdateCategorieUseCase,
	GetCategoriesUseCase,
];
