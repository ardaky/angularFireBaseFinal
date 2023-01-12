import { Kategoriler } from './../../models/kategoriler';
import { HotToastService } from '@ngneat/hot-toast';
import { FirebaseservisService } from './../../services/firebaseservis.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Lessons } from 'src/app/models/lessons';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import * as bootstrap from 'bootstrap';
import {Modal} from 'bootstrap';
import { Yorumlar } from 'src/app/models/yorumlar';
import { Users } from 'src/app/models/users';
import { concatMap } from 'rxjs';

@Component({
  selector: 'app-egitimler',
  templateUrl: './egitimler.component.html',
  styleUrls: ['./egitimler.component.css']
})
export class EgitimlerComponent implements OnInit {
  

  uye = this.fbservisi.AktifUyeBilgi;
 
  // MODAL TANIMLARI

  modal!:Modal;
  
  // EĞİTİM TANIMLARI 
  seciliKullanici!:Users;
  tumEgitimler: Lessons[] = [];
  mevcutEgitimler: Lessons[] = [];
  seciliEgitim!: Lessons;
  duzenlerkenSeciliEgitim!:Lessons;
  duzenlerkenSeciliEgitimId!:Lessons;
  seciliEgitimler:Lessons[] = [];
  egitimiAlmisMi!:any;
  yeniYorum!:Yorumlar;
  // KATEGORİ TANIMLARI

  kategoriler: Kategoriler[] = [];
  seciliKategori: Kategoriler[] = [];
  egitiminKategorisi!:any;
  filtreKategori = 'tumu';

  // YORUM TANIMLARI

  yorumicinSeciliEgitim!:Lessons;
  filtreliYorumlar: Yorumlar[] = [];
  tumYorumlar: Yorumlar[] = [];
  yorumModaliAcikMi = false;

  // KULLANICI TANIMLARI

  tumkullanicilar:Users[] = [];
  egitmenler:Users[] = [];
  egitimiVerenEgitmenAdi!:any;
  kullanici!:Users;
  kullanicilar:Users[] = [];
  ilkBastakiKullanici!:Users;
  ilkBastakiKullaniciİcinArray:Users[] = [];
  standartKullanici!:Users;
  donguKisi!:Users;

  // FORM TANIMLARI

  egitimEkleme: FormGroup = new FormGroup({
    egitimAdi: new FormControl(),
    egitimKatId: new FormControl(),
    aciklamasi: new FormControl(),
    ucretlimi: new FormControl(),
    egitimiVerenId:new FormControl()
  });

  yorumEkleme:FormGroup = new FormGroup({
    yorum:new FormControl(),
    yapanId:new FormControl(),
    yapilmaTarihi:new FormControl(),
    yapilanDersId:new FormControl()
  });

  egitimDuzenleme: FormGroup = new FormGroup({
    egitimId: new FormControl(),
    egitimAdi: new FormControl(),
    egitimKatId: new FormControl(),
    aciklamasi: new FormControl(),
    ucretlimi: new FormControl(),
    egitimiVerenId:new FormControl()
  });


  constructor(
    public fbservisi: FirebaseservisService,
    public toastim: HotToastService
  ) { }

  ngOnInit() {
    this.EgitimleriListele();
    this.kategorileriListele();
    this.tumYorumlariListele();
    this.tumKullanicilariListele();
    this.tumEgitimleriListele();
  }


 
 
  // EĞİTİMLERLE ALAKALI KISIMLAR 

 
  // Sorgusuz süalsiz tüm eğitimleri listeler. 
  EgitimleriListele() {
    this.yorumicinSeciliEgitim = this.mevcutEgitimler[0];
    this.fbservisi.egitimListele().subscribe(d => {
      this.mevcutEgitimler = d;
    });
    
  }


  // Tüm eğitimleri listeler. Eğer kategori seçimi tümü ise hepsini getirir.
  // Tümü değilse de seçilen kategori id'sine sahip olan eğtitimler listelenir.
  tumEgitimleriListele(){
    if(this.filtreKategori == 'tumu'){
      this.fbservisi.egitimListele().subscribe(d => {
        this.tumEgitimler = d;
      });
    } else{
      this.fbservisi.egitimListele().subscribe(d => {
        this.tumEgitimler = d;
        var filtreli = this.tumEgitimler.filter(s=> s.egitimKatId == this.filtreKategori );
        this.tumEgitimler = filtreli;
      });
    }

  }

  
 //Gelen kullanıcının seçili olan eğitimi alıp almadığını kontrol eder. Aldıysa ilgili değişken true almadıysa false olur.
  egitimiAlmismiBak(kullanici:Users,egitim:Lessons){
    this.egitimiAlmisMi = kullanici.alinanVerilenDersler?.includes(egitim.egitimId);
  }
  
  
  
