import { Inject, Injectable } from "@nestjs/common";
import { Categorie } from "src/domain/entities/categorie/categorie.entity";
import type { CategorieRepository } from "src/domain/repositories/categorie.repository";

@Injectable()
export class UpdateCategorieUseCase {
  constructor(
    @Inject('CategorieRepository')
    private readonly categorieRepository: CategorieRepository,
  ){}

  async execute(uuid: string, categorie: Partial<Categorie>): Promise<Categorie | null> {
    return this.categorieRepository.update(uuid, categorie);
  }
}