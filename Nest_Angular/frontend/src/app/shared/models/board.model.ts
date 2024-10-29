import { IUser } from "./user.model";

export interface IBoard {
    id: number;
    nome: string;
    users?: IUser[];
    swimlanes?: IUser[];
}

export interface ICreateBoard {
    nome: string;
}

export interface ISwimlanes {
    nome: string;
    ordem: number;
    boardId: number;
    board: IBoard;
    cards?: ICard[];
}

export interface ICard {
    id: number;
    nome: string;
    conteudo: string;
    ordem: number;
    responsavel?: IUser;
    swimlaneId: number;
    swimlane: ISwimlanes;
}