  // Eğitim Ekleme İşlemleri
  // Formdaki ilgili alanlara göre yeni eğitimi firebaseye ekler.
  kaydet(el:HTMLElement) {
    var tarih = new Date();
    this.egitimEkleme.value.egitimEkTarih = tarih.getTime().toString();
    this.fbservisi.egitimEkle(this.egitimEkleme.value).then(() => {
      this.toastim.success("Eğitim Eklendi");
    });
    this.modal.toggle();
    this.kullanicilar = this.tumkullanicilar.filter(s=> s.uid == this.egitimEkleme.value.egitimiVerenId);
    this.kullanici = this.kullanicilar[0];
    setTimeout(() => {
      this.kullaniciyaDersEkle(this.kullanici);
    }, 2100);
    
    setTimeout(() => {
      this.seciliEgitimler = this.tumEgitimler.filter(s=> s.egitimEkTarih == this.egitimEkleme.value.egitimEkTarih  )
      this.seciliEgitim = this.seciliEgitimler[0];
      this.fotografEkleModalAc(el);
    },1800);
    
    
  }

 // egitim ekleme modalını açar
  egitimEkleModaliAc(el: HTMLElement) {
    this.egitimEkleme.reset();
    this.modal = new bootstrap.Modal(el);
    this.egitmenleriVer();
    this.modal.show();
  } 

  // Eğitim eklendikten bir süre sonra eğitime bir fotoğraf eklenmesi için açılan modal.
  fotografEkleModalAc(el:HTMLElement){
    this.modal = new bootstrap.Modal(el);
    this.modal.show();
  }

  // Eğitimin fotoğrafı değiştirilmek istendiği zaman açılan modal
  fotografDuzenleModalAc(el:HTMLElement,egitim:Lessons){
    this.seciliEgitim = egitim;
    this.modal = new bootstrap.Modal(el);
    this.modal.show();
  }

  // Eğitime fotoğraf ekleme

  ResimYukle(event: any, egitim: Lessons) {
    this.fbservisi
      .uploadImage(event.target.files[0], `images/egitimler/${egitim.egitimId}`)
      .pipe(
        this.toastim.observe({
          loading: 'Fotoğraf Yükleniyor...',
          success: 'Fotoğraf yüklendi',
          error: 'Hata oluştu'
        }),
        concatMap((foto) =>
          this.fbservisi.egitimDuzenle({
            egitimId: egitim.egitimId,
            egitimAdi: egitim.egitimAdi,
            egitimKatId: egitim.egitimKatId,
            egitimiVerenId: egitim.egitimiVerenId,
            egitimEkTarih: egitim.egitimEkTarih,
            aciklamasi: egitim.aciklamasi,
            ucretlimi: egitim.ucretlimi,
            foto: foto
          })
        )
      )
      .subscribe();
      this.modal.toggle();
  }




  // Kullanıcı Ders Array işlemleri
  // Bu fonksiyonlar kullanıcının alinanVerilenDersler adında aldığı veya verdiği derslerini tutan dizi üzerinde güncelleme yaparlar.
  // Ekleme fonksiyonu yeni ders ekleme modalıyla beraber çalışır. Yeni eklenen dersi hangi hocanın vereceği 
  //form alanında sorulur ve ona göre ilgili eğitmenin arrayına o ders eklenir.

  kullaniciyaDersEkle(eklenecekKullanici:Users){
    var egitimler = [];
    var filtre = this.tumEgitimler.filter(s=> s.egitimiVerenId.toString() == eklenecekKullanici.uid.toString());
    for(var i = 0 ; i < filtre.length; i++){
      egitimler.push(filtre[i].egitimId);
    }
    eklenecekKullanici.alinanVerilenDersler = egitimler;
    this.fbservisi.kullaniciDuzenle(eklenecekKullanici);

  }


  // Bu fonksiyon Düzenle kısmından eğer dersi veren kişi değişirse uygulanır. Eskiden dersi veren kişinin arrayından
  // dersin ID numarasını siler ve dersin yeni sahibinin arrayına ekler.
  kullaniciyaDersEkleCikar(eklenecekKullanici:Users,cikarilacakKullanici:Users){
    var egitimler = [];
    var filtre = this.tumEgitimler.filter(s=> s.egitimiVerenId.toString() == eklenecekKullanici.uid.toString());
    for(var i = 0 ; i < filtre.length; i++){
      egitimler.push(filtre[i].egitimId);
    }
    eklenecekKullanici.alinanVerilenDersler = egitimler;
    this.fbservisi.kullaniciDuzenle(eklenecekKullanici);

    egitimler = [];
    var filtre = this.tumEgitimler.filter(s=> s.egitimiVerenId.toString() == cikarilacakKullanici.uid.toString());
    for(var i = 0 ; i < filtre.length; i++){
      egitimler.push(filtre[i].egitimId);
    }
    cikarilacakKullanici.alinanVerilenDersler = egitimler;
    this.fbservisi.kullaniciDuzenle(cikarilacakKullanici);

  }
  

