import {
  BeforeInsert,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Board } from 'src/board/entities/board.entity';
import { Card } from 'src/card/entities/card.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nome: string;

  @Column({ length: 100 })
  sobrenome: string;

  @Column({ length: 100 })
  email: string;

  @Column({ length: 200 })
  senha: string;

  @Column({ default: false })
  emailVerificado: boolean;

  @ManyToMany(() => Board, (board) => board.users)
  @JoinTable()
  boards: Board[];

  @OneToMany(() => Card, (user) => user.responsavel)
  cards: Card[];

  @BeforeInsert()
  async hashPassword() {
    if (this.senha) {
      this.senha = await bcrypt.hash(this.senha, 10);
    }
  }
}
