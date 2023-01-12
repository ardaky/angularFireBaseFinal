import { Kategoriler } from './../../models/kategoriler';
import { HotToastService } from '@ngneat/hot-toast';
import { Lessons } from './../../models/lessons';
import { FirebaseservisService } from './../../services/firebaseservis.service';

import { Component, OnInit } from '@angular/core';
import { Users } from 'src/app/models/users';
import * as bootstrap from 'bootstrap';
import {Modal} from 'bootstrap';
import { FormControl, FormGroup } from '@angular/forms';

import { switchMap } from 'rxjs';

@Component({
  selector: 'app-kullanicilar',
  templateUrl: './kullanicilar.component.html',
  styleUrls: ['./kullanicilar.component.css']
})
export class KullanicilarComponent implements OnInit {

  // YENİ KULLANICI EKLEME /KULLANICI DÜZENLEME FORMU

  kullaniciDuzenleme: FormGroup = new FormGroup({
    displayName: new FormControl(),
    rol: new FormControl(),
    email: new FormControl()
  });

  // BU KULLANICI EKLEME FORMU ADMİNLER İÇİNDİR. SADECE ADMİNLERİN ULAŞABİLECEĞİ KULLANICILAR SAYFASINDAN BÜTÜN KULLANICILAR
  // YÖNETİLEBİLİR, EKLENEBİLİR, DÜZENLENEBİLİR, SİLİNEBİLİR. EKLENEN KULLANICI DOĞRUDAN AUTHENTİCATİON KISMINA DA EKLENİR.
  // Login sayfasından yapılan kullanıcı kayıtları herkes içindir ve yapılan kullanıcı kaydının rolü otomatik olarak 2 (standart kullanıcı)
  // olur. Burada ise admin olan kişi istediği kullanıcıyı istediği rolde kayıt edebilir. Veya kaydı olan kullanıcının rolünü vs. değişebilir.

  uye = this.fbservisi.AktifUyeBilgi;
  tumkullanicilar:Users[] = [];
  tumEgitimler:Lessons[] = [];
  donguDers!:Lessons;
  kategoriler!:Kategoriler[];
  kategori!:Kategoriler;

  // MODAL TANIMLAMALARI

  filtreliEgitimler:Lessons[] = [];
  egitimlerModaliAcikMi = false;
  modal!:Modal;
  seciliKullanici!:Users;
  duzenlerkenSeciliKullanici!:Users;
  duzenlerkenSeciliKullaniciId!:Users;
  kullaniciAlinanVerilenDersler!:Lessons[];

  constructor(
    public fbservisi: FirebaseservisService,
    public toastim: HotToastService
    ) { }

  ngOnInit() {
    this.tumKullanicilariListele();
    this.tumEgitimleriListele();
    this.kategorileriListele();
  }




  // LİSTELEME ALANLARI 

  //Tüm kullanıcıları listeleyen fonksiyon
  tumKullanicilariListele() {
    this.fbservisi.kullaniciListele().subscribe(d => {
      this.tumkullanicilar = d;
    });
}
 
  // TÜM EĞİTİMLERİ LİSTELEYEN FONKSİYON (kullaniciEgitimleri() fonksiyonun doğru çalışması için gerekli)
  tumEgitimleriListele() {
    this.fbservisi.egitimListele().subscribe(d => {
      this.tumEgitimler = d;
    });
  }

  kategorileriListele(){
    this.fbservisi.kategoriListele().subscribe(d => {
      this.kategoriler = d;
    });
  }
  
  

  // KULLANICI EKLEME / KAYDETME 

  // Formdaki value'larla yeni kullanıcı kaydı yapar. Sadece admin olan kişiler kullanabilir. 
  

  kayitOl(adsoyad: string, email: string, parola: string, rol:string,) {
    
    var tarih = new Date();
    this.fbservisi.
      KayitOl(email, parola)
      .pipe(
        switchMap(({ user: { uid } }) =>
          this.fbservisi.kullaniciEkle({ 
            uid,
            email,
            displayName: adsoyad,
            rol: rol,
            kayTarih: tarih.getTime().toString(),
            duzTarih: tarih.getTime().toString(),
            alinanVerilenDersler: [],
            

          })
        ),
        this.toastim.observe({
          success: 'Tebrikler Kayıt Yapıldı',
          loading: 'Kullanıcı Kaydı Yapılıyor...',
          error: ({ message }) => `${message}`,
        })
      )
      .subscribe(() => {});
      this.modal.toggle();
  }

