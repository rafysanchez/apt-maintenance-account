import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';

import { Http, Headers, Response } from '@angular/http';

const contentHeaders = new Headers();
contentHeaders.append('Accept', 'application/json');
contentHeaders.append('Content-Type', 'application/json');

@Injectable()
export class AuthService {
	
	isLoggedIn: boolean = false;

	// store the URL so we can redirect after logging in
	redirectUrl: string;

	constructor(private http: Http) {}

//	login(): Observable<boolean> {
//		return Observable.of(true).delay(1000).do(val => this.isLoggedIn = true);
//	}

	login( event: String, email: String, password: String ): Observable<boolean> {
		let data = JSON.stringify({ email, password });
		let url = 'http://localhost:3002/api/sessions/create';
console.log('auth.service >> login(...)');
		this.http.post(url, data, {headers: contentHeaders})
			.subscribe(
				response => { 
console.log('Inside Response function...');					
					localStorage.setItem('id_token', response.json().id_token);
					this.isLoggedIn = true;
				},
				error => { 
console.log('Inside error function...');					
					this.isLoggedIn = false;

					// ToDo: Use a remote logging infrastructure later
					let errMsg: string;
					if(error instanceof Response) {
						const body = error.json() || '';
						const err = body.error || JSON.stringify(body);
						errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
					} else {
						errMsg = error.message ? error.message : error.toString();
					}
					console.error(errMsg);
				}
			);
		return Observable.of(this.isLoggedIn).delay(1000);

/*		let data = JSON.stringify({ email, password });
		let url = 'http://localhost:3002/api/sessions/create';
console.log('auth.service >> login(...)');
		return this.http.post(url, data, {headers: contentHeaders})
						.map(this.extractData)
						.catch(this.handleError); */
/*		this.http.post(url, data, {headers: contentHeaders})						
			.subscribe(
				response => {
					localStorage.setItem('id_token', response.json().id_token);
					//this.router.navigate(['/home']);
					return Observable.of(true).delay(1000).do(val => this.isLoggedIn = true);
				},
				error => {
					alert( error.text() );
					console.log( error.text() );
					return Observable.of(true).delay(1000).do(val => this.isLoggedIn = false);
				}
			); */
	}

	private extractData(res: Response) {
console.log('auth.service >> extractData(...)');
		let body = res.json();
		localStorage.setItem('id_token', body.id_token);
		this.isLoggedIn = true;
		//return Observable.of(true).delay(1000).do(val => this.isLoggedIn = true);
	}

	private handleError(error: Response | any) {
		// ToDo: Use a remote logging infrastructure later
		let errMsg: string;
		if(error instanceof Response) {
			const body = error.json() || '';
			const err = body.error || JSON.stringify(body);
			errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
		} else {
			errMsg = error.message ? error.message : error.toString();
		}
		console.error(errMsg);
		return Observable.throw(errMsg);
	}

	logout(): void {
		this.isLoggedIn = false;
	}

}