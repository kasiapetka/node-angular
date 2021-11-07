import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from './user';

const URL = "/api"

@Injectable({
  providedIn: 'root'
})  
export class HttpService {

  // dla uproszczenia działania aplikacji - UserService będzie przechowywać dane o zalogowanym uzytkowniku
  isLogin: boolean = false;
  loginUserData: User; 

  constructor(private http: HttpClient) { }

  // Funkcja umożliwiająca logowanie
  login(user: User) {
    return this.http.post(URL + "/login", user);
  }

  // Funkcja umożliwiająca wylogowanie
  logout() {
    return this.http.get(URL + "/logout");
  }

  // Funkcja umożliwiająca rejestrację
  register(user: User) {
    return this.http.post(URL + "/register", user);
  }

  // Setter ustawiający wartość w polu loginUserData
  set user(user: User) {
    this.loginUserData = user;
  }  
}
