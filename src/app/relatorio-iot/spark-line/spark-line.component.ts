import { mapToMapExpression } from "@angular/compiler/src/render3/util";
import { AfterViewInit, Component, ViewChild, OnInit } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Chart } from "angular-highcharts";
import { isUndefined } from "util";
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
  styleUrls: ["./spark-line.component.css"]
})
export class SparkLineComponent implements AfterViewInit, OnInit {
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

  constructor(private dadosService: DadosService) {}
  ngOnInit() {
    this.dadosService.getDados().subscribe((res) => {
      /*var res: any[] = [
      {
        id: 2,
        umidade: 20,
        temp: 30,
        sol: 50,
        ml: 20,
        data: "45343",
        hora: "254"
      },
      {
        id: 2,
        umidade: 20,
        temp: 36,
        sol: 50,
        ml: 20,
        data: "45343",
        hora: "254"
      },
      {
        id: 2,
        umidade: 20,
        temp: 40,
        sol: 50,
        ml: 20,
        data: "55343",
        hora: "254"
      }
    ];
*/
      this.dados = res;

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

      var aux: Historico;
      var data: Historico[] = [];
      for (const i of datasFiltradas) {
        var count: number = 0;
        var dataIn: string;
        var temp: number[] = [];
        var umidade: number[] = [];
        var ml: number[] = [];
        var sol: number[] = [];
        var mediaTemp;
        var mediaUmidade;
        var totalMl;
        var mediaSol;

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
            ml.push(j.tempoIrrigacao); //-----------Transformar em ml
            count++;
          }
        }

        mediaSol = mediaSol / count;
        mediaUmidade = mediaUmidade / count;
        mediaTemp = mediaTemp / count;

        aux = {
          mediaSol: mediaSol,
          data: dataIn,
          temp: temp,
          umidade: umidade,
          sol: sol,
          ml: ml,
          mediaTemp: mediaTemp,
          mediaUmid: mediaUmidade,
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
    });
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
