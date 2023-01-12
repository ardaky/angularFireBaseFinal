import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import * as bootstrap from 'bootstrap';
import { Modal } from 'bootstrap';
import { concatMap } from 'rxjs';
import { Kategoriler } from 'src/app/models/kategoriler';
import { Lessons } from 'src/app/models/lessons';
import { Users } from 'src/app/models/users';
import { FirebaseservisService } from 'src/app/services/firebaseservis.service';


@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css']
})
export class ProfilComponent implements OnInit {
  uye = this.fbservisi.AktifUyeBilgi;
  modal!:Modal;
  kullanicininEgitimleri!:Lessons[];
  donguDers!:Lessons;
  kategoriler!:Kategoriler[];
  egitiminKategorisi!:string;
  tumEgitimler!:Lessons[];
  duzenlerkenSeciliKullanici!:Users;
  duzenlerkenSeciliKullaniciId!:Users;

  kullaniciDuzenleme: FormGroup = new FormGroup({
    displayName: new FormControl(),
    rol: new FormControl(),
    email: new FormControl()
  });
  constructor(
    public fbservisi: FirebaseservisService,
    public toastim: HotToastService
  ) { }

  ngOnInit() {
    this.kullanicininEgitimleriniListele();
    this.kategorileriListele();
  }

  kategorileriListele(){
    this.fbservisi.kategoriListele().subscribe(d => {
      this.kategoriler = d;
    });
  }

  egitimKategoriById(egitimKatId:string){
    if(this.kategoriler){
      var filtre = this.kategoriler.filter(a=> a.katId == egitimKatId);
      if(filtre.length > 0){
        this.egitiminKategorisi = filtre[0].katAdi;
        console.log(this.egitiminKategorisi)
      } 
    }
  
  }

  kullanicininEgitimleriniListele(){
    this.fbservisi.egitimListele().subscribe(d=> {
      this.tumEgitimler = d;
    })
  }

  dersiGetir(dersid:string){
    if(this.tumEgitimler){
      if(this.tumEgitimler.length >= 0){
        var filtre = this.tumEgitimler.filter(s=> s.egitimId == dersid);
        this.donguDers = filtre[0];
        console.log(this.donguDers)
      } 
    }
  }



  ResimYukle(event: any, user: Users) {
    this.fbservisi
      .uploadImage(event.target.files[0], `images/profile/${user.uid}`)
      .pipe(
        this.toastim.observe({
          loading: 'Fotoğraf Yükleniyor...',
          success: 'Fotoğraf yüklendi',
          error: 'Hata oluştu',
        }),
        concatMap((foto) =>
          this.fbservisi.kullaniciDuzenle({ uid: user.uid, foto })
        )
      )
      .subscribe();
  }

  kullaniciyiDuzenleModali(el:HTMLElement, kullanici:Users){
    this.kullaniciDuzenleme.patchValue(kullanici);
    this.duzenlerkenSeciliKullanici = this.kullaniciDuzenleme.value;
    this.duzenlerkenSeciliKullanici.uid = kullanici.uid;
    this.modal = new bootstrap.Modal(el);
    this.modal.show();
  }

  kullaniciyiDuzenle(){
    var tarih = new Date();
    this.duzenlerkenSeciliKullaniciId = this.duzenlerkenSeciliKullanici;
    this.duzenlerkenSeciliKullanici = this.kullaniciDuzenleme.value;
    this.duzenlerkenSeciliKullanici.uid = this.duzenlerkenSeciliKullaniciId.uid;
    this.duzenlerkenSeciliKullanici.duzTarih = tarih.getTime().toString();

    console.log(this.duzenlerkenSeciliKullanici)
    this.fbservisi.kullaniciDuzenle(this.duzenlerkenSeciliKullanici).subscribe(d => {
     this.toastim.success("Düzenleme Başarılı !")
      this.modal.toggle();
    });
  }
}
