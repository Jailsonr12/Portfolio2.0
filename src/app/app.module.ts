import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HelloComponent } from './components/hello/hello.component';
import { ApresentacaoComponent } from './components/apresentacao/apresentacao.component';
import { ProjetoDireitaComponent } from './components/projeto-direita/projeto-direita.component';
import { HomeComponent } from './page/home/home.component';
import { ModalImgComponent } from './components/modal-img/modal-img.component';

@NgModule({
  declarations: [
    AppComponent,
    HelloComponent,
    ApresentacaoComponent,
    ProjetoDireitaComponent,
    HomeComponent,
    ModalImgComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
