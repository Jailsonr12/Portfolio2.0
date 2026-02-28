import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './page/home/home.component';
import { EditorComponent } from './page/editor/editor.component';

const routes: Routes = [
  { path: '', redirectTo: 'protifolio/jailsonr12', pathMatch: 'full' },
  { path: 'protifolio/home', redirectTo: 'protifolio/jailsonr12', pathMatch: 'full' },
  { path: 'protifolio/:username', component: HomeComponent },
  { path: 'protifolio/:username/editor', component: EditorComponent },
  { path: '**', redirectTo: 'protifolio/jailsonr12' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
