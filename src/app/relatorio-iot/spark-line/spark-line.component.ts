import { mapToMapExpression } from "@angular/compiler/src/render3/util";
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
import { Chart } from "angular-highcharts";
import { Dados } from "../../dados/dados.model";
import { DadosService } from "../../dados/dados.service";

export interface Historico {
  data: string;
  temp: number[];
  umidade: number[];
  sol: number[];
  ml: number[];
  mediaTemp: number;
  mediaUmid: number;
  mediaSol: number;
  totalMl: number;
}

@Component({
  selector: "app-spark-line",
  templateUrl: "./spark-line.component.html",
  styleUrls: ["./spark-line.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SparkLineComponent
  implements AfterViewChecked, AfterViewInit, OnInit {
  public response = [];
  dados: Dados[];
  historico: Historico[] = [];

  dataSource: MatTableDataSource<Historico>;

  temp: number[] = [];
  umidade: number[] = [];
  ml: number[] = [];
  sol: number[] = [];
  mediaTemp: number;
  mediaUmidade: number;
  totalMl: number;
  mediaSol: number;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewChecked() {
    this.cdref.detectChanges();
  }
  ngAfterViewInit() {
    this.dataSource = new MatTableDataSource<Historico>(this.historico);
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
  displayedColumns: string[] = [
    "data",
    "mediaTemp",
    "temp",
    "mediaUmid",
    "umidade",
    "mediaSol",
    "sol",
    "totalMl",
    "ml"
  ];
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
            this.dados.push(i);
            this.salvar();
          }
        }
        this.cdref.markForCheck();
      });
    }, 1000);
  }
  ngOnInit() {
    this.dadosService.getDados().subscribe((res) => {
      this.dados = res;
      this.salvar();
    });
  }

  salvar() {
    var datas = this.dados.map((dados) => dados.data);
    var datasFiltradas = [];

    datas.forEach((item) => {
      var duplicated =
        datasFiltradas.findIndex((redItem) => {
          return item === redItem;
        }) > -1;

      if (!duplicated) {
        datasFiltradas.push(item);
      }
    });

    let vazao = 5; // 5 ml/s
    var aux: Historico;
    var data: Historico[] = [];

    for (const i of datasFiltradas) {
      var count: number = 0;
      var dataIn: string;
      var temp: number[] = [];
      var umidade: number[] = [];
      var ml: number[] = [];
      var sol: number[] = [];
      let mediaTemp = 0;
      let mediaUmidade = 0;
      let totalMl = 0;
      let mediaSol = 0;

      for (const j of this.dados) {
        if (i === j.data) {
          dataIn = j.data;
          mediaTemp = mediaTemp + j.temperatura;
          mediaUmidade = mediaUmidade + j.umidade;
          mediaSol = mediaSol + j.radiacaoSolar;
          totalMl = totalMl + j.tempoIrrigacao; //-----------Transformar em ml
          temp.push(j.temperatura);
          sol.push(j.radiacaoSolar);
          umidade.push(j.umidade);
          ml.push(j.tempoIrrigacao * vazao); //-----------Transformar em ml
          count++;
        }
      }

      mediaSol = mediaSol / count;
      mediaUmidade = mediaUmidade / count;
      mediaTemp = mediaTemp / count;

      var mediaS = mediaSol.toFixed(1);
      var mediaU = mediaUmidade.toFixed(1);
      var mediaT = mediaTemp.toFixed(1);

      totalMl = totalMl * vazao; // V(volume de água) = vazao x ΔT

      aux = {
        mediaSol: Number(mediaS),
        data: dataIn,
        temp: temp,
        umidade: umidade,
        sol: sol,
        ml: ml,
        mediaTemp: Number(mediaT),
        mediaUmid: Number(mediaU),
        totalMl: totalMl
      };

      data.push(aux);
    }

    data.forEach((element) => {
      element["chartObject"] = this.returnSparkLineChart(element.temp);
      this.response.push(element);
    });

    data.forEach((element) => {
      element["chartObject1"] = this.returnSparkLineChart(element.umidade);
      this.response.push(element);
    });

    data.forEach((element) => {
      element["chartObject2"] = this.returnSparkLineChart(element.ml);
      this.response.push(element);
    });

    data.forEach((element) => {
      element["chartObject3"] = this.returnSparkLineChart(element.sol);
      this.response.push(element);
    });

    this.historico = data;
    this.dataSource = new MatTableDataSource<Historico>(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.mode = false;
  }
  returnSparkLineChart(seriesData: any) {
    return new Chart(<any>{
      title: {
        text: ""
      },
      credits: false,
      chart: {
        renderTo: "container",
        width: 120,
        height: 20,
        type: "area",
        margin: [2, 0, 2, 0],
        style: {
          overflow: "visible"
        },
        skipClone: true
      },
      yAxis: {
        endOnTick: false,
        startOnTick: false,
        labels: {
          enabled: true
        },
        title: {
          text: null
        }
      },
      tickPositions: [0],
      xAxis: {
        labels: {
          enabled: true
        },
        title: {
          text: null
        },
        startOnTick: false,
        endOnTick: false,
        tickPositions: []
      },
      legend: {
        enabled: false
      },
      plotOptions: {
        series: {
          marker: {
            enabled: false
          }
        }
      },
      tooltip: {
        enabled: true
      },
      series: [
        {
          data: seriesData
        }
      ]
    });
  }
}
