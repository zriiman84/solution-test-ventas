export interface Login{
  Token: string;
  ExpirationDateTime: string;
}

export interface ApiLoginResponse{
    Data: Login;
    Sucess: boolean;
    Message: string | null;
    ErrorMessage: string | null;
}

export interface ApiRegisterUserRequest{
    FirstName: string;
    LastName: string;
    UserName: string;
    Email: string;
    Password: string;
    ConfirmPassword: string;
    DocumentType: number; //se validará que se ingrese un entero desde el formulario
    DocumentNumber: string;
    Age: number;  //se validará que se ingrese un entero desde el formulario
}

export interface ApiRegisterUserResponse{
  Data: {
    UserId: number;
    Token: string;
    ExpirationDateTime: string;
  };
  Sucess: boolean;
  Message: string | null;
  ErrorMessage: string | null;
}

export interface BaseResponseGeneric{
  Data: any | null;
 Sucess: boolean;
  Message: string | null;
  ErrorMessage: string | null;
}

export interface BaseResponse{
  Sucess: boolean;
  Message: string | null;
  ErrorMessage: string | null;
}

export interface ApiResetPasswordRequest{
    Email: string;
    Token: string;
    NewPassword: string;
    ConfirmNewPassword: string;
}
