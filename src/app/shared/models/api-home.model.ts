import { CategoriaProducto } from "./categoria.model";
import { Producto } from "./producto.model";

export interface ApiHomeResponse{
  categorias: CategoriaProducto[];
  productos: Producto[];
  sucess: boolean;
}
