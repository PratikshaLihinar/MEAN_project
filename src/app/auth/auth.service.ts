import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Subject } from 'rxjs';
import { AuthData } from './auth-data.model';
import { environment } from "src/environments/environment";

const BACKEND_URL = environment.apiUrl+"/user"; 
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = false;
  private token: string;
  private tokenTime: any;
  private authStatusListener = new Subject<boolean>();
  constructor(private http: HttpClient, private router: Router) {}
  getToken(){
    return this.token;
  }
  getAuthStatusListener() {  
    return this.authStatusListener.asObservable();  
  }  
  getIsAuth(){
   return this.isAuthenticated;
  }
  createUser(email: string, password: string){
    const authData: AuthData ={email: email, password: password};
    this.http
    .post(BACKEND_URL + "/signup", authData)
    .subscribe(() =>{
      // console.log(response);
      this.router.navigate(["/"]);
    }, error =>{
      // console.log(error);
      this.authStatusListener.next(false);
    });
  }

  login(email: string, password: string){
    const authData: AuthData ={email: email, password: password};
    this.http.post<{token: string, expiresIn: number}>(BACKEND_URL + "/login", authData)
    .subscribe(response =>{
      // console.log(response);
      const token = response.token;
      this.token = token;
      if(token){
        const expiresInDuration = response.expiresIn;
        // console.log(expiresInDuration);
        this.setAuthTimer(expiresInDuration);
        this.isAuthenticated =true;
        this.authStatusListener.next(true);  
        const now = new Date();
        const expireationDate = new Date(now.getTime() + expiresInDuration * 1000);
        this.saveAuthData(token, expireationDate);
        // console.log(expireationDate);
        
        this.router.navigate(['/']);
      }
     
    }
    // , error =>{
    //   this.authStatusListener.next(false);
    // }
    );
  }
  autoAuthUser(){
   const authInformation = this.getAuthData();
   if(!authInformation){
    return;
   }
   const now = new Date();
   const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
   if(expiresIn > 0){
    this.token =authInformation.token;
    this.isAuthenticated =true;
    this.setAuthTimer(expiresIn/1000);
    this.authStatusListener.next(true);
   }
  }
  logout(){
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTime);
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  private saveAuthData(token: string, expiratetionDate: Date){
    localStorage.setItem('token',token);
    localStorage.setItem('expiration',expiratetionDate.toISOString());
  }

  private clearAuthData(){
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
  }
  // private getAuthData(){
  //   const token = localStorage.getItem("token");
  //   const expiratetionDate = localStorage.getItem("expiration");
    
  //   return{
  //     token : token,
  //     expiratetionDate: new Date(expiratetionDate)
  //   }
  // }
  private getAuthData() {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    // if (!token || !expirationDate) {
    //   return;
    // }
    return {
      token: token,
      expirationDate: new Date(expirationDate)
    }
  }
  private setAuthTimer(duration: number){
    console.log("serting timer:" + duration);
    
    this.tokenTime = setTimeout(()=>{
      this.logout();
    }, duration * 1000);
  }
}
