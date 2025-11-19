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

export interface ProductoResponseById{
  data: Producto;
  sucess: boolean;
  message: string | null;
  errorMessage: string | null;
}

