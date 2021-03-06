import { Component, Input, OnInit } 				from '@angular/core';
import { Router, ActivatedRoute, Params } 	from '@angular/router';
import { Location }													from '@angular/common';
import 'rxjs/add/operator/switchMap';

import { Permission }												from './model';
import { Authorization }										from '../authorization/model';

import { MODULE }                           from '../shared/constants';

import { PermissionService }								from './service';
import { Logger }                           from '../logger/default-log.service';

@Component({
  selector: 'permission-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css'],
})
export class PermissionDetailComponent implements OnInit {
  @Input() model: Permission;
  modelName: string = 'Permission';
  authzn: Authorization;
  editMode: boolean = true;
  addAllowed: boolean = false;
  editAllowed: boolean = false;
  title: string;
  recordId: string;
  moduleKeys: string[] = Object.keys(MODULE);
  resources: string[] = this.moduleKeys.map( // collect MODULE values
    (key: string) => MODULE[key].name
  );

  // CRUD Operations
  canCreate: boolean;
  canRead: boolean;
  canUpdate: boolean;
  canDelete: boolean;

  constructor(
    private service: PermissionService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private logger: Logger
  ) { }

  ngOnInit(): void {
    let self = this;
    this.authzn = this.service.getAuthzn();
    this.route.params
      .switchMap(toGetModel)
      .subscribe(toSetModel);

    function toGetModel(params: Params): Promise<Permission> {
      return self.service.get(+params['id']);
    }
    function toSetModel(model: Permission): void {
      self.model = model;
      self.editMode = model.id > 0;
      self.editMode ? self.editSettings() : self.addSettings();
    }
  }

  private editSettings() {
    this.recordId = 'ID - ' + this.model.id;
    this.editAllowed = this.authzn.allowsEdit();
    this.title = this.editAllowed ? 'Edit ' : '';
    this.title += this.modelName + ' Details';
    this.crudSettings(); // apply CRUD data of the model
  }

  private addSettings() {
    this.title = 'Add a new ' + this.modelName;
    this.recordId = 'ID - 0';
    this.addAllowed = this.authzn.allowsAdd();
  }

  private crudSettings() {
    this.canCreate = this.model.operations.includes('C');
    this.canRead = this.model.operations.includes('R');
    this.canUpdate = this.model.operations.includes('U');
    this.canDelete = this.model.operations.includes('D');
  }

  private crudString() {
    let result = '';
    result += this.canCreate ? 'C' : '';
    result += this.canRead ? 'R' : '';
    result += this.canUpdate ? 'U' : '';
    result += this.canDelete ? 'D' : '';
    return result;
  }

  goBack(): void {
    this.location.back();
  }

  gotoList() {
    let anId = this.model ? this.model.id : null;
    this.router.navigate(['/permissions', { id: anId, foo: 'foo' }]);
  }

  save(): void {
    this.editMode ? this.update() : this.add();
  }

  private add(): void {
    this.model.operations = this.crudString();
    this.logger.info('New Permission to be saved...'); this.logger.info(this.model);
    this.service.create(this.model)
      .then((model: Permission) => {
        this.model = model;
        this.gotoList();
      })
      .catch((error: any) => {
        let jerror = error.json();
        this.logger.error('Permission module > detail component...add()' + jerror.data.message);
        alert(jerror.data.message);
      });
  }

  private update(): void {
    this.model.operations = this.crudString();
    this.service.update(this.model)
      .then(() => this.goBack())
      .catch((error: any) => {
        let jerror = error.json();
        this.logger.error('Permission module > detail component...update()' + jerror.data.message);
        alert(jerror.data.message);
      });
  }

}
