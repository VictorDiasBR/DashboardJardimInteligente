import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DashboardIotComponent } from "./dashboard-iot/dashboard-iot.component";
import { RelatorioIotComponent } from "./relatorio-iot/relatorio-iot.component";
import { HistoricoComponent } from "./historico/historico.component";

const routes: Routes = [
  { path: "dashboard-iot", component: DashboardIotComponent },
  { path: "relatorio-iot", component: RelatorioIotComponent },
  { path: "historico", component: HistoricoComponent },
  { path: "", redirectTo: "dashboard-iot", pathMatch: "full" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
