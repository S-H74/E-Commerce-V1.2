import { Component, inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthenticationAPIService } from '../../../core/services/authenticationAPI/authentication-api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forget-password',
  imports: [ReactiveFormsModule],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.scss'
})
export class ForgetPasswordComponent {
  constructor(private readonly authenticationAPIService :AuthenticationAPIService){};
  private routing = inject(Router);
  Completed_step = 0;
  API_Message = "";
  verifying_userEmail :FormGroup = new FormGroup({
    email: new FormControl(null,[Validators.required,Validators.email])
  });
  verifying_resetCode : FormGroup = new FormGroup({
    resetCode : new FormControl(null,[Validators.required,Validators.pattern(/^[0-9]{6}$/)])
  });
  reset_Password : FormGroup = new FormGroup({
    email : new FormControl(null,[Validators.required,Validators.email]),
    newPassword : new FormControl(null,[Validators.required,Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)]),
    re_newPassword : new FormControl(null,[Validators.required,Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)]),
  },this.confirmationPasswords);


    confirmationPasswords(newPassword : AbstractControl)
    {
      if(newPassword.get('newPassword')?.value === newPassword.get('re_newPassword')?.value)
      {
        return null
      }
      else{
        return {'msMatchedPasswords': true};
      }
    };
  //-------------------------------------------------------------
  verify_Email(){
    if (this.verifying_userEmail.value !=null) {
      this.authenticationAPIService.verifyingUserEamil(this.verifying_userEmail.value).subscribe({
        next:(res)=>{
          console.log(res);
          if (res.statusMsg === "success") {
            let userEmail_readonly = this.verifying_userEmail.get('email')?.value;
            this.reset_Password.get('email')?.patchValue(userEmail_readonly);
            this.Completed_step = 1;
          }
        },
        error:(err)=>{
          this.API_Message = err.error.message;
        }
      })

    }
  };
  reset_Code(){
    if (this.verifying_resetCode.value !=null) {
      this.authenticationAPIService.verifyingResetCode(this.verifying_resetCode.value).subscribe({
        next:(res)=>{
          console.log(res);
            this.Completed_step = 2;
        },
        error:(err)=>{
          this.API_Message = err.error.message;
        }
      })

    }
  };
  reset_NewPassword(){
    if (this.reset_Password.value !=null) {
      this.authenticationAPIService.ressetPassword(this.reset_Password.value).subscribe({
        next:(res)=>{
          localStorage.setItem('userToken',res.token);
          this.authenticationAPIService.getUserData();
          this.routing.navigate(['/home']);
        },
        error:(err)=>{
          this.API_Message= err.error.message;
        }
      })
    }
  }
}
