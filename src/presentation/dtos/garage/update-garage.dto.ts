import { IsString, IsBoolean, IsOptional, MaxLength } from 'class-validator';

export class UpdateGarageDto {
	@IsString()
	@IsOptional()
	@MaxLength(100)
	code?: string;

	@IsString()
	@IsOptional()
	@MaxLength(255)
	name?: string;

	@IsBoolean()
	@IsOptional()
	status?: boolean;
}
