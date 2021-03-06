import { Component, Input, OnInit } 				from '@angular/core';
import { Router, ActivatedRoute, Params } 	from '@angular/router';
import { Location }													from '@angular/common';
import 'rxjs/add/operator/switchMap';

import { User }															from './model';
import { Authorization }									  from '../authorization/model';

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
  hideSave: boolean = true;
  modelName: string = 'User';
  password: string = '';
  title: string = this.editMode ? this.modelName + ' details' : 'Add ' + this.modelName;
  userId: string;
  authzn: Authorization;
  canAdd: boolean = false;
  canEdit: boolean = false;
  residentTypeSelected: boolean = false;

  infos: any = {
    flatNumber: null,
    otherEmails: null,
    cellNumbers: null,
    twoWheelers: null,
    fourWheelers: null,
    emergencyContact: null,
    residentType: null
  };

  constructor(
    protected service: UserService,
    protected route: ActivatedRoute,
    protected router: Router,
    protected location: Location,
    protected logger: Logger
  ) { }

  ngOnInit(): void {
    this.route.params
      .switchMap((params: Params) => this.service.getUserFor(+params['id']))
      .subscribe((model: User) => {
        this.model = model;
        this.logger.info('user model...'); this.logger.info(model);
        if (model.id) {
          this.editMode = true;
          this.infos = this.infoObjFrom(model.infos);
          if (this.infos.residentType) this.residentTypeSelected = true;
        } else {
          this.editMode = false;
        }
        this.userId = this.editMode ? 'ID - ' + this.model.id : 'ID - 0';
        this.authzn = this.service.getAuthzn();
        this.canEdit = this.authzn.allowsEdit(model.id) && this.editMode;
        this.canAdd = this.authzn.allowsAdd() && !this.editMode;
        this.hideSave = !(this.canEdit || this.canAdd);
      });
  }
  protected infoObjFrom(infos: Array<any>) {
    let result = {};
    infos.forEach(each => {
      result[each.key] = each.value;
    });
    this.logger.info('infos now...'); this.logger.info(this.infos);
    return result;
  }
  goBack(): void {
    this.location.back();
  }

  cancel() {
    this.gotoList();
  }

  gotoList() {
    let modelId = this.model ? this.model.id : null;
    this.router.navigate(['/users', { id: modelId, foo: 'foo' }]);
  }

  save(): void {
    this.model.password = this.password;
    this.editMode ? this.update() : this.add();
  }

  protected add(): void {
    this.logger.info('Adding new user...');
    let infos = this.getInfos();
    if (infos.length > 0) this.model.infos = infos;
    this.service.create(this.model)
      .then((model) => {
        this.model = model;
        this.gotoList();
      })
      .catch((error: any) => {
        let jerror = error.json();
        this.logger.error(jerror.data.message);
        alert(jerror.data.message);
      });
  }

  /**
   * Converts Info object into a key-value array
   * @type {Array}
   */
  protected getInfos(): Array<any> {
    let result = [];
    let value;
    Object.keys(this.infos).forEach(key => {
      value = this.infos[key];
      if (value) result.push({ key: key, value: value });
    });
    console.log('infos...'); console.log(result);
    return result;
  }

  /**
   * Converts Info object into a key-value array
   * @type {Array}
   */
  protected getModifiedInfos(): Array<any> {
    let result = [];
    let infosDb = this.infoObjFrom(this.model.infos);
    let keysDb = Object.keys(infosDb);
    let infosUi = this.infos;
    let keysUi = Object.keys(infosUi);
    keysUi.forEach(key => {
      if (keysDb.includes(key)) { // key stored in earlier save
        if (infosUi[key] !== infosDb[key]) // if modified
          result.push({ key: key, value: infosUi[key] });
      } else {
        if (infosUi[key]) // if not null
          result.push({ key: key, value: infosUi[key] });
      }
    });
    console.log('modified infos...'); console.log(result);
    return result;
  }

  protected update(): void {
    this.logger.info('Updating user...');
    let infos = this.getModifiedInfos();
    if (infos.length > 0) this.model.infos = infos;
    console.log('model to be updated...'); console.log(this.model);
    this.service.update(this.model)
      .then(() => this.goBack())
      .catch((error: any) => {
        let jerror = error.json();
        this.logger.error(jerror.data.message);
        alert(jerror.data.message);
      });
  }

}
