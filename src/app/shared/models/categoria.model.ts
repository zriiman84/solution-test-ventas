export interface CategoriaProducto{
  Id: number;
  Nombre: string;
  Descripcion: string | null;
  Status: string;
}

export interface ApiCategoriaByIdResponse{
  Data: CategoriaProducto | null;
  Sucess: boolean;
  Message: string | null;
  ErrorMessage: string | null;
}

export interface ApiCategoriaByFilterResponse{
  Data: CategoriaProducto[] | null;
  Sucess: boolean;
  Message: string | null;
  ErrorMessage: string | null;
}

export interface ApiCategoriaResponse{
  Data: number;
  Sucess: boolean;
  Message: string | null;
  ErrorMessage: string | null;
}
