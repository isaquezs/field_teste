export interface ILogin {
    email: string;
    senha: string;
}

export interface IRegister extends ILogin {
    nome: string;
    sobrenome: string;
}

export interface ILoginRespose {
    authToken: string;
}