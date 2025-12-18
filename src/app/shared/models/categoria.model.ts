export interface CategoriaProducto{
  id: number;
  nombre: string;
  descripcion: string | null;
  status: string;
}

export interface ApiCategoriaByIdResponse{
  data: CategoriaProducto | null;
  success: boolean;
  message: string | null;
  errorMessage: string | null;
}

export interface ApiCategoriaByFilterResponse{
  data: CategoriaProducto[] | null;
  success: boolean;
  message: string | null;
  errorMessage: string | null;
}

export interface ApiCategoriaResponse{
  data: number;
  success: boolean;
  message: string | null;
  errorMessage: string | null;
}

export interface ApiCategoriaProductoRequest{
  nombre: string;
  descripcion: string | null;
}

export interface CategoriaDataTable{
  id: number;
  nombre: string;
  descripcion: string | null;
  status: string;
}
