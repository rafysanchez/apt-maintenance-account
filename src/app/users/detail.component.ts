import { Component, Input, OnInit } 				from '@angular/core';
import { Router, ActivatedRoute, Params } 	from '@angular/router';
import { Location }													from '@angular/common';
import 'rxjs/add/operator/switchMap';

import { User }															from './model';

import { UserService }											from './service';
import { Logger }		                        from '../logger/default-log.service';

@Component({
  selector: 'user-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class UserDetailComponent implements OnInit {
  @Input() model: User;
  editMode: boolean = true;
  modelName: string = 'User';
  title: string = this.editMode ? this.modelName + ' details' : 'Add ' + this.modelName;
  userId: string;

  constructor(
    private service: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private logger: Logger
  ) { }

  ngOnInit(): void {
    this.route.params
      .switchMap((params: Params) => this.service.getUserFor(+params['id']))
      .subscribe((model: User) => {
        this.model = model;
        if (model.id) this.editMode = true;
        else this.editMode = false;
        this.userId = this.editMode ? 'ID - ' + this.model.id : 'ID - 0';
      });
  }

  goBack(): void {
    this.location.back();
  }

  gotoList() {
    let modelId = this.model ? this.model.id : null;
    this.router.navigate(['/users', { id: modelId, foo: 'foo' }]);
  }

  save(): void {
    this.editMode ? this.update() : this.add();
  }

  private add(): void {
    this.logger.info('Adding new user...');
    this.service.create(this.model)
      .then((model) => {
        this.model = model;
        this.gotoList();
      });
  }

  private update(): void {
    this.service.update(this.model)
      .then(() => this.goBack());
  }

}
