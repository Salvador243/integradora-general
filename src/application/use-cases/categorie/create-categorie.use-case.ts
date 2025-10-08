import { Inject, Injectable } from "@nestjs/common";
import { Categorie } from "../../../domain/entities/categorie/categorie.entity";
import type { CategorieRepository } from "../../../domain/repositories/categorie.repository";

@Injectable()
export class CreateCategorieUseCase {
  constructor(
    @Inject('CategorieRepository')
    private readonly categorieRepository: CategorieRepository,
  ) {}

  async execute(
    name: string,
    code: string,
    status: boolean = true,
  ): Promise<Categorie> {
    // Validar que el código no exista
    const existingCategorie = await this.categorieRepository.findAll(1, 1000);
    const codeExists = existingCategorie.categories.some(
      (categorie) => categorie.code === code,
    );

    if (codeExists) {
      throw new Error('Ya existe una categoría con este código');
    }

    return await this.categorieRepository.create({
      name,
      code,
      status,
    });
  }
}