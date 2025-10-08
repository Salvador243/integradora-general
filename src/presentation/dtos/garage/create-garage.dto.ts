import {
	IsString,
	IsBoolean,
	IsOptional,
	IsNotEmpty,
	MaxLength,
} from 'class-validator';

export class CreateGarageDto {
	@IsString()
	@IsNotEmpty()
	@MaxLength(100)
	code: string;

	@IsString()
	@IsNotEmpty()
	@MaxLength(255)
	name: string;

	@IsBoolean()
	@IsOptional()
	status?: boolean;
}
