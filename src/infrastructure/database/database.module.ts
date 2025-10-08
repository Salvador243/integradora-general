import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GarageEntity } from './entities/garage.entity';
import { CategorieEntity } from './entities/categorie.entity';
import { ConditionEntity } from './entities/condition.entity';

@Module({
	imports: [
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: (configService: ConfigService) => ({
				type: 'mysql',
				host: configService.get<string>('DB_HOST', 'localhost'),
				port: configService.get<number>('DB_PORT', 3306),
				username: configService.get<string>('DB_USERNAME', 'root'),
				password: configService.get<string>('DB_PASSWORD', ''),
				database: configService.get<string>('DB_DATABASE', 'general_db'),
				entities: [GarageEntity, CategorieEntity, ConditionEntity],
				synchronize: configService.get<string>('NODE_ENV') !== 'production',
				logging: configService.get<string>('NODE_ENV') === 'development',
			}),
			inject: [ConfigService],
		}),
		TypeOrmModule.forFeature([GarageEntity, CategorieEntity, ConditionEntity]),
	],
	exports: [TypeOrmModule],
})
export class DatabaseModule {}
