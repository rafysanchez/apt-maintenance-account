import { Injectable }                 from '@angular/core';
import { Observable } 				        from 'rxjs/Observable';
import { Http, Headers, Response }    from '@angular/http';
import { JwtHelper } 				          from 'angular2-jwt';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';

import { User } 	                    from '../users/model';
import { Message, ErrorMessage,
  InfoMessage, WarningMessage }       from '../shared';

import { AuthorizationService }       from '../authorization/service';
import { Logger }		                  from '../logger/default-log.service';
import { environment }                from '../../environments/environment';

const contentHeaders = new Headers();
contentHeaders.append('Accept', 'application/json');
contentHeaders.append('Content-Type', 'application/json');

@Injectable()
export class AuthService {

  isLoggedIn: boolean = false;
  user: User;
  loggedUser: string = ''; // Logged User Name or email
  JwtHelper = new JwtHelper();
  message: Message;

  // store the URL so we can redirect after logging in
  redirectUrl: string;

  constructor(
    private http: Http,
    private logger: Logger,
    private authzn: AuthorizationService) { }

  saveNewUser(user: User) {
    let data = JSON.stringify(user);
    let url = environment.API_URL + '/api/users';
    return this.http
      .post(url, data, { headers: contentHeaders });
  }

  login(event: String, email: String, password: String): Observable<object> {
    let data = JSON.stringify({ email, password });
    let url = environment.API_URL + '/api/login';

    this.http.post(url, data, { headers: contentHeaders }).subscribe(
      response => {
        this.logger.info('Logged In successfully...');
        let res = response.json();
        this.logger.info(res);
        localStorage.setItem('id_token', res.id_token);
        let decodedJwt = res.id_token && this.JwtHelper.decodeToken(res.id_token);
        this.logger.info('Decoded JWT...'); this.logger.info(decodedJwt);
        this.user = decodedJwt;
        this.loggedUser = decodedJwt.first_name || decodedJwt.email.split('@')[0];
        localStorage.setItem('userId', decodedJwt.id);
        this.isLoggedIn = true;
        this.message = new InfoMessage("Success", "log...");
        this.authzn.init(); // initialize after user logged in
      },
      error => {
        this.isLoggedIn = false;
        localStorage.removeItem('id_token'); // whenever isLoggedIn is set to false, remove id_token too!
        // ToDo: Use a remote logging infrastructure later
        let errMsg: string;
        if (error instanceof Response) {
          errMsg = `${error.status} - ${error.statusText || ''}`;
        } else {
          errMsg = error.message ? error.message : error.toString();
        }
        this.message = new ErrorMessage("Failure", errMsg);
      });
    return Observable.of(this).delay(1000);
  }

  logout(): void {
    this.logger.info('Logged Out @auth.service...');
    this.isLoggedIn = false;
    localStorage.removeItem('id_token'); // whenever isLoggedIn is set to false, remove id_token too!
  }

  loginToAppUsing(network: String, socialToken: String): Observable<object> {
    this.logger.info('About to Login to App through social network...');
    let data = JSON.stringify({ network, socialToken });
    let url = environment.API_URL + '/api/sociallogin';
    this.http.post(url, data, { headers: contentHeaders }).subscribe(
      response => {
        this.logger.info('Social Login success...');
        let res = response.json();
        this.logger.info('Response ...'); this.logger.info(res);
        localStorage.setItem('id_token', res.id_token);
        let decodedJwt = res.id_token && this.JwtHelper.decodeToken(res.id_token);
        localStorage.setItem('userId', decodedJwt.id);
        this.isLoggedIn = true;
        this.message = new InfoMessage("Success", "log...");
        this.authzn.init(); // initialize after user logged in
      },
      error => {
        this.isLoggedIn = false;
        // ToDo: Use a remote logging infrastructure later
        let errMsg: string;
        if (error instanceof Response) {
          errMsg = `${error.status} - ${error.statusText || ''}`;
        } else {
          errMsg = error.message ? error.message : error.toString();
        }
        this.message = new ErrorMessage("Failure", errMsg);
      });
    return Observable.of(this).delay(1000);
  }

  logoutFromApp(): void {  // for socially logged in user
    this.logger.info('Logged Out @auth.service...');
    this.isLoggedIn = false;
  }

  confirmSignup(code: String) {
    let url = environment.API_URL + '/api/signup/' + code;
    return this.http.put(url, { headers: contentHeaders });
  }

  forgotPassword(event: String, email: String): Observable<any> {
    let data = JSON.stringify({ email });
    let url = environment.API_URL + '/api/login/forgot-password';
    return this.http.post(url, data, { headers: contentHeaders });
  }

  resetPassword(token: string, password: string): Observable<any> {
    this.logger.info('Token: ' + token + ', Password: ' + password + ' are submitted...');
    let data = JSON.stringify({ token: token, resetpassword: password });
    let url = environment.API_URL + '/api/login/reset-password';
    return this.http.post(url, data, { headers: contentHeaders });
  }

}
