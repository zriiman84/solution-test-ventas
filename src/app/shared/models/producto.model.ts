export interface Producto{
  Id: number;
  Nombre: string;
  Descripcion: string | null;
  DescripcionExtensa: string | null; //nueva propiedad agregada
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

export interface ApiProductoByFilterResponse{
  Data: Producto[] | null;
  Sucess: boolean;
  Message: string | null;
  ErrorMessage: string | null;
}

export interface ApiProductoResponse{
  Data: number;
  Sucess: boolean;
  Message: string | null;
  ErrorMessage: string | null;
}

export interface ProductDataTable{
  Id: number;
  Nombre: string;
  Descripcion: string | null;
  PrecioUnitario: number;
  Stock: number;
  CategoriaProducto: string;
  Status: string;
}

