import { Provider } from "@nestjs/common";
import { CreateGarageUseCase } from "./create-garage.use-case";
import { GetGaragesUseCase } from "./get-garages.use-case";
import { GetGarageByIdUseCase } from "./get-garage-by-id.use-case";
import { UpdateGarageUseCase } from "./update-garage.use-case";
import { DeleteGarageUseCase } from "./delete-garage.use-case";

export const GARAGE_USE_CASES: Provider[] = [
	CreateGarageUseCase,
	GetGaragesUseCase,
	GetGarageByIdUseCase,
	UpdateGarageUseCase,
	DeleteGarageUseCase,
];