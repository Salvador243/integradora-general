import { Condition } from "../entities/condition/condition.entity";

export interface ConditionRepository {
	create(condition: Omit<Condition, "uuid">): Promise<Condition>;

	findAll(page: number, limit: number): Promise<{ conditions: Condition[]; total: number }>;

	findByUuid(uuid: string): Promise<Condition | null>;

	update(
		uuid: string,
		condition: Partial<Omit<Condition, "uuid">>,
	): Promise<Condition | null>;

	delete(uuid: string): Promise<boolean>;
}
