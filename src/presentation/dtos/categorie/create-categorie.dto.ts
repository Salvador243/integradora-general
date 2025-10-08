import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

export class CreateCategorieDto {
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
