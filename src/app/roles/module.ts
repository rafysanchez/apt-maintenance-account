import { NgModule }							      from '@angular/core';
import { CommonModule }					      from '@angular/common';
import { FormsModule }					      from '@angular/forms';
import { MultiselectDropdownModule }  from 'angular-2-dropdown-multiselect';

import { RolesRoutingModule }		      from './routing.module';

import { RoleListComponent }          from './list.component';
import { RoleDetailComponent }        from './detail.component';

import { RoleService }					      from './service';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RolesRoutingModule,
    MultiselectDropdownModule
  ],
  declarations: [
    RoleListComponent,
    RoleDetailComponent
  ],
  providers: [
    RoleService
  ]
})
export class RolesModule { }
