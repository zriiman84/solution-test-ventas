export interface Venta {
  idVenta: number;
  clienteId: number;
  empleadoId: number | null;
  fechaVenta: string;
  horaVenta: string;
  numeroOperacion: string;
  nombreCompletoCliente: string;
  nombreCompletoEmpleado: string | null;
  montoTotalVenta: number;
  cantidadTotalArticulos: number;
  detalleVenta: DetalleVentaInfo[];
}

export interface DetalleVentaInfo {
  productoId: number;
  nombreProducto: string;
  categoriaProductoId: number;
  nombreCategoriaProducto: string;
  cantidad: number;
  precio: number;
  subTotal: number;
}

export interface ApiVentaRequest {
  empleadoId: number | null;
  detalleVenta: DetalleVentaRequest[];
}

export interface DetalleVentaRequest {
  productoId: number;
  cantidad: number;
}

export interface ApiVentaResponse {
  data: number;
  success: boolean;
  message: string | null;
  errorMessage: string | null;
}

export interface ApiVentaByIdResponse {
  data: Venta | null;
  success: boolean;
  message: string | null;
  errorMessage: string | null;
}

export interface ApiVentaByFiltersResponse {
  data: Venta[] | null;
  success: boolean;
  message: string | null;
  errorMessage: string | null;
}

export interface ShoppingCarItem {
  id: number;
  nombreProducto: string;
  precioUnitario: number;
  cantidad: number;
  subTotal: number;
  categoriaProducto: string;
}

export interface VentaDataTable {
  idVenta: number;
  numeroOperacion: string;
  nombreCompletoCliente: string;
  fechaVenta: string;
  horaVenta: string;
  montoTotalVenta: number;
  cantidadTotalArticulos: number;
}

export interface VentaReporteCliente {
  emailCliente: string;
  nombreCliente: string;
  cantidadTotalArticulos: number;
  montoTotalVenta: number;
}

export interface ApiVentaReporteClienteResponse {
  data: VentaReporteCliente[] | null;
  success: boolean;
  message: string | null;
  errorMessage: string | null;
}

export interface VentaReporteProducto {
  idProducto: number;
  nombreProducto: string;
  cantidadTotalArticulos: number;
  montoTotalProducto: number;
}
export interface ApiVentaReporteProductoResponse {
  data: VentaReporteProducto[] | null;
  success: boolean;
  message: string | null;
  errorMessage: string | null;
}
