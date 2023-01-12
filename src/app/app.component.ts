import { FirebaseservisService } from './services/firebaseservis.service';
import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { User } from '@angular/fire/auth';
import { Users } from './models/users';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  
  uye = this.fbservisi.AktifUyeBilgi;
  

  constructor(
    public fbservisi: FirebaseservisService,
    public router: Router
  ) {

  }
bak(){
  console.log(this.uye);
}

  OturumKapat() {
    this.fbservisi.OturumKapat().subscribe(() => {
      this.router.navigate(['login']);
    });
  }
}
