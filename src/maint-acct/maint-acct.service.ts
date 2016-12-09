import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs';

import { MaintenanceAccount } from './maint-acct';

@Injectable()
export class MaintenanceAccountService {

	public config: any = { server_ip_addr: "http://localhost:3002"};

	constructor(private http: Http) {}

	getRecords() {
		console.log('Get the account records from: '+this.url());
		return this.http.get(this.url())
			.toPromise()
			.then(response => response.json().data as MaintenanceAccount[])
			.catch(this.handleError)
	}

	private handleError(error: any) {
		console.log('An error occured in Maint Acct Service...');
		console.log(error);
		return Promise.reject(error.message || error);
	}

	private apiUrl() {
		return this.config.server_ip_addr+'/api';
	}

	private url() {
		return this.apiUrl()+'/maintenance-accounts';
	}
}