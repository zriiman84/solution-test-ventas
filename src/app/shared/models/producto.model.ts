export interface Producto{
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imageUrl: string | null;
  stock: number;
  idCategoriaProducto: number;
  nombreCategoriaProducto: string;
  status: string;
}

export interface ApiProductoResponseById{
  data: Producto | null;
  sucess: boolean;
  message: string | null;
  errorMessage: string | null;
}

export interface ApiProductoResponseByNombre{
  data: Producto[] | null;
  sucess: boolean;
  message: string | null;
  errorMessage: string | null;
}

