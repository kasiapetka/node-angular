import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from '../http.service';
import { User } from '../user';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  // obiekt formularza
  registerForm: FormGroup;
  // zapisanie informacji o tym, że dane zostały wysłane do serwera i jesteśmy w trakcie oczekiwania na dane
  loading = false;
  // zapisanie informacji o tym, że użytkownik nacisnął przycisk akceptujący formularz
  submitted = false;
  // lista błędów otrzymanych z serwera
  serverErrors: String[] = [];


  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private httpService: HttpService
  ) {
    // Sprawdzenie czy uzytkownik nie jest zalogowany, jezeli tak - przejscie do głownego panelu
    if (httpService.isLogin) { 
        this.router.navigate(['/']);
    }
  }

  // Funkcja wywoływana po zainicjalizowaniu komponentu
  ngOnInit() {
    // Tworzenie grupy pól formularza
    this.registerForm = this.formBuilder.group({
      user_name: ['', [Validators.required, Validators.minLength(3)]],
      user_password: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  // Getter zwracający pola formularza
  get formControls() {
    return this.registerForm.controls;
  }

  // Funkcja akceptująca formularz
  onSubmit() {
    this.submitted = true;
    this.serverErrors = [];

    // Sprawdzenie poprawności danych w formularzu
    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
    
    // Stworzenie obiektu uzytkownika z danych formularza i przesłanie ich do serwera
    this.httpService.register(new User(0, this.registerForm.controls.user_name.value, this.registerForm.controls.user_password.value))
    // Subskrybcja do strumienia danych zwrotnych z zapytania http
      .subscribe(
        data => {
          if ("register" in data) {
            if (data["register"] === true) {
              // przejscie do strony logowania jezeli udało się zarejestrować
              this.router.navigate(['/login']);
            } else {
              this.loading = false;
              // dodanie błędów do listy jeżeli nie udało się zarejestrować użytkownika
              this.serverErrors.push(JSON.stringify(data));
              console.log("RegisterComponent, onSubmit:", data);
            }
          } else {
            // dodanie błędów do listy jeżeli nie udało się zarejestrować użytkownika
            this.loading = false;
            this.serverErrors.push(JSON.stringify(data));
            console.log("RegisterComponent, onSubmit:", data);
          }

        },
        error => {
          this.loading = false;
        });

  }
}
