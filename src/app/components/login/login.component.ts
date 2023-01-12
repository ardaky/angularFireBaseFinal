import { HotToastService } from '@ngneat/hot-toast';
import { FirebaseservisService } from './../../services/firebaseservis.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

 
  constructor(
    public fbservisi: FirebaseservisService,
    public toastim:HotToastService,
    public router: Router
  ) { }

  ngOnInit() {
  }

  

  girisYap(mail:string,parola:string){
    this.fbservisi.OturumAc(mail, parola)
      .pipe(
        this.toastim.observe({
          success: 'Oturum Açıldı',
          loading: 'Oturum Açılıyor...',
          error: ({ message }) => `${message}`
        })
      )
      .subscribe(() => {
        this.router.navigate(['']);
      });
  }


  kayitOl(adsoyad: string, email: string, parola: string) {
    var tarih = new Date();
    this.fbservisi.
      KayitOl(email, parola)
      .pipe(
        switchMap(({ user: { uid } }) =>
          this.fbservisi.kullaniciEkle({ 
            uid,
            email,
            displayName: adsoyad,
            rol: "2",
            kayTarih: tarih.getTime().toString(),
            duzTarih: tarih.getTime().toString(),
            alinanVerilenDersler: []

          })
        ),
        this.toastim.observe({
          success: 'Tebrikler Kayıt Yapıldı',
          loading: 'Kayıt Yapılıyor...',
          error: ({ message }) => `${message}`,
        })
      )
      .subscribe(() => {
        this.router.navigate(['']);
      });
  }

  signWithGoogle(){
    this.fbservisi.googleSignIn();
    
  }
}
