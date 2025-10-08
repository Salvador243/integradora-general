import { Inject, Injectable } from "@nestjs/common";
import { Condition } from "../../../domain/entities/condition/condition.entity";
import type { ConditionRepository } from "../../../domain/repositories/condition.repository";

@Injectable()
export class CreateConditionUseCase {
  constructor(
    @Inject('ConditionRepository')
    private readonly conditionRepository: ConditionRepository,
  ) {}

  async execute(
    code: string,
    description: string,
    status: boolean = true,
  ): Promise<Condition> {
    // Validar que el código no exista
    const existingConditions = await this.conditionRepository.findAll(1, 1000);
    const codeExists = existingConditions.conditions.some(
      (condition) => condition.code === code,
    );

    if (codeExists) {
      throw new Error('Ya existe una condición con este código');
    }

    return await this.conditionRepository.create({
      code,
      description,
      status,
    });
  }
}
