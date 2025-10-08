import { Inject, Injectable } from "@nestjs/common";
import { Condition } from "../../../domain/entities/condition/condition.entity";
import type { ConditionRepository } from "../../../domain/repositories/condition.repository";

@Injectable()
export class GetConditionByUuidUseCase {
  constructor(
    @Inject('ConditionRepository')
    private readonly conditionRepository: ConditionRepository,
  ) {}

  async execute(uuid: string): Promise<Condition | null> {
    return await this.conditionRepository.findByUuid(uuid);
  }
}
