export interface Producto{
  id: number;
  nombre: string;
  descripcion: string | null;
  descripcionExtensa: string | null; //nueva propiedad agregada
  precioUnitario: number;
  imageUrl: string | null;
  stock: number;
  categoriaProductoId: number;
  nombreCategoriaProducto: string;
  status: string;
}

export interface ApiProductoByIdResponse{
  data: Producto | null;
  success: boolean;
  message: string | null;
  errorMessage: string | null;
}

export interface ApiProductoByFilterResponse{
  data: Producto[] | null;
  success: boolean;
  message: string | null;
  errorMessage: string | null;
}

export interface ApiProductoResponse{
  data: number;
  success: boolean;
  message: string | null;
  errorMessage: string | null;
}

export interface ProductDataTable{
  id: number;
  nombre: string;
  descripcion: string | null;
  precioUnitario: number;
  stock: number;
  categoriaProducto: string;
  status: string;
}

