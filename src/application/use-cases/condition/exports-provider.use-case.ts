import { CreateConditionUseCase } from './create-condition.use-case';
import { DeleteConditionUseCase } from './delete-condition.use-case';
import { GetConditionByUuidUseCase } from './get-condition-by-id.use-case';
import { GetConditionsUseCase } from './get-conditions.use-case';
import { UpdateConditionUseCase } from './update-condition.use-case';

export const CONDITION_USE_CASES = [
	CreateConditionUseCase,
	DeleteConditionUseCase,
	GetConditionByUuidUseCase,
	GetConditionsUseCase,
	UpdateConditionUseCase,
];
