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
