import { Inject, Injectable } from "@nestjs/common";
import type { ConditionRepository } from "../../../domain/repositories/condition.repository";

@Injectable()
export class DeleteConditionUseCase {
  constructor(
    @Inject('ConditionRepository')
    private readonly conditionRepository: ConditionRepository,
  ) {}

  async execute(uuid: string): Promise<boolean> {
    return await this.conditionRepository.delete(uuid);
  }
}
