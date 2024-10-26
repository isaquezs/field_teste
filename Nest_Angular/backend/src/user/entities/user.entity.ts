import { BeforeInsert, Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Board } from 'src/board/entities/board.entity';
import { Card } from 'src/card/entities/card.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({length: 100})
    PrimeiroNome: string;

    @Column({length: 100})
    UltimoNome: string;
    
    @Column({length: 100})
    Email: string;

    @Column({length: 200})
    senha: string;

    @Column({default: false})
    EmailVeriicado: boolean;

    @ManyToMany(() => Board, (board) => board.users)
    @JoinTable()
    boards: Board[];

    @OneToMany(() => Card, (user) => user.responsavel)
    cards: Card[];

    @BeforeInsert()
    async hashSenha() {
        // Se a senha está setada, então criptografa ela
        if(this.senha) {
            this.senha = await bcrypt.hash(this.senha, 10);
        }
    }
}