  // Kullanıcı Ekleme Modalını Açar.
  kullaniciyiEkleModaliAc(el:HTMLElement){
    this.modal = new bootstrap.Modal(el);
    this.modal.show();
  }




  // KULLANICI SİLME 

  // Seçili olan kullanıcıyı silen fonksiyon. Eğer kullanıcı bensem :) . Silmez.
  kullaniciyiSil(){
    if(this.seciliKullanici.uid == "S2MwJ9cC6IemCzKvy7gkHXdxLeH3" ){
      this.toastim.error("Bu kullanıcı silinemez !")
    } else{
      this.fbservisi.kullaniciSil(this.seciliKullanici).then(() => {
        this.toastim.success("Kullanıcı silindi.")
      });
    }
    
    this.modal.toggle();
  }


  // Kullanıcı Silme Modalını Açar.
  kullaniciyiSilmeModali(el:HTMLElement,kullanici:Users){
    this.seciliKullanici = kullanici;
    this.modal = new bootstrap.Modal(el);
    this.modal.show();
  }




  // KULLANICI DÜZENLEME 

  //Kullanıcıyı Düzenleme Fonksiyonu (Aşağıdaki atama işlemlerini indexOf hatasını çözmek için yaptım. Yapmasaydım bu fonksiyona da parametre istemek zorunda kalırdım.)
  kullaniciyiDuzenle(){
    var tarih = new Date();
    
    
    this.duzenlerkenSeciliKullaniciId = this.duzenlerkenSeciliKullanici;
    this.duzenlerkenSeciliKullanici = this.kullaniciDuzenleme.value;
    this.duzenlerkenSeciliKullanici.uid = this.duzenlerkenSeciliKullaniciId.uid;
    this.duzenlerkenSeciliKullanici.duzTarih = tarih.getTime().toString();

    console.log(this.duzenlerkenSeciliKullanici)
    this.fbservisi.kullaniciDuzenle(this.duzenlerkenSeciliKullanici).subscribe(d => {
      this.toastim.success("Kullanıcı düzenlendi.")
      this.modal.toggle();
    });
  }


  kullaniciyiDuzenleModali(el:HTMLElement, kullanici:Users){
    this.kullaniciDuzenleme.patchValue(kullanici);
    this.duzenlerkenSeciliKullanici = this.kullaniciDuzenleme.value;
    this.duzenlerkenSeciliKullanici.uid = kullanici.uid;
    this.modal = new bootstrap.Modal(el);
    this.modal.show();
  }


  alinanVerilenEgitimlerGor(el:HTMLElement,kullanici:Users){
    this.modal = new bootstrap.Modal(el);
    this.seciliKullanici = kullanici;
    this.modal.show();
  }

  dersiGetir(dersid:string){
    if(this.tumEgitimler){
      if(this.tumEgitimler.length >= 0){
        var filtre = this.tumEgitimler.filter(s=> s.egitimId == dersid);
        this.donguDers = filtre[0];
        var filtre2 = this.kategoriler.filter(s=> s.katId == this.donguDers.egitimKatId);
        this.kategori = filtre2[0]; 
      } 
    }
  }
  // KULLANICININ ALDIĞI / VERDİĞİ EĞİTİMLERİ LİSTELEME
  
  // (Modal Açıldığı gibi kullanıcının aldığı veya eğitmense verdiği eğitimlerin listelenmesi için fonksiyon hem modalı açıyor hem de listeleme yapıyor.)
  // kullaniciEgitimleri(el:HTMLElement,kullanici:Users){
  //   this.seciliKullanici = kullanici;
  //   this.modal = new bootstrap.Modal(el);
  //   this.filtreliEgitimler = [];
  //   this.modal.show();
    
  //   this.filtreliEgitimler = [];
  //   for(var i=0; i < kullanici.alinanVerilenDersler.length; i++){
  //     var filtre = this.tumEgitimler.filter(s=> s.egitimId == kullanici.alinanVerilenDersler[i]);
      
     


  

  
  

  
}