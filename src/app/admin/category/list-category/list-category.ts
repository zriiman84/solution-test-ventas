import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatAnchor, MatButton, MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CategoryService } from '../../../shared/services/category-service/category-service';
import { Category } from '../category';
import {
  ApiCategoriaByFilterResponse,
  CategoriaDataTable,
  CategoriaProducto,
} from '../../../shared/models/categoria.model';
import { MatDialog } from '@angular/material/dialog';
import { EditCategoryDialog } from '../edit-category-dialog/edit-category-dialog';
import { DeleteCategoryDialog } from '../delete-category-dialog/delete-category-dialog';

@Component({
  selector: 'app-list-category',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButton,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatAnchor,
  ],
  templateUrl: './list-category.html',
  styleUrl: './list-category.css',
})
export class ListCategory implements OnInit, AfterViewInit {
  //Inyecciones
  private categoryService = inject(CategoryService);

  //Variables
  private category: CategoriaProducto | null = null;
  private listaCategorias: CategoriaProducto[] = [];
  listaCategoriasTable: CategoriaDataTable[] = [];

  //Dialog
  private matDialog = inject(MatDialog);

  //Header del mat-table
  displayedColumns: string[] = ['Id', 'Nombre', 'Descripcion', 'Status', 'Acciones'];

  dataSource = new MatTableDataSource(this.listaCategoriasTable);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.cargarData();
  }

  cargarData() {
    this.categoryService.getCategory(null).subscribe((resp: ApiCategoriaByFilterResponse) => {

      this.listaCategorias = resp.data ?? []; //Cargo la lista de categorías

      if (!this.listaCategorias) return;

      this.listaCategoriasTable = this.listaCategorias.map((itemCategory) => {
        return {
          id: itemCategory.id,
          nombre: itemCategory.nombre,
          descripcion: itemCategory.descripcion,
          status: itemCategory.status,
        };
      });

      this.dataSource.data = this.listaCategoriasTable;

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

  eliminar(id: number) {

    const category:  CategoriaProducto | null = this.listaCategorias.find(c => c.id === id) ?? null;

    if (!category) return;

    const modal = this.matDialog.open(DeleteCategoryDialog, {
      data: category,
      disableClose: true,
    });

     modal.afterClosed().subscribe(() => {
      //Vuelvo a consultar la data desde BD
      this.cargarData();
    });
  }

  editar(id: number) {

    const category:  CategoriaProducto | null = this.listaCategorias.find(c => c.id === id) ?? null;

    if (!category) return;

    const modal = this.matDialog.open(EditCategoryDialog, {
      data: category,
      disableClose: true,
    });

    modal.afterClosed().subscribe(() => {
      //Vuelvo a consultar la data desde BD
      this.cargarData();
    });


  }
}
