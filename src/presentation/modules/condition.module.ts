import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConditionEntity } from '../../infrastructure/database/entities/condition.entity';
import { ConditionController } from '../controllers/condition/condition.controller';
import { CONDITION_USE_CASES } from 'src/application/use-cases/condition/exports-provider.use-case';
import { ApiConditionRepository } from '../../infrastructure/repositories/api-condition.repository';

@Module({
	imports: [TypeOrmModule.forFeature([ConditionEntity])],
	controllers: [ConditionController],
	providers: [
		// Use Cases
		...CONDITION_USE_CASES,
		// Repository
		{
			provide: 'ConditionRepository',
			useClass: ApiConditionRepository,
		},
	],
})
export class ConditionModule {}