  //Bir ders silme işlemi yapıldığında kullanıcının aldığı/verdiği dersleri tutan arrayından da silinmesi sağlanır.
  kullaniciDersSil(silinecekKullanici:Users){
    if(silinecekKullanici.rol == '1' || '0'){
      var egitimler = [];
      var filtre = this.tumEgitimler.filter(s=> s.egitimiVerenId.toString() == silinecekKullanici.uid.toString());
      for(var i = 0 ; i < filtre.length; i++){
        egitimler.push(filtre[i].egitimId);
      }
      silinecekKullanici.alinanVerilenDersler = egitimler;
      this.fbservisi.kullaniciDuzenle(silinecekKullanici);
    } else if(silinecekKullanici.rol == '2'){

    }
   
  }
  
  // Eğitmen veya Admin olmayan standart kullanıcının bir eğitimi satın almasını sağlar.
  standartKullaniciDersEkledi(eklenecekEgitim:Lessons,eklenecekKullanici:Users){
    eklenecekKullanici.alinanVerilenDersler?.push(eklenecekEgitim.egitimId);
    this.fbservisi.kullaniciDuzenle(eklenecekKullanici)
    this.toastim.success("Eğitim Alındı !")
  }

  
  // Eğitimi Düzenler
  // TimeOut programın düzgün çalışması için var. TimeOut Vermediğim zaman firestore üzerine verileri hatalı yazıyordu..
  egitimDuzenle(){
    this.duzenlerkenSeciliEgitim = this.egitimDuzenleme.value;
    this.fbservisi.egitimDuzenle(this.duzenlerkenSeciliEgitim).subscribe(d=> {
      this.toastim.success("Eğitim Düzenlendi");
      this.modal.toggle();
    })
    this.kullanicilar = this.tumkullanicilar.filter(s=> s.uid == this.egitimDuzenleme.value.egitimiVerenId);
    this.kullanici = this.kullanicilar[0];
    setTimeout(() => {
      this.kullaniciyaDersEkleCikar(this.kullanici,this.ilkBastakiKullanici);
    }, 2200);
   ;
  }

  // Eğitim düzenleme modalını açar.
  egitimDuzenleModaliAc(el:HTMLElement, egitim:Lessons){
    this.egitmenleriVer();
    this.modal = new bootstrap.Modal(el);
    this.egitimDuzenleme.patchValue(egitim);
    this.duzenlerkenSeciliEgitim = egitim;
    this.ilkBastakiKullaniciİcinArray = this.tumkullanicilar.filter(s=> s.uid == this.duzenlerkenSeciliEgitim.egitimiVerenId )
    this.ilkBastakiKullanici = this.ilkBastakiKullaniciİcinArray[0];
    this.modal.show()
  }

  
  
  
  // Eğitim Silme İşlemleri 
  
  
  egitimSil(){
    // Silinen eğitimin storage üzerindeki resminin de silinmesini sağlar.
    if(this.seciliEgitim.foto){
      this.fbservisi.deleteImage(this.seciliEgitim.foto);
    }
    
    // Bu kısım Silinecek dersi alan veya veren kullanıcıların tümünden siler.
    // Bazı hataların çözümü için bazı yerlerde setTimeOut ile gecikme verdim.
    for(var i=0; i < this.tumkullanicilar.length; i++){
      if(this.tumkullanicilar[i].alinanVerilenDersler?.includes(this.seciliEgitim.egitimId)){
        var index = this.tumkullanicilar[i].alinanVerilenDersler?.indexOf(this.seciliEgitim.egitimId);
        if(index){
          this.tumkullanicilar[i].alinanVerilenDersler?.splice(index,1);
          this.fbservisi.kullaniciDuzenle(this.tumkullanicilar[i]);
          setTimeout(() => {
            this.tumKullanicilariListele();
          }, 500); 
        }
      }
      if(this.tumkullanicilar[i].rol == '1' && this.seciliEgitim.egitimiVerenId == this.tumkullanicilar[i].uid){
        var index = this.tumkullanicilar[i].alinanVerilenDersler?.indexOf(this.seciliEgitim.egitimiVerenId);
        if(index){
          this.tumkullanicilar[i].alinanVerilenDersler?.splice(index,1);
          this.fbservisi.kullaniciDuzenle(this.tumkullanicilar[i]);
          setTimeout(() => {
            this.tumKullanicilariListele();
          })
        }

      }
    }
    setTimeout(() => {
      this.fbservisi.egitimSil(this.seciliEgitim);
      }, 1050);
    this.toastim.success("Eğitim Silindi.")
    setTimeout(() =>{
      this.modal.toggle();
    }, 850)
  }


