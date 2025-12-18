import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { AdaptadorPersonalizadoFechas, to2digit } from '../../shared/adapters/adaptador-fechas';
import { VentaService } from '../../shared/services/venta-service/venta-service';
import { ApiVentaByFiltersResponse, Venta, VentaDataTable } from '../../shared/models/venta.model';
import { MatDialog } from '@angular/material/dialog';
import { VoucherDialog } from '../../shared/components/voucher-dialog/voucher-dialog';

const MY_DATE_FORMATS = {
  display: {},
};

@Component({
  selector: 'app-sales',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDatepickerModule,
  ],
  templateUrl: './sales.html',
  styleUrl: './sales.css',
  providers: [
    {
      provide: DateAdapter,
      useClass: AdaptadorPersonalizadoFechas,
    },
    {
      provide: MAT_DATE_FORMATS,
      useValue: MY_DATE_FORMATS,
    },
  ],
})
export class Sales implements OnInit, AfterViewInit {
  //Inyecciones
  private ventaService = inject(VentaService);

  //Variables
  private listaVentasTableInicial: VentaDataTable[] = [];
  flagCargaVentas = false;

  private matDialog = inject(MatDialog);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  //Header del mat-table
  displayedColumns: string[] = [
    'IdVenta',
    'NumeroOperacion',
    'Cliente',
    'FechaVenta',
    'HoraVenta',
    'MontoTotal',
    'CantidadTotal',
     'Voucher'
  ];

  //Form
   ventasFormGroup = new FormGroup({
      clienteEnabled: new FormControl({ value: false, disabled: true }),
      clienteInput: new FormControl({ value: '', disabled: true }),
      datesEnabled: new FormControl({ value: true, disabled: true }),
      dateFrom: new FormControl(new Date()),
      dateTo: new FormControl(new Date()),
    });

  dataSource = new MatTableDataSource<VentaDataTable>();

  ngOnInit() {
    this.loadSales(); //carga de data
    this.setupConfigurationFilter(); //configuración de los eventos
  }

  loadSales() {

    const currentDay = new Date();

    if(this.ventasFormGroup.controls.dateFrom.value! > currentDay || this.ventasFormGroup.controls.dateTo.value! > currentDay){
      alert('Las fechas no pueden superar la fecha actual.');
      return;
    }

    if(this.ventasFormGroup.controls.dateFrom.value! > this.ventasFormGroup.controls.dateTo.value!){
      alert('La fecha de Inicio debe ser menor o igual a la fecha fin.');
      return;
    }

    const fechaInicio =  this.convertDateFormat(this.ventasFormGroup.controls.dateFrom.value!); //YYYY-MM-DD
    const fechaFin =  this.convertDateFormat(this.ventasFormGroup.controls.dateTo.value!); //YYYY-MM-DD

    //Deshabilito el botón hasta que culmine de ejecutar el servicio
    this.flagCargaVentas = false;

    //Invocar al endpoint del backend
    this.ventaService.getSalesByDate(fechaInicio,fechaFin).subscribe((resp: ApiVentaByFiltersResponse) => {
      this.flagCargaVentas = true;
      this.processSaleData(resp.data);
    });

  }

  processSaleData(listaVentas :  Venta[] | null){

    if(!listaVentas || listaVentas.length === 0) {
      this.disableFilterControls();
      this.listaVentasTableInicial = [];
      this.dataSource.data = [];
      return
    }

    this.enableFilterControls();
    this.listaVentasTableInicial =  listaVentas.map((itemVenta) => {
      return {
        idVenta: itemVenta.idVenta,
        numeroOperacion: itemVenta.numeroOperacion,
        nombreCompletoCliente: itemVenta.nombreCompletoCliente,
        fechaVenta: itemVenta.fechaVenta,
        horaVenta: itemVenta.horaVenta,
        montoTotalVenta: itemVenta.montoTotalVenta,
        cantidadTotalArticulos: itemVenta.cantidadTotalArticulos,
      }
    });

     this.dataSource.data = this.listaVentasTableInicial;
     this.setFisrtPage();

  }

  setupConfigurationFilter() {
    this.ventasFormGroup.controls.clienteEnabled.valueChanges.subscribe((value) => {
      this.toggleControl(this.ventasFormGroup.controls.clienteInput, value!);
    });
    this.ventasFormGroup.controls.clienteInput.valueChanges.subscribe(() => {
      this.applyFilter();
    });
  }

  //Método para aplicar el filtro por cliente al universo de ventas obtenidas desde backend.
  applyFilter() {
    const filterValue = this.ventasFormGroup.controls.clienteInput.value;

    if(!filterValue){
      this.dataSource.data = this.listaVentasTableInicial;
      return;
    };

    this.dataSource.data = this.listaVentasTableInicial.filter(p => p.nombreCompletoCliente.trim().toLowerCase().includes(filterValue.trim().toLowerCase()));
    this.setFisrtPage();
  }

  setFisrtPage(){

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.setupPaginatorLabels();
  }

  setupPaginatorLabels() {
    this.paginator._intl.itemsPerPageLabel = 'Nro de elementos por página:';
    this.paginator._intl.previousPageLabel = 'Anterior';
    this.paginator._intl.nextPageLabel = 'Siguiente';
  }

  //Alternancia - habilitar o deshabilitar controles
  toggleControl(control: FormControl, enable: boolean) {

    if (enable) {
      control.enable();
    } else {
      control.setValue('');
      control.disable();
    }
  }
   enableFilterControls() {
    this.ventasFormGroup.controls['clienteEnabled'].enable();
  }
  disableFilterControls() {
      this.ventasFormGroup.controls['clienteEnabled'].disable();
      this.ventasFormGroup.controls['clienteInput'].disable();
  }

  //Convertir en formato YYYY-MM-DD
  convertDateFormat(date: Date): string {

    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const dateFormat = year + '-' + to2digit(month) + '-' + to2digit(day) ; //formato YYYY-MM-DD

    return dateFormat;
  }

  //Abrir el modal para el voucher
  viewVoucher(idVenta: number) {

    this.matDialog.open(VoucherDialog, {
      data: idVenta,
      disableClose: true,
    });
  }


}
