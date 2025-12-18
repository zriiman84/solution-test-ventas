export interface BaseResponseGeneric{
  data: any | null;
 success: boolean;
  message: string | null;
  errorMessage: string | null;
}

export interface BaseResponse{
  success: boolean;
  message: string | null;
  errorMessage: string | null;
}
