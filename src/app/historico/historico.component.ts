import { AfterViewInit, Component, ViewChild, OnInit } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Dados } from "../dados/dados.model";
import { DadosService } from "../dados/dados.service";
@Component({
  selector: "app-historico",
  templateUrl: "./historico.component.html",
  styleUrls: ["./historico.component.css"]
})
export class HistoricoComponent implements AfterViewInit, OnInit {
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

  constructor(private dadosService: DadosService) {}

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
    });
  }

  ngAfterViewInit() {
    this.dataSource = new MatTableDataSource<Dados>(this.dados);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
