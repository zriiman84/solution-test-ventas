export interface Login{
  token: string;
  expirationdatetime: string;
}

export interface ApiLoginResponse{
    data: Login;
    sucess: boolean;
    message: string | null;
    errorMessage: string | null;
}

export interface ApiUsuarioRequest{
    firstname: string;
    lastname: string;
    username: string;
    email: string;
    password: string;
    documenttype: string;
    documentnumber: string;
    age: number;  //se validará que se ingrese un entero en el formulario
}
