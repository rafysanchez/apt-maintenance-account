import { Component, OnInit }				from '@angular/core';
import { Router, ActivatedRoute, Params }	from '@angular/router';

import 'rxjs/add/operator/switchMap';
import { Observable }						from 'rxjs/Observable';

import { Account }							from './model';
import { AccountService }					from './service';

var list_css = require('./list.component.css');
var list_css_string = list_css.toString();
var list_html = require('./list.component.html');
var list_html_string = list_html.toString();


@Component({
	selector: 'account-list',
	styles: [ list_css_string ],
	templateUrl: list_html_string
})
export class AccountListComponent implements OnInit {

	models: Observable<Account[]>;

	private selectedId: number;

	constructor(
		private service: AccountService,
		private route: ActivatedRoute,
		private router: Router
	) {}

	ngOnInit(): void {
		this.models = this.route.params
			.switchMap((params: Params) => {
				this.selectedId = +params['id'];
				return this.service.getList();
			});
	}

	onSelect(model: Account): void {
		this.router.navigate(['/accounts', model.id]);
	}

	isSelected(model: Account) {
		return model ? model.id === this.selectedId : false;
	}

	add(): void {
		this.router.navigate(['/accounts', 0]); // 0 represent new account
	}

	delete(model: Account): void {
		this.service
			.delete(model.id)
			.then( () => { // filter out the deleted account modelfrom account models
				this.models = this.models.filter( (models, i) => {
					return models[i] !== model; 
				});
			});
	}
}