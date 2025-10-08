import { Injectable } from '@nestjs/common';
import { ConditionRepository } from '../../domain/repositories/condition.repository';
import { Condition } from '../../domain/entities/condition/condition.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConditionEntity } from '../database/entities/condition.entity';

@Injectable()
export class ApiConditionRepository implements ConditionRepository {
	constructor(
		@InjectRepository(ConditionEntity)
		private readonly conditionRepository: Repository<ConditionEntity>,
	) {}

	async create(condition: Omit<Condition, 'uuid'>): Promise<Condition> {
		const conditionEntity = this.conditionRepository.create(condition);
		const savedCondition = await this.conditionRepository.save(conditionEntity);
		return new Condition(
			savedCondition.uuid,
			savedCondition.code,
			savedCondition.description,
			savedCondition.status,
		);
	}

	async findAll(
		page: number,
		limit: number,
	): Promise<{ conditions: Condition[]; total: number }> {
		const skip = (page - 1) * limit;
		const [conditionEntities, total] = await this.conditionRepository.findAndCount({
			skip,
			take: limit,
			order: { code: 'ASC' },
		});

		const conditions = conditionEntities.map(
			(entity) =>
				new Condition(entity.uuid, entity.code, entity.description, entity.status),
		);

		return {
			conditions,
			total,
		};
	}

	async findByUuid(uuid: string): Promise<Condition | null> {
		const conditionEntity = await this.conditionRepository.findOneBy({ uuid });
		if (!conditionEntity) return null;
		return new Condition(
			conditionEntity.uuid,
			conditionEntity.code,
			conditionEntity.description,
			conditionEntity.status,
		);
	}

	async update(
		uuid: string,
		condition: Partial<Omit<Condition, 'uuid'>>,
	): Promise<Condition | null> {
		const conditionEntity = await this.conditionRepository.findOneBy({ uuid });
		if (!conditionEntity) return null;
		const updatedConditionEntity = this.conditionRepository.merge(conditionEntity, condition);
		const updatedCondition = await this.conditionRepository.save(updatedConditionEntity);
		return new Condition(
			updatedCondition.uuid,
			updatedCondition.code,
			updatedCondition.description,
			updatedCondition.status,
		);
	}

	async delete(uuid: string): Promise<boolean> {
		const deleted = await this.conditionRepository.delete(uuid);
		return deleted.affected ? deleted.affected > 0 : false;
	}
}
