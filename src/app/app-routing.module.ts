import { KategorilerComponent } from './components/kategoriler/kategoriler.component';
import { ProfilComponent } from './components/profil/profil.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { EgitimlerComponent } from './components/egitimler/egitimler.component';
import { IletisimComponent } from './components/iletisim/iletisim.component';
import { KullanicilarComponent } from './components/kullanicilar/kullanicilar.component';
import {
  canActivate,
  redirectUnauthorizedTo,
  redirectLoggedInTo,
} from '@angular/fire/auth-guard';
import { HakkimizdaComponent } from './components/hakkimizda/hakkimizda.component';
import { HomeComponent } from './components/home/home.component';

const redirectToLogin = () => redirectUnauthorizedTo(['login']);
const redirectToHome = () => redirectLoggedInTo(['']);
const routes: Routes = [
  {path:'login',
   component:LoginComponent,
   ...canActivate(redirectToHome)
  },
  {path:'egitimler',
   component:EgitimlerComponent,
   ...canActivate(redirectToLogin)
  },
  {path:'iletisim',
   component:IletisimComponent
  },
  {path:'kullanicilar',
   component:KullanicilarComponent,
  ...canActivate(redirectToLogin)
  },
  {path:'profil',
   component:ProfilComponent,
  ...canActivate(redirectToLogin)
  },
  {path:'hakkimizda',
   component:HakkimizdaComponent
  },
  {
    path:'',
    component:HomeComponent
  },
  {
    path:'home',
    component:HomeComponent
  },
  {
    path:'kategoriler',
    component:KategorilerComponent
  }



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
