import { Component, OnInit } from "@angular/core";

import * as Highcharts from "highcharts";

declare module "highcharts" {
  interface Point {
    highlight: (event: Highcharts.PointerEventObject) => void;
  }
}

/**
 * Override the reset function, we don't need to hide the tooltips and
 * crosshairs.
 */
Highcharts.Pointer.prototype.reset = function () {
  return undefined;
};

/**
 * Highlight a point by showing tooltip, setting hover state and draw crosshair
 */
Highcharts.Point.prototype.highlight = function (event) {
  event = this.series.chart.pointer.normalize(event);
  this.onMouseOver(event); // Show the hover marker
  this.series.chart.tooltip.refresh(this); // Show the tooltip
  this.series.chart.xAxis[0].drawCrosshair(event, this); // Show the crosshair
};

@Component({
  selector: "app-dashboard-iot",
  templateUrl: "./dashboard-iot.component.html",
  styleUrls: ["./dashboard-iot.component.css"]
})
export class DashboardIotComponent implements OnInit {
  Highcharts = Highcharts;

  temp: number[] = [];
  umidade: number[] = [];
  ml: number[] = [];
  times: string[] = [];

  ngOnInit() {
    this.temp.push(23, 38, 20, 29, 34, 16, 27, 29, 19, 40);
    this.umidade.push(80, 40, 70, 76, 49, 88, 55, 68, 81, 12);
    this.ml.push(2, 400, 40, 45, 120, 380, 60, 100, 45, 800);
    this.times.push(
      "10:56",
      "10:56",
      "10:56",
      "10:56",
      "10:56",
      "10:56",
      "10:56",
      "10:56",
      "10:56",
      "10:56"
    );
  }

  synchronizeTooltips = (e: any) => {
    var chart,
      point,
      i,
      event,
      charts = Highcharts.charts,
      sourceChart = charts[(Highcharts as any).hoverChartIndex]; // resolve lack of definitions

    for (i = 0; i < charts.length; i = i + 1) {
      chart = charts[i];

      if (
        // Could be undefined for a removed chart
        chart &&
        // Only sync charts with shared class
        (chart.options.chart && chart.options.chart.className) ===
          (sourceChart.options.chart && sourceChart.options.chart.className)
      ) {
        // Find coordinates within the chart
        event = chart.pointer.normalize(e);

        // Get the hovered point
        point = (chart.series[0] as any).searchPoint(event, true); // resolve lack of definitions

        if (point) {
          point.highlight(e);
        }
      }
    }
  };

  chartOptions1: Highcharts.Options = {
    chart: {
      marginLeft: 40, // Keep all charts left aligned
      spacingTop: 20,
      spacingBottom: 20,
      className: "chart-sync-a"
    },
    title: {
      text: "Temperatura Ambiente",
      align: "left",
      margin: 0,
      x: 30
    },
    credits: {
      enabled: false
    },
    legend: {
      enabled: false
    },
    xAxis: {
      crosshair: true,
      events: {
        setExtremes: function (e: any) {
          var thisChart = (this as Highcharts.Axis).chart;

          if (e.trigger !== "syncExtremes") {
            // Prevent feedback loop
            Highcharts.charts.forEach(function (chart) {
              if (
                chart !== thisChart &&
                (chart.options.chart && chart.options.chart.className) ===
                  (thisChart.options.chart && thisChart.options.chart.className)
              ) {
                if (chart.xAxis[0].setExtremes) {
                  // It is null while updating
                  chart.xAxis[0].setExtremes(e.min, e.max, true, true, {
                    trigger: "syncExtremes"
                  });
                }
              }
            });
          }
        }
      },
      categories: this.times
    },
    yAxis: {
      title: {
        text: null
      }
    },
    tooltip: {
      positioner: function () {
        return {
          // right aligned
          x:
            (this as Highcharts.Tooltip).chart.chartWidth -
            (this as any).label.width, // resolve lack of definitions
          y: 10 // align to title
        };
      },
      borderWidth: 0,
      backgroundColor: "none",
      pointFormat: "{point.y} Cº",
      headerFormat: "{series.name} ",
      shadow: true,
      style: {
        fontSize: "18px"
      }
    },
    series: [
      {
        data: this.temp,
        name: "Temperatura Ambiente"
      } as Highcharts.SeriesLineOptions
    ]
  };

