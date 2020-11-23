import { AfterViewInit, Component, ViewChild, OnInit } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Chart } from "angular-highcharts";

export interface Historico {
  data: string;
  hora: string;
  temp: number[];
  umidade: number[];
  ml: number[];
  mediaTemp: number;
  mediaUmid: number;
  totalMl: number;
}
@Component({
  selector: "app-spark-line",
  templateUrl: "./spark-line.component.html",
  styleUrls: ["./spark-line.component.css"]
})
export class SparkLineComponent implements AfterViewInit, OnInit {
  public response = [];

  historico: Historico[] = [];
  dataSource: MatTableDataSource<Historico>;

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
    "hora",
    "mediaTemp",
    "temp",
    "mediaUmid",
    "umidade",
    "totalMl",
    "ml"
  ];
  ngOnInit() {
    let data = [
      {
        data: "22/11/2020",
        hora: "10:56",
        temp: [121, 264, 634, 398, 518],
        umidade: [80, 40, 70, 76, 49, 88, 55, 68, 81, 12],
        ml: [2, 400, 40, 45, 120, 380, 60, 100, 45, 800],
        mediaTemp: 198,
        mediaUmid: 234,
        totalMl: 3400
      },
      {
        data: "22/10/2020",
        hora: "10:56",
        temp: [219, 513, 497, 610, 112],
        umidade: [80, 40, 70, 76, 49, 88, 55, 68, 81, 12],
        ml: [2, 400, 40, 45, 120, 380, 60, 100, 45, 800],
        mediaTemp: 200,
        mediaUmid: 400,
        totalMl: 2500
      },
      {
        data: "22/11/2020",
        hora: "10:56",
        temp: [321, 634, 104, 997, 208],
        umidade: [80, 40, 70, 76, 49, 88, 55, 68, 81, 12],
        ml: [2, 400, 40, 45, 120, 380, 60, 100, 45, 800],
        mediaTemp: 400,
        mediaUmid: 200,
        totalMl: 3004
      },
      {
        data: "22/11/2020",
        hora: "10:56",
        temp: [219, 513, 497, 610, 112],
        umidade: [80, 40, 70, 76, 49, 88, 55, 68, 81, 12],
        ml: [2, 400, 40, 45, 120, 380, 60, 100, 45, 800],
        mediaTemp: 323,
        mediaUmid: 50,
        totalMl: 2300
      },
      {
        data: "22/11/2020",
        hora: "10:56",
        temp: [651, 501, 100, 308, 149],
        umidade: [80, 40, 70, 76, 49, 88, 55, 68, 81, 12],
        ml: [2, 400, 40, 45, 120, 380, 60, 100, 45, 800],
        mediaTemp: 30,
        mediaUmid: 45,
        totalMl: 2000
      }
    ];

    data.forEach((element) => {
      element["chartObject"] = this.returnSparkLineChart(element.temp);
      this.response.push(element);
    });

    console.log("1 - " + this.response);

    data.forEach((element) => {
      element["chartObject1"] = this.returnSparkLineChart(element.umidade);
      this.response.push(element);
    });
    console.log("1 - " + this.response);

    data.forEach((element) => {
      element["chartObject2"] = this.returnSparkLineChart(element.ml);
      this.response.push(element);
    });
    console.log("1 - " + this.response);
    this.historico = data;
    this.dataSource = new MatTableDataSource<Historico>(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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
