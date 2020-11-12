import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class App {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  path!: string;

  @Column()
  hash!: string;

  @Column()
  updatedAt!: Date;
}
