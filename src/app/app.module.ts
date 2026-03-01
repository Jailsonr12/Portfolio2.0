import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HelloComponent } from './components/hello/hello.component';
import { ApresentacaoComponent } from './components/apresentacao/apresentacao.component';
import { ProjetoDireitaComponent } from './components/projeto-direita/projeto-direita.component';
import { HomeComponent } from './page/home/home.component';
import { ModalImgComponent } from './components/modal-img/modal-img.component';
import { EditorComponent } from './page/editor/editor.component';
import { CustomFieldsComponent } from './components/home-cards/custom-fields/custom-fields.component';
import { HeroCardComponent } from './components/home-cards/hero-card/hero-card.component';
import { AboutCardComponent } from './components/home-cards/about-card/about-card.component';
import { SkillsCardComponent } from './components/home-cards/skills-card/skills-card.component';
import { ProjectsCardComponent } from './components/home-cards/projects-card/projects-card.component';
import { ExperienceCardComponent } from './components/home-cards/experience-card/experience-card.component';
import { CaseStudiesCardComponent } from './components/home-cards/case-studies-card/case-studies-card.component';
import { CertificationsCardComponent } from './components/home-cards/certifications-card/certifications-card.component';
import { CurriculumCardComponent } from './components/home-cards/curriculum-card/curriculum-card.component';
import { ContactCardComponent } from './components/home-cards/contact-card/contact-card.component';
import { GithubProfileCardComponent } from './components/home-cards/github-profile-card/github-profile-card.component';

@NgModule({
  declarations: [
    AppComponent,
    HelloComponent,
    ApresentacaoComponent,
    ProjetoDireitaComponent,
    HomeComponent,
    ModalImgComponent,
    EditorComponent,
    CustomFieldsComponent,
    HeroCardComponent,
    AboutCardComponent,
    SkillsCardComponent,
    ProjectsCardComponent,
    ExperienceCardComponent,
    CaseStudiesCardComponent,
    CertificationsCardComponent,
    CurriculumCardComponent,
    ContactCardComponent,
    GithubProfileCardComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
