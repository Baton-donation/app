import { Entity, Column, PrimaryColumn, Index } from "typeorm";

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

  @Index()
  @Column()
  content!: string;
}
