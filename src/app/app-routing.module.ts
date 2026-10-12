import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './page/home/home.component';
import { PoliticaComponent } from './components/politica/politica.component';
import { JajaNewsComponent } from './components/jaja-news/jaja-news.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'politica', component: PoliticaComponent },
  { path: 'jaja-news', component: JajaNewsComponent },
  { path: 'politoca', redirectTo: 'politica', pathMatch: 'full' },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
