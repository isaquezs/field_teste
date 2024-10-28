import { Swimlane } from 'src/swimlane/entities/swimlane.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Card {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nome: string;

  @Column()
  content: string;

  @Column()
  order: number;

  @Column({ nullable: true })
  responsavelId: number;

  @ManyToOne(() => User, (user) => user.cards)
  @JoinColumn()
  assigne: User;

  @Column()
  swimlaneId: number;

  @ManyToOne(() => Swimlane, (swimlane) => swimlane.cards)
  @JoinColumn()
  swimlane: Swimlane;
}
