import { Injectable, Injector }       from '@angular/core';
import { Observable } 				        from 'rxjs/Observable';
import { Http, Headers, Response }    from '@angular/http';
import { JwtHelper } 				          from 'angular2-jwt';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';

import { Message, ErrorMessage,
  InfoMessage, WarningMessage }       from '../shared';

import { APP_CONFIG_TOKEN }           from '../app.component';

import { AuthorizationService }       from '../authorization/service';
import { Logger }		                  from '../logger/default-log.service';

const contentHeaders = new Headers();
contentHeaders.append('Accept', 'application/json');
contentHeaders.append('Content-Type', 'application/json');

@Injectable()
export class AuthService {

  isLoggedIn: boolean = false;
  loggedUser: string = ''; // Logged User Name or email
  isSocialLoggedIn: boolean = false;
  JwtHelper = new JwtHelper();
  message: Message;
  config: any;

  // store the URL so we can redirect after logging in
  redirectUrl: string;

  constructor(
    private http: Http,
    private logger: Logger,
    private authzn: AuthorizationService,
    private injector: Injector) {
    this.config = this.injector.get(APP_CONFIG_TOKEN);
  }

  login(event: String, email: String, password: String): Observable<object> {
    let data = JSON.stringify({ email, password });
    // let url = process.env.API_URL + '/api/login';
    // console.log('Process.env.API_URL: '); console.log(process.env.API_URL);

    let url = this.config.API_URL + '/api/login';

    this.http.post(url, data, { headers: contentHeaders }).subscribe(
      response => {
        this.logger.info('Logged In successfully...');
        let res = response.json();
        this.logger.info(res);
        localStorage.setItem('id_token', res.id_token);
        let decodedJwt = res.id_token && this.JwtHelper.decodeToken(res.id_token);
        this.logger.info('Decoded JWT...'); this.logger.info(decodedJwt);
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
    // TODO: To fix menu related problem, reset jwt to an empty string in
    // app component using parent child relationship
  }

  loginToAppUsing(network: String, socialToken: String): Observable<object> {
    let data = JSON.stringify({ network: network, socialToken: socialToken });
    // let url = process.env.API_URL + '/api/sociallogin';
    let url = this.config.API_URL + '/api/sociallogin';

    this.http.post(url, data, { headers: contentHeaders }).subscribe(
      response => {
        this.logger.info('Logged In successfully...');
        let res = response.json();
        this.logger.info('Response ...'); this.logger.info(res);
        localStorage.setItem('id_token', res.id_token);
        let decodedJwt = res.id_token && this.JwtHelper.decodeToken(res.id_token);
        localStorage.setItem('userId', decodedJwt.id);
        this.isLoggedIn = true;
        this.isSocialLoggedIn = true;
        this.message = new InfoMessage("Success", "log...");
      },
      error => {
        this.isLoggedIn = false;
        this.isSocialLoggedIn = false;

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
    this.isSocialLoggedIn = false;
  }

  confirmSignup(code: String) {
    // let url = process.env.API_URL + '/api/signup/' + code;
    let url = this.config.API_URL + '/api/signup/' + code;
    return this.http.put(url, { headers: contentHeaders });
  }

  forgotPassword(event: String, email: String): Observable<any> {
    let data = JSON.stringify({ email });
    // let url = process.env.API_URL + '/api/login/forgot-password';
    let url = this.config.API_URL + '/api/login/forgot-password';
    return this.http.post(url, data, { headers: contentHeaders });
  }

  resetPassword(token: string, password: string): Observable<any> {
    this.logger.info('Token: ' + token + ', Password: ' + password + ' are submitted...');
    let data = JSON.stringify({ token: token, resetpassword: password });
    // let url = process.env.API_URL + '/api/login/reset-password';
    let url = this.config.API_URL + '/api/login/reset-password';
    return this.http.post(url, data, { headers: contentHeaders });
  }
}
