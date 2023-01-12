import { HotToastService } from '@ngneat/hot-toast';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FirebaseservisService } from 'src/app/services/firebaseservis.service';
import { Kategoriler } from 'src/app/models/kategoriler';
import { Lessons } from 'src/app/models/lessons';
import { Modal } from 'bootstrap';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-kategoriler',
  templateUrl: './kategoriler.component.html',
  styleUrls: ['./kategoriler.component.css']
})
export class KategorilerComponent implements OnInit {

  kategoriEkleme: FormGroup = new FormGroup({
    katAdi:new FormControl()
  })
  modal!:Modal;
  kategoriler!:Kategoriler[];
  kategoriEgitimleri!:Lessons[];
  tumEgitimler!:Lessons[];
  modalbaslik = ''
  seciliKategori!:Kategoriler;

  constructor(
    public fbservisi:FirebaseservisService,
    public toastim: HotToastService
  ) { }

  ngOnInit() {
    this.kategorileriListele();
    this.egitimListele();

  }

  // tüm kategorileri listeler.
  kategorileriListele(){
    this.fbservisi.kategoriListele().subscribe(d => {
      this.kategoriler = d;
    });
  }

  egitimListele(){
    this.fbservisi.egitimListele().subscribe(d => {
      this.tumEgitimler = d;
    });
  }

  kategoriDersleriVer(katId:string){
    this.kategoriEgitimleri = this.tumEgitimler.filter(s=> s.egitimKatId == katId);
  }

  kategoriEkleModalAc(el:HTMLElement){
    this.seciliKategori = this.kategoriEkleme.value;
    this.kategoriEkleme.reset();
    this.modal = new bootstrap.Modal(el);
    this.modalbaslik = "Kateegori Ekleme";
    this.modal.show();
  }

  kategoriKaydet(){
    var filtre = this.kategoriler.filter(s=> s.katAdi == this.seciliKategori.katAdi);
    if(filtre.length > 0){
      this.seciliKategori.katAdi = this.kategoriEkleme.value.katAdi;
      this.fbservisi.kategoriDuzenle(this.seciliKategori);
      this.modal.toggle();
      this.toastim.success("Kategori Düzenlendi.")
    } else{
      this.fbservisi.kategoriEkle(this.kategoriEkleme.value);
      this.modal.toggle();
      this.toastim.success("Kategori Eklendi.")
    }
   
  }

  kategoriSil(kat:Kategoriler){
    var filtre = this.tumEgitimler.filter(s=> s.egitimKatId == kat.katId);
    if(filtre.length > 0){
      this.toastim.error("Üzerinde eğitim kaydı olan kategori silinemez !")
    } else{
      this.fbservisi.kategoriSil(kat);
      this.toastim.success("Kategori silindi.")
    }
  }

  kategoriDuzenleModalAc(el:HTMLElement,kat:Kategoriler){
    this.kategoriEkleme.patchValue(kat);
    this.seciliKategori = kat;
    this.modal = new bootstrap.Modal(el);
    this.modalbaslik = "Kategori Düzenleme";
    this.modal.show();
  }
}
