import { Component, inject, OnInit } from '@angular/core';
import { VentaService } from '../../services/venta-service/venta-service';
import { DialogRef } from '@angular/cdk/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiVentaByIdResponse, DetalleVentaInfo, Venta } from '../../models/venta.model';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-voucher-dialog',
  imports: [MatButtonModule,MatTableModule],
  templateUrl: './voucher-dialog.html',
  styleUrl: './voucher-dialog.css',
})
export class VoucherDialog implements OnInit {

  private ventaService = inject(VentaService);
  private dialogRef = inject(DialogRef);
  SaleId = inject(MAT_DIALOG_DATA) as number;
  venta: Venta | null = null;
  detalleVentaInfo: DetalleVentaInfo[] = [];
  displayedColumns: string[] = [
    'Producto',
    'Precio',
    'Cantidad',
    'SubTotal'
  ];

  ngOnInit() {

    this.ventaService
      .getSaleById(this.SaleId.toString())
      .subscribe((respVenta: ApiVentaByIdResponse) => {
        this.venta = respVenta.data;
        this.detalleVentaInfo = respVenta.data?.detalleVenta!;
      });

  }

  imprimir() {
    alert('Imprimiendo voucher');
  }

  cerrar() {
    this.dialogRef.close();
  }
}
