import { IsString, IsBoolean, IsOptional, MaxLength } from 'class-validator';

export class UpdateConditionDto {
	@IsString()
	@IsOptional()
	@MaxLength(100)
	code?: string;

	@IsString()
	@IsOptional()
	@MaxLength(255)
	description?: string;

	@IsBoolean()
	@IsOptional()
	status?: boolean;
}
