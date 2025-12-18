export interface Login{
  token: string;
  expirationDateTime: string;
}

export interface ApiLoginResponse{
    data: Login;
    success: boolean;
    message: string | null;
    errorMessage: string | null;
}

export interface ApiRegisterUserRequest{
    firstName: string;
    lastName: string;
    userName: string;
    email: string;
    password: string;
    confirmPassword: string;
    documentType: number; //se validará que se ingrese un entero desde el formulario
    documentNumber: string;
    age: number;  //se validará que se ingrese un entero desde el formulario
}

export interface ApiRegisterUserResponse{
  data: {
    userId: number;
    token: string;
    expirationDateTime: string;
  };
  success: boolean;
  message: string | null;
  errorMessage: string | null;
}

export interface ApiResetPasswordRequest{
    email: string;
    token: string;
    newPassword: string;
    confirmNewPassword: string;
}

export interface ApiChangePasswordRequest{
    oldPassword: string;
    newPassword: string;
}