  // Eğitimi silmek için gerekli olan modalı açar.
  egitimSilModalAc(el:HTMLElement,egitim:Lessons){
    this.modal = new bootstrap.Modal(el);
    this.seciliEgitim = egitim;
    this.modal.show()
  }

 
 
 
 
 
  // KATEGORİLERLE ALAKALI KISIMLAR

  
  // tüm kategorileri listeler.
  kategorileriListele(){
    this.fbservisi.kategoriListele().subscribe(d => {
      this.kategoriler = d;
    });
  }

  // Eğitimin kategori ıd'sini alarak kategori nesnesini bulup adını döndürür.
  egitimKategoriById(egitimKatId:string){
    var filtre = this.kategoriler.filter(a=> a.katId == egitimKatId);
    if(filtre.length > 0){
      this.egitiminKategorisi = filtre[0].katAdi;
    } 
  }

  // Seçilen kategoriye göre eğitimleri listeler.
  kategorilereGoreListele(katId:string){
    this.filtreKategori = katId;
    this.tumEgitimleriListele();
  }
 
 
  // YORUMLARLA ALAKALI KISIMLAR

  tumYorumlariListele() {
    this.fbservisi.yorumListele().subscribe(d => {
      this.tumYorumlar = d;
    });
    
    
  }

  yorumlarModali(listelenecekEgitim:Lessons,el:HTMLElement,kullanici:Users){
    this.yorumModaliAcikMi = true;
    this.modal = new bootstrap.Modal(el);
    this.yorumicinSeciliEgitim = listelenecekEgitim;
    this.seciliKullanici = kullanici;
    this.filtreliYorumlar = [];
    this.filtreliYorumlar = this.tumYorumlar.filter(s=> s.yapilanDersId.toString() == listelenecekEgitim.egitimId.toString());
    this.modal.show();
  }

  yorumModaliKapat(){
    this.yorumModaliAcikMi = false;

  }

  yorumKaydet(){
    var tarih = new Date();
    this.yorumEkleme.value.yapilmaTarihi = tarih.getTime().toString();
    this.yorumEkleme.value.yapanId = this.seciliKullanici.uid;
    this.yorumEkleme.value.yapilanDersId = this.yorumicinSeciliEgitim.egitimId;
    this.fbservisi.yorumEkle(this.yorumEkleme.value);
    this.toastim.success("Yorum Eklendi !");
    this.yorumEkleme.reset();
    this.modal.toggle();

  }

  yorumSil(yorum:Yorumlar){
    this.fbservisi.yorumSil(yorum);
    this.toastim.success("Yorum Silindi.");
    this.tumYorumlariListele();
    this.modal.toggle();

  }
  
  
  
  
  
  // KULLANICI KISIMLARI

  tumKullanicilariListele() {
    this.fbservisi.kullaniciListele().subscribe(d => {
      this.tumkullanicilar = d;
    });
  }
  
  // Eğitmen rolüne sahip olan kullanıcıları verir.
  egitmenleriVer(){
      this.egitmenler = this.tumkullanicilar.filter(a => a.rol?.toString() == "1");
  }

  // Gelen Id numarasını alıp ilgili Id numarasına sahip kişinin adını değişkene aktarır. Bu değişkeni ise HTML içinde yazdık.
  egitimVerenAdiById(egitimVerenId:string){
    var filtre = this.tumkullanicilar.filter(a=> a.uid == egitimVerenId);
    if(filtre.length > 0){
      this.egitimiVerenEgitmenAdi = filtre[0].displayName;
    }
  }

  // gelen kullanıcının ıd numarasını döngüde kullanmak üzere değişkene atar. Listelemede her döngü döndüğünde değişken değeri de değişir
  kisiVer(kisiId:string){
    if(this.tumkullanicilar){
      if(this.tumkullanicilar.length >= 0){
        var filtre = this.tumkullanicilar.filter(s=> s.uid == kisiId);
        this.donguKisi = filtre[0];

      } 
    }
  }

  
  
}