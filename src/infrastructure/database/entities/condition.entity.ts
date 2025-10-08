import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("conditions")
export class ConditionEntity {
	@PrimaryGeneratedColumn("uuid")
	uuid: string;

	@Column({ type: "varchar", length: 100, unique: true })
	code: string;

	@Column({ type: "varchar", length: 255 })
	description: string;

	@Column({ type: "boolean", default: true })
	status: boolean;
}
