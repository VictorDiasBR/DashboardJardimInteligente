import {
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  AfterViewInit,
  AfterViewChecked,
  Component,
  ViewChild,
  OnInit
} from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Dados } from "../dados/dados.model";
import { DadosService } from "../dados/dados.service";
@Component({
  selector: "app-historico",
  templateUrl: "./historico.component.html",
  styleUrls: ["./historico.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HistoricoComponent
  implements AfterViewChecked, AfterViewInit, OnInit {
  displayedColumns: string[] = [
    "data",
    "hora",
    "temperatura",
    "umidade",
    "radiacaoSolar",
    "tempoIrrigacao"
  ];
  dados: Dados[];
  dataSource: MatTableDataSource<Dados>;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  mode = true;

  constructor(
    private dadosService: DadosService,
    private cdref: ChangeDetectorRef
  ) {
    setInterval(() => {
      let vazao = 5; // vazao da agua 5 ml/s
      this.dadosService.getDados().subscribe((res) => {
        for (const i of res) {
          let achou = this.dados.filter((res) => res.id === i.id);

          if (achou.length === 0) {
            console.log("Novo elemento adicionado na api: " + i.id);
            i.tempoIrrigacao *= vazao;
            this.dados.push(i);
            this.dataSource = new MatTableDataSource<Dados>(this.dados);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          }
        }
        this.cdref.markForCheck();
      });
    }, 1000);
    if (this.dados != null) {
      this.mode = false;
    }
  }

  ngOnInit(): void {
    this.dadosService.getDados().subscribe((res) => {
      this.dados = res;

      let vazao = 5; // vazao 5ml/s
      for (const i of this.dados) {
        i.tempoIrrigacao *= vazao; // V(volume de água) = vazao x ΔT
      }

      this.dataSource = new MatTableDataSource<Dados>(this.dados);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

      if (this.dados != null) {
        this.mode = false;
      }
    });
  }
  ngAfterViewChecked() {
    this.cdref.detectChanges();
    if (this.dados != null) {
      this.mode = false;
    }
  }
  ngAfterViewInit() {
    this.dataSource = new MatTableDataSource<Dados>(this.dados);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    if (this.dados != null) {
      this.mode = false;
    }
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
    if (this.dados != null) {
      this.mode = false;
    }
  }
}
