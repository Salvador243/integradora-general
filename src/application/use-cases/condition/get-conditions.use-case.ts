import { Inject, Injectable } from "@nestjs/common";
import { Condition } from "../../../domain/entities/condition/condition.entity";
import type { ConditionRepository } from "../../../domain/repositories/condition.repository";

@Injectable()
export class GetConditionsUseCase {
  constructor(
    @Inject('ConditionRepository')
    private readonly conditionRepository: ConditionRepository,
  ) {}

  async execute(
    page: number,
    limit: number,
  ): Promise<{ conditions: Condition[]; total: number }> {
    return await this.conditionRepository.findAll(page, limit);
  }
}
