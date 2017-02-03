import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { User } from './model';
import { Role } from '../roles/model';

@Injectable()
export class UserService {

	public config: any = { server_ip_addr: "http://localhost:3002"};
	
	private modelUrl = this.config.server_ip_addr+'/api/users';
	private id_token = localStorage.getItem('id_token');
	private headers = new Headers({
		'Content-Type': 'application/json',
		'x-access-token': this.id_token
	});

	constructor(private http: Http) {}

	getList(): Promise<User[]> {
		return this.http.get(this.modelUrl, {headers: this.headers})
			.toPromise()
			.then(models => models.json() as User[])
			.catch(this.handleError)
	}

	getMe(id: number): Promise<User> {
		const url = this.modelUrl+'/'+id;
		return this.http.get(url, {headers: this.headers})
			.toPromise()
			.then(model => model.json() as User)
			.catch(this.handleError);
	}

	getMyRoles(id: number): Promise<Role[]> {
		const url = this.modelUrl+'/myroles/'+id;
console.log('Url : '+url);		
		return this.http.get(url, {headers: this.headers})
			.toPromise()
			.then(models => models.json() as Role[])
			.catch(this.handleError);
	}

	update(model: User): Promise<User> {
		const url = `${this.modelUrl}/${model.id}`;
		return this.http
			.put(url, JSON.stringify(model), {headers: this.headers})
			.toPromise()
			.then( () => model )
			.catch(this.handleError);
	}

	updateMyRoles(modelId: number, attachedIds: number[]): Promise<number> {
		const url=`${this.modelUrl}/myroles/${modelId}`;
		let data = { 'myrolesIds': attachedIds };
		return this.http
			.put(url, JSON.stringify(data), {headers: this.headers})
			.toPromise()
			.then( () => modelId )
			.catch(this.handleError);
	}

	create(model: User): Promise<User> {
		return this.http
			.post(this.modelUrl, JSON.stringify(model), {headers: this.headers})
			.toPromise()
			.then(model => model.json().data)
			.catch(this.handleError);
	}

	delete(id: number): Promise<void> {
		const url = `${this.modelUrl}/${id}`;
		return this.http.delete(url, {headers: this.headers})
			.toPromise()
			.then( () => null )
			.catch(this.handleError);
	}
	
	private handleError(error: any) {
		return Promise.reject(error.message || error);
	}

}