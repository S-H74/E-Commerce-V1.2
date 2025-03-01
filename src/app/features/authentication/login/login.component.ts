import { Component, inject } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms'
import { AuthenticationAPIService } from '../../../core/services/authenticationAPI/authentication-api.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule,RouterLink,CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  constructor(private authenticationAPIService :AuthenticationAPIService){};
  // private authenticationAPIService = inject(AuthenticationAPIService);
  routing = inject(Router);
  API_Message : string = "";
  Loading :boolean = false;
  //----------------- controls-Names and Validations -----------------
  loginForm : FormGroup = new FormGroup({
      email: new FormControl(null,[Validators.email,Validators.required]),
      password: new FormControl(null,[Validators.required,Validators.pattern(/^[A-Za-z\d!@#$%^&*()_+{}\[\]:;"'<>,.?\/\\|-]+$/
)]),
    });
    // ------------------------ loginButton-function ------------------------
  loginSubmit()
  {
    if (this.loginForm.valid) {
      this.Loading =true;
      this.authenticationAPIService.sendingLoginToAPI(this.loginForm.value).subscribe(
        {
        next:(res)=>{
          if (res.message == "success") {
            localStorage.setItem('userToken',res.token);
            this.authenticationAPIService.getUserData();
            this.routing.navigate(['/home']);
          }
          this.Loading= false;
        },
        error:(err)=>{
          this.API_Message = err.error.message;
          this.Loading= false;
        }
      }
    )
    }
  };
  isPasswordVisible: boolean = false;
  togglePassword(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }
}
