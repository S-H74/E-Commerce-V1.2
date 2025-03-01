import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { jwtDecode } from "jwt-decode";
import { PlatFormService } from '../platForm/plat-form.service';
import { Env } from '../../Environment/Environment';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationAPIService {
  userData : BehaviorSubject<any> = new BehaviorSubject(null);
  private httpClient = inject(HttpClient);
  private platFormService = inject(PlatFormService);
  constructor() {
    if (this.platFormService.checkingPlatForm()) {
      this.getUserData();
    }
  };
  sendingResgistrationToAPI(registrationInfo :object):Observable<any>{
    return this.httpClient.post(`${Env.baseURL}/api/v1/auth/signup`,registrationInfo);
  };
  sendingLoginToAPI(loginInfo :object) : Observable<any> {
    return this.httpClient.post(`${Env.baseURL}/api/v1/auth/signin`,loginInfo);
  };
  getUserData()
  {
    if (localStorage.getItem('userToken') != null) {
    this.userData.next(jwtDecode(JSON.stringify(localStorage.getItem('userToken'))));
    }
  };
  verifyingUserEamil(userEamil:object) :Observable<any>
  {
    return this.httpClient.post(`${Env.baseURL}/api/v1/auth/forgotPasswords`,userEamil);
  };
  verifyingResetCode(code :object):Observable<any>{
    return this.httpClient.post(`${Env.baseURL}/api/v1/auth/verifyResetCode`,code);
  };
  ressetPassword(newData:object):Observable<any>{
    return this.httpClient.put(`${Env.baseURL}/api/v1/auth/resetPassword`,newData);
  };
}

