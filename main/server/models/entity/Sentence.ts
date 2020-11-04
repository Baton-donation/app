import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity()
export class Sentence {
  @PrimaryColumn()
  uuid!: string;

  @Column()
  createdAt!: Date;

  @Column()
  submitted!: boolean;

  @Column()
  viewed!: boolean;

  @Column()
  content!: string;
}
