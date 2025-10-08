import { IsString, IsNotEmpty, IsBoolean, IsOptional, MaxLength } from 'class-validator';

export class CreateConditionDto {
	@IsString()
	@IsNotEmpty()
	@MaxLength(100)
	code: string;

	@IsString()
	@IsNotEmpty()
	@MaxLength(255)
	description: string;

	@IsBoolean()
	@IsOptional()
	status?: boolean;
}
