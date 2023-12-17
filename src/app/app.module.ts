import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HelloComponent } from './components/hello/hello.component';
import { ApresentacaoComponent } from './components/apresentacao/apresentacao.component';
import { ProjetoEsquerdaComponent } from './components/projeto-esquerda/projeto-esquerda.component';
import { ProjetoDireitaComponent } from './components/projeto-direita/projeto-direita.component';
import { HomeComponent } from './page/home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    HelloComponent,
    ApresentacaoComponent,
    ProjetoEsquerdaComponent,
    ProjetoDireitaComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
