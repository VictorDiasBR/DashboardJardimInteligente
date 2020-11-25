import { Injectable } from "@angular/core";
import { Dados } from "./dados.model";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class DadosService {
  private url = "https://murmuring-shore-83165.herokuapp.com/dados/list";

  constructor(private http: HttpClient) {}

  getDados() {
    return this.http.get<Dados[]>(this.url);
  }
}
