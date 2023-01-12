import { HotToastModule, HotToastService } from '@ngneat/hot-toast';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Injectable } from '@angular/core';
import { addDoc, collection, collectionData, deleteDoc, doc, docData, Firestore, setDoc, updateDoc } from '@angular/fire/firestore';
import { from, Observable, of, switchMap } from 'rxjs';
import { Kategoriler } from '../models/kategoriler';
import { Lessons } from '../models/lessons';
import { Users } from '../models/users';
import { Yorumlar } from '../models/yorumlar';
import {
  Auth,
  authState,
  createUserWithEmailAndPassword,
  deleteUser,
  signInWithEmailAndPassword,
  updateProfile,
  user,
  User,
  UserInfo,
  GoogleAuthProvider
} from '@angular/fire/auth';
import {
  deleteObject,
  getDownloadURL,
  ref,
  Storage,
  uploadBytes,
} from '@angular/fire/storage';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class FirebaseservisService {
aktifUye = authState(this.auth);
constructor(
  public firestore:Firestore,
  public auth:Auth,
  public storage: Storage,
  private auth2:AngularFireAuth,
  public router: Router,
  public toastim:HotToastService
) { }


// EĞİTİM SERVİSLERİ 

egitimListele() {
  var ref = collection(this.firestore, "Lessons");
  return collectionData(ref, { idField: 'egitimId' }) as Observable<Lessons[]>;
}

egitimEkle(egitim: Lessons) {
  var ref = collection(this.firestore, "Lessons");
  return addDoc(ref, egitim);
}

egitimSil(egitim:Lessons){
  var ref = doc(this.firestore, "Lessons/" + egitim.egitimId);
  return deleteDoc(ref);
}

egitimDuzenle(egitim: Lessons) {
  var ref = doc(this.firestore, "Lessons/" + egitim.egitimId);
  return from(updateDoc(ref, { ...egitim }));
}
// KATEGORİ SERVİSLERİ 

kategoriListele(){
  var ref = collection(this.firestore, "Kategoriler");
  return collectionData(ref, { idField: 'katId' }) as Observable<Kategoriler[]>;
}

kategoriEkle(kategori: Kategoriler) {
  var ref = collection(this.firestore, "Kategoriler");
  return addDoc(ref, kategori);
}

kategoriSil(kategori:Kategoriler){
  var ref = doc(this.firestore, "Kategoriler/" + kategori.katId);
  return deleteDoc(ref);
}

kategoriDuzenle(kategori: Kategoriler) {
  var ref = doc(this.firestore, "Kategoriler/" + kategori.katId);
  return from(updateDoc(ref, { ...kategori }));
}
// YORUM SERVİSLERİ 

yorumListele(){
  var ref = collection(this.firestore, "Yorumlar");
  return collectionData(ref, { idField: 'yorumId' }) as Observable<Yorumlar[]>;
}

yorumEkle(yorum: Yorumlar) {
  var ref = collection(this.firestore, "Yorumlar");
  return addDoc(ref, yorum);
}

yorumSil(yorum:Yorumlar){
  var ref = doc(this.firestore, "Yorumlar/" + yorum.yorumId);
  return deleteDoc(ref);
}

// KULLANICILAR SERVİSLERİ

kullaniciListele(){
  var ref = collection(this.firestore, "Users");
  return collectionData(ref, { idField: 'uid' }) as Observable<Users[]>;
}

kullaniciEkle(uye: Users) {
  var ref = doc(this.firestore, 'Users', uye.uid);
  return from(setDoc(ref, uye));
}

kullaniciSil(kullanici: Users){
  var ref = doc(this.firestore, "Users/" + kullanici.uid);
  return deleteDoc(ref);
}

kullaniciDuzenle(kullanici: Users) {
  var ref = doc(this.firestore, "Users/" + kullanici.uid);
  return from(updateDoc(ref, { ...kullanici }));
}

get AktifUyeBilgi() {
  return this.aktifUye.pipe(
    switchMap((user) => {
      if (!user?.uid) {
        return of(null);
      }
      const ref = doc(this.firestore, 'Users', user?.uid);
      return docData(ref) as Observable<Users>;
    })
  );
}

uploadImage(image: File, path: string): Observable<string> {
  const storageRef = ref(this.storage, path);
  const uploadTask = from(uploadBytes(storageRef, image));
  return uploadTask.pipe(switchMap((result) => getDownloadURL(result.ref)));
}

deleteImage(path:string){
  const desertRef = ref(this.storage, path);
  deleteObject(desertRef).then(() => {
    console.log("Silindi")
  });
}

// OTURUM İŞLEMLERİ

KayitOl(mail: string, parola: string) {
  return from(createUserWithEmailAndPassword(this.auth, mail, parola));
}
KayitOl2(mail: string, parola: string,aktifKullanici:Users) {
  return from(createUserWithEmailAndPassword(this.auth, mail, parola).then(s=> {
    if(aktifKullanici.email && aktifKullanici.parola){
      this.OturumAc(aktifKullanici.email,aktifKullanici.parola);
      console.log("OLDU LA")
    }
    
  }));
}
OturumAc(mail: string, parola: string) {
  return from(signInWithEmailAndPassword(this.auth, mail, parola));
}
OturumKapat() {
  return from(this.auth.signOut());
}

googleSignIn(){
  return this.auth2.signInWithPopup(new GoogleAuthProvider).then(res=> {
    localStorage.setItem('token',JSON.stringify(res.user?.uid));
    this.router.navigate(['/']);
    this.toastim.success("Hoşgeldiniz.")
  },err=> {
    alert(err.message);
  })
}
}