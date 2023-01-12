import { KategorilerComponent } from './components/kategoriler/kategoriler.component';
import { ProfilComponent } from './components/profil/profil.component';
import { environment } from './../environments/environment';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {AngularFireModule} from '@angular/fire/compat'
import { provideAuth, getAuth, AuthModule } from '@angular/fire/auth';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import {AngularFireAuthModule} from '@angular/fire/compat/auth';
import { HotToastModule } from '@ngneat/hot-toast';
import { provideStorage,getStorage } from '@angular/fire/storage'
import { EgitimlerComponent } from './components/egitimler/egitimler.component';
import { KullanicilarComponent } from './components/kullanicilar/kullanicilar.component';
import { HakkimizdaComponent } from './components/hakkimizda/hakkimizda.component';
import { HomeComponent } from './components/home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    EgitimlerComponent,
    KullanicilarComponent,
    ProfilComponent,
    HakkimizdaComponent,
    HomeComponent,
    KategorilerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    ReactiveFormsModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    HotToastModule.forRoot(),
    provideStorage(() => getStorage()),
    FormsModule,
    AngularFireAuthModule
    

  ],
  providers: [
    { provide: FIREBASE_OPTIONS, useValue: environment.firebase }
],
  bootstrap: [AppComponent]
})
export class AppModule { }
