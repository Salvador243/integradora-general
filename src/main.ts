import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	// Habilitar CORS para permitir conexiones desde localhost:4200
	app.enableCors({
		origin: ['http://localhost:4200'],
		methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
		allowedHeaders: ['Content-Type', 'Authorization'],
		credentials: true,
	});

	// Habilitar validación global
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
			transform: true,
		}),
	);

	await app.listen(process.env.PORT ?? 3001);
	console.log(
		`Aplicación corriendo en: http://localhost:${process.env.PORT ?? 3001}`,
	);
}

bootstrap();
