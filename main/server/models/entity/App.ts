import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { EPossibleSources } from "../../apps/types";

@Entity()
export class App {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: EPossibleSources;

  @Column()
  path!: string;

  @Column()
  hash!: string;

  @Column()
  updatedAt!: Date;
}
