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
