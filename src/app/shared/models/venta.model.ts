export interface Venta {
  IdVenta: number;
  ClienteId: number;
  EmpleadoId: number | null;
  FechaVenta: string;
  HoraVenta: string;
  NumeroOperacion: string;
  NombreCompletoCliente: string;
  NombreCompletoEmpleado: string | null;
  MontoTotalVenta: number;
  CantidadTotalArticulos: number;
  DetalleVenta: DetalleVentaInfo[];
}

export interface DetalleVentaInfo {
  ProductoId: number;
  NombreProducto: string;
  CategoriaProductoId: number;
  NombreCategoriaProducto: string;
  Cantidad: number;
  Precio: number;
  SubTotal: number;
}

export interface ApiVentaRequest {
  EmpleadoId: number | null;
  DetalleVenta: DetalleVentaRequest[];
}

export interface DetalleVentaRequest {
  ProductoId: number;
  Cantidad: number;
}

export interface ApiVentaResponse {
  Data: number;
  Sucess: boolean;
  Message: string | null;
  ErrorMessage: string | null;
}

export interface ApiVentaByIdResponse {
  Data: Venta | null;
  Sucess: boolean;
  Message: string | null;
  ErrorMessage: string | null;
}

export interface ApiVentaByFiltersResponse {
  Data: Venta[] | null;
  Sucess: boolean;
  Message: string | null;
  ErrorMessage: string | null;
}

export interface ShoppingCarItem {
  Id: number;
  NombreProducto: string;
  PrecioUnitario: number;
  Cantidad: number;
  SubTotal: number;
  CategoriaProducto: string;
}

export interface VentaDataTable {
  IdVenta: number;
  NumeroOperacion: string;
  FechaVenta: string;
  HoraVenta: string;
  MontoTotalVenta: number;
  CantidadTotalArticulos: number;
}
