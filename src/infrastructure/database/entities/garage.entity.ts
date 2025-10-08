import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("garage")
export class GarageEntity {
	@PrimaryGeneratedColumn("uuid")
	uuid: string;

	@Column({ type: "varchar", length: 100, unique: true })
	code: string;

	@Column({ type: "varchar", length: 255 })
	name: string;

	@Column({ type: "boolean", default: true })
	status: boolean;
}
