import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ProductService } from '../../../shared/services/product-service/product-service';
import {
  ApiProductoByFilterResponse,
  ProductDataTable,
  Producto,
} from '../../../shared/models/producto.model';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatAnchor, MatButton, MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { EditProductDialog } from '../edit-product-dialog/edit-product-dialog';
import { DeleteProductDialog } from '../delete-product-dialog/delete-product-dialog';

@Component({
  selector: 'app-list-product',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButton,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatAnchor,
  ],
  templateUrl: './list-product.html',
  styleUrl: './list-product.css',
})
export class ListProduct implements OnInit, AfterViewInit {
  //Inyecciones
  private productoService = inject(ProductService);

  //Variables
  private producto: Producto | null = null;
  private listaProductos: Producto[] = [];
  listaProductosTable: ProductDataTable[] = [];

  //Dialog
  private matDialog = inject(MatDialog);

  //Header del mat-table
  displayedColumns: string[] = [
    'Id',
    'Nombre',
    'Descripcion',
    'Precio',
    'Stock',
    'Categoria',
    'Status',
    'Acciones',
  ];

  dataSource = new MatTableDataSource(this.listaProductosTable);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit() {
    this.cargarDataInicial();
  }

  cargarDataInicial() {
    this.productoService.getProducts().subscribe((resp: ApiProductoByFilterResponse) => {
      this.listaProductos = resp.Data ?? []; //Cargo los productos

      if (!this.listaProductos) return;

      this.listaProductosTable = this.listaProductos.map((itemProducto) => {
        return {
          Id: itemProducto.Id,
          Nombre: itemProducto.Nombre,
          Descripcion: itemProducto.Descripcion,
          PrecioUnitario: itemProducto.PrecioUnitario,
          Stock: itemProducto.Stock,
          CategoriaProducto: itemProducto.NombreCategoriaProducto,
          Status: itemProducto.Status,
        };
      });

      this.dataSource.data = this.listaProductosTable;
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.setupPaginatorLabels();
  }

  aplicarFiltros(input: Event) {
    const filterValue = (input.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  eliminar(id: number) {
    const producto: Producto | null = this.listaProductos.find((p) => p.Id === id) ?? null;

    if (!producto) return;

    this.matDialog.open(DeleteProductDialog, {
      data: producto,
      disableClose: true,
    });
  }

  editar(id: number) {
    const producto: Producto | null = this.listaProductos.find((p) => p.Id === id) ?? null;

    if (!producto) return;

    this.matDialog.open(EditProductDialog, {
      data: producto,
      disableClose: true,
    });
  }

  setupPaginatorLabels() {
    this.paginator._intl.itemsPerPageLabel = 'Nro de elementos por página:';
    this.paginator._intl.previousPageLabel = 'Anterior';
    this.paginator._intl.nextPageLabel = 'Siguiente';
  }
}
