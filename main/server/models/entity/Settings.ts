import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Settings {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  includeUUID!: boolean;

  @Column()
  uuid!: string;

  @Column()
  defaultToAllSelected!: boolean;

  @Column()
  sentencesPerPage!: number;
}
