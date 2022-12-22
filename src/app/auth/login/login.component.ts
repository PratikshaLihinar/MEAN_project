import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
// export class LoginComponent implements OnInit, OnDestroy{
  export class LoginComponent {
 isLoading= false;
// private authStatusSub: Subscription;
  constructor(private authService: AuthService){}
  // ngOnInit(){
  //  this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
  //   authStatus =>{
  //     this.isLoading=false;
  //   }
  //  );
  // }
 onLogin(form: NgForm){
  // console.log(form.value);
  if(form.invalid){
    return;
  }
  this.authService.login(form.value.email, form.value.password);
  
 }
//  ngOnDestroy(){
//   this.authStatusSub.unsubscribe();
// }
}
