# Template Atividade

# Adicionando Configurações de Rotas!

Aguarde o build do projeto ser finalizado.

```terminal
Time: 765ms
: Compiled successfully.
success Already up-to-date.
```

### Comandos

Abra uma nova aba no terminal pressionando no botão '+' ao lado do yarn start.

**Na aba de /bin/bash use o seguinte comando.**

```/bin/bash
yarn ng generate module app-routing --flat --module=app
```

Aguarde a criação do modulo de rotas...
Se tudo der certo um novo arquivo type script será criado na pasta app, como exibido abaixo;

```/bin/bash
CREATE src/app/app-routing.module.ts (196 bytes)
UPDATE src/app/app.module.ts (393 bytes)
Done in 1.06s.
```

**Faça algumas alterações no arquivo src/app/app-routing.module.ts ;**

- Estrutura padrão:

```code
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
 declarations: [],
 imports: [
   CommonModule
 ]
})
export class AppRoutingModule { }
```

- Estrutura modificada:

```code
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [];

@NgModule({
 imports: [RouterModule.forRoot(routes)],
 exports: [RouterModule]
})
export class AppRoutingModule {}
```

Com essas modificações, o projeto estará setado para o uso de rotas.
Acompanhe o exemplo de criação e configuração de um novo componente para o projeto.

### Criando um novo componente

**Na aba de /bin/bash use o seguinte comando.**

```/bin/bash
yarn ng generate component exemplo
```

Aguarde a criação do componente "exemplo"...
Se tudo der certo um novo diretório será criado na pasta app, como exibido abaixo;

```/bin/bash
CREATE src/app/exemplo/exemplo.component.css (0 bytes)
CREATE src/app/exemplo/exemplo.component.html (22 bytes)
CREATE src/app/exemplo/exemplo.component.spec.ts (635 bytes)
CREATE src/app/exemplo/exemplo.component.ts (279 bytes)
UPDATE src/app/app.module.ts (479 bytes)
Done in 1.27s.
```

Agora que o componente "exemplo" foi criado, precisamos adicioná-lo como uma das rotas da página principal.
Para isso, faça as devidas adições no arquivo src/app/app-routing.module.ts;

```code
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import {ExemploComponent} from "./exemplo/exemplo.component";

const routes: Routes = [
{path:'exemplo',component: ExemploComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
```

Agora o componente exemplo está pronto para ser referenciado nas páginas da aplicação.
Lembre-se de repetir este processo para cada componente criado.

**OBS:** Pode ocorrer do projeto acusar um erro no import;

```
Cannot find module './exemplo/exemplo.component' or its corresponding type declarations.
```

Porém o erro acima não interfere na execução do projeto.

## Exemplo

Substitua o html do arquivo app/app.component.html, como sugerido no exemplo abaixo;

```code html
<div>
 <a routerLink="exemplo"> Exemplo atividade</a>
</div>
<router-outlet></router-outlet>
```

Salve o arquivo e no Browser, pressione o botão hiperLink Exemplo atividade;

---

**Exemplo atividade**

exemplo works!

---

O html do componente "exemplo", que se encontra no arquivo app/exemplo/exemplo.component.html, foi exibido na página através da tag;

```
<router-outlet></router-outlet>
```

Se o exemplo funcionou perfeitamente, o seu projeto foi devidamente configurado!
