import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GarageEntity } from '../../infrastructure/database/entities/garage.entity';
import { GarageController } from '../controllers/garage/garage.controller';
import { MySqlGarageRepository } from '../../infrastructure/repositories/mysql-garage.repository';
import { GARAGE_USE_CASES } from 'src/application/use-cases/garage/exports.provider.use-case';

@Module({
	imports: [TypeOrmModule.forFeature([GarageEntity])],
	controllers: [GarageController],
	providers: [
		// Use Cases
		...GARAGE_USE_CASES,
		// Repository
		{
			provide: 'GarageRepository',
			useClass: MySqlGarageRepository,
		},
	],
})
export class GarageModule {}
