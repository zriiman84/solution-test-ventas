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

export interface ApiRegisterUserRequest{
    firstname: string;
    lastname: string;
    username: string;
    email: string;
    password: string;
    confirmpassword: string;
    documenttype: number; //se validará que se ingrese un entero desde el formulario
    documentnumber: string;
    age: number;  //se validará que se ingrese un entero desde el formulario
}

export interface ApiRegisterUserResponse{
  data: {
    userId: number;
    token: string;
    expirationdatetime: string;
  };
  sucess: boolean;
  message: string | null;
  errorMessage: string | null;
}

export interface BaseResponseGeneric{
  data: any | null;
  sucess: boolean;
  message: string | null;
  errorMessage: string | null;
}

export interface BaseResponse{
  sucess: boolean;
  message: string | null;
  errorMessage: string | null;
}