  chartOptions2: Highcharts.Options = {
    chart: {
      marginLeft: 40, // Keep all charts left aligned
      spacingTop: 20,
      spacingBottom: 20,
      className: "chart-sync-a"
    },
    title: {
      text: "Umidade do Solo",
      align: "left",
      margin: 0,
      x: 30
    },
    credits: {
      enabled: false
    },
    legend: {
      enabled: false
    },
    xAxis: {
      crosshair: true,
      events: {
        setExtremes: function (e: any) {
          var thisChart = (this as Highcharts.Axis).chart;

          if (e.trigger !== "syncExtremes") {
            // Prevent feedback loop
            Highcharts.charts.forEach(function (chart) {
              if (
                chart !== thisChart &&
                (chart.options.chart && chart.options.chart.className) ===
                  (thisChart.options.chart && thisChart.options.chart.className)
              ) {
                if (chart.xAxis[0].setExtremes) {
                  // It is null while updating
                  chart.xAxis[0].setExtremes(e.min, e.max, undefined, false, {
                    trigger: "syncExtremes"
                  });
                }
              }
            });
          }
        }
      },
      categories: this.times
    },
    yAxis: {
      title: {
        text: null
      }
    },
    tooltip: {
      positioner: function () {
        return {
          // right aligned
          x:
            (this as Highcharts.Tooltip).chart.chartWidth -
            (this as any).label.width, // resolve lack of definitions
          y: 10 // align to title
        };
      },
      borderWidth: 0,
      backgroundColor: "none",
      pointFormat: "{point.y} %",
      headerFormat: "{series.name} ",
      shadow: true,
      style: {
        fontSize: "18px"
      }
    },
    series: [
      {
        data: this.umidade,
        name: "Umidade do Solo "
      } as Highcharts.SeriesLineOptions
    ]
  };

  chartOptions3: Highcharts.Options = {
    chart: {
      marginLeft: 40, // Keep all charts left aligned
      spacingTop: 20,
      spacingBottom: 20,
      className: "chart-sync-a"
    },
    title: {
      text: "Irrigação",
      align: "left",
      margin: 0,
      x: 30
    },
    credits: {
      enabled: false
    },
    legend: {
      enabled: false
    },
    xAxis: {
      crosshair: true,
      events: {
        setExtremes: function (e: any) {
          var thisChart = (this as Highcharts.Axis).chart;

          if (e.trigger !== "syncExtremes") {
            // Prevent feedback loop
            Highcharts.charts.forEach(function (chart) {
              if (
                chart !== thisChart &&
                (chart.options.chart && chart.options.chart.className) ===
                  (thisChart.options.chart && thisChart.options.chart.className)
              ) {
                if (chart.xAxis[0].setExtremes) {
                  // It is null while updating
                  chart.xAxis[0].setExtremes(e.min, e.max, undefined, false, {
                    trigger: "syncExtremes"
                  });
                }
              }
            });
          }
        }
      },
      categories: this.times
    },
    yAxis: {
      title: {
        text: null
      }
    },
    tooltip: {
      positioner: function () {
        return {
          // right aligned
          x:
            (this as Highcharts.Tooltip).chart.chartWidth -
            (this as any).label.width, // resolve lack of definitions
          y: 10 // align to title
        };
      },
      borderWidth: 0,
      backgroundColor: "none",
      pointFormat: "{point.y} ml",
      headerFormat: "{series.name} ",
      shadow: true,
      style: {
        fontSize: "18px"
      }
    },
    series: [
      {
        data: this.ml,
        name: "Milimetragem de água "
      } as Highcharts.SeriesLineOptions
    ]
  };
}
