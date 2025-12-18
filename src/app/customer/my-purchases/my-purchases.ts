import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatAnchor, MatButton, MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { VentaService } from '../../shared/services/venta-service/venta-service';
import { ApiVentaByFiltersResponse, Venta, VentaDataTable } from '../../shared/models/venta.model';
import { MatDialog } from '@angular/material/dialog';
import { VoucherDialog } from '../../shared/components/voucher-dialog/voucher-dialog';

@Component({
  selector: 'app-my-purchases',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatButton,
    MatButtonModule,
    MatPaginatorModule,
  ],
  templateUrl: './my-purchases.html',
  styleUrl: './my-purchases.css',
})
export class MyPurchases implements OnInit, AfterViewInit {
  //Inyecciones
  private ventaService = inject(VentaService);

  //Variables
  private venta: Venta | null = null;
  private listaVenta: Venta[] = [];
  listaVentaTable: VentaDataTable[] = [];

  //Dialog
  private matDialog = inject(MatDialog);

  //Header del mat-table
  displayedColumns: string[] = [
    'IdVenta',
    'NumeroOperacion',
    'FechaVenta',
    'HoraVenta',
    'MontoTotal',
    'CantidadTotal',
    'Voucher',
  ];

  dataSource = new MatTableDataSource(this.listaVentaTable);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.cargarData();
  }

  cargarData() {
    this.ventaService.getMyPurchases().subscribe((resp: ApiVentaByFiltersResponse) => {
      this.listaVenta = resp.data ?? []; //Cargo la lista de ventas

      if (!this.listaVenta || this.listaVenta.length === 0) return;

      this.listaVentaTable = this.listaVenta.map((itemVenta) => {
        return {
          idVenta: itemVenta.idVenta,
          numeroOperacion: itemVenta.numeroOperacion,
          nombreCompletoCliente: itemVenta.nombreCompletoCliente,
          fechaVenta: itemVenta.fechaVenta,
          horaVenta: itemVenta.horaVenta,
          montoTotalVenta: itemVenta.montoTotalVenta,
          cantidadTotalArticulos: itemVenta.cantidadTotalArticulos,
        };
      });

      this.dataSource.data = this.listaVentaTable;

      //¡Importante! Resetear el Paginator a la primera página
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.setupPaginatorLabels();
  }

  aplicarFiltros(input: Event) {
    const filterValue = (input.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    //¡Importante! Resetear el Paginator a la primera página
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  setupPaginatorLabels() {
    this.paginator._intl.itemsPerPageLabel = 'Nro de elementos por página:';
    this.paginator._intl.previousPageLabel = 'Anterior';
    this.paginator._intl.nextPageLabel = 'Siguiente';
  }

  viewVoucher(idVenta: number) {
    this.matDialog.open(VoucherDialog, {
      data: idVenta,
      disableClose: true,
    });
  }
}
