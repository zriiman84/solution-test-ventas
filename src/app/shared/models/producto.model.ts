export interface Producto{
  Id: number;
  Nombre: string;
  Descripcion: string;
  PrecioUnitario: number;
  ImageUrl: string | null;
  Stock: number;
  CategoriaProductoId: number;
  NombreCategoriaProducto: string;
  Status: string;
}

export interface ApiProductoByIdResponse{
  Data: Producto | null;
  Sucess: boolean;
  Message: string | null;
  ErrorMessage: string | null;
}

export interface ApiProductoByNombreResponse{
  Data: Producto[] | null;
  Sucess: boolean;
  Message: string | null;
  ErrorMessage: string | null;
}

