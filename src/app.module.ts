import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './infrastructure/database/database.module';
import { HttpExceptionFilter } from './shared/filters/http-exception.filter';
import { GarageModule } from './presentation/modules/garage.module';
import { CategorieModule } from './presentation/modules/categorie.module';
import { ConditionModule } from './presentation/modules/condition.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: '.env',
		}),
		DatabaseModule,
		GarageModule,
		CategorieModule,
		ConditionModule,
	],
	controllers: [AppController],
	providers: [
		AppService,
		{
			provide: APP_FILTER,
			useClass: HttpExceptionFilter,
		},
	],
})
export class AppModule {}
