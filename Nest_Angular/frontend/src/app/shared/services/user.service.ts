import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ILogin, ILoginRespose, IRegister } from '../models/user.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  http = inject(HttpClient);

  login(login: ILogin): Observable<ILoginRespose> {
    return this.http.post<ILoginRespose>('/api/auth/login', login);    
  }
  register(register: IRegister) {
    return this.http.post<ILoginRespose>('/api/auth/register', register);
  }

}
