import { CategoriaProducto } from "./categoria.model";
import { Producto } from "./producto.model";

export interface ApiHomeResponse{
  categorias: CategoriaProducto[] | null;
  productos: Producto[] | null;
  sucess: boolean;
}
