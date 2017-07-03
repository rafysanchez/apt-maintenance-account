import { Component } 		from '@angular/core';
import { NgForm } 			from '@angular/forms';
import {
  Router,
  NavigationExtras,
  ActivatedRoute }      from '@angular/router';

import { Message }      from '../shared';
import { environment }  from '../../environments/environment';

import { Logger }		    from '../logger/default-log.service';
import { AuthService } 	from './auth.service';

declare const hello: any;

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styles: [`
		.login {
			width: 40%;
		};
    `
  ]
})
export class LoginComponent {
  email: String;
  message: Message = new Message();

  constructor(
    public authService: AuthService,
    public route: ActivatedRoute,
    public router: Router,
    public logger: Logger
  ) { }

  login(event: String, email: String, password: String) {
    let auth = this.authService;
    auth.login(event, email, password).subscribe(() => {
      this.redirect(auth);
    });
  }

  redirect(auth: AuthService) {
    if (auth.isLoggedIn) {
      // Get the redirect URL from our auth service
      // If no redirect is set, use the default
      let redirect = auth.redirectUrl ? auth.redirectUrl : '/home';

      // Set our navigation extras object
      // that passes on our global query params and fragment
      let navigationExtras: NavigationExtras = {
        queryParamsHandling: "merge", // "merge", "preserve", "default or /"
        preserveFragment: true
      };
      // Redirect the user
      this.router.navigate([redirect], navigationExtras);
    } else { // login failed
      this.message = auth.message;
    }
  }

  cancel() {
    this.router.navigate(['/home']);
  }

  signup() {
    this.router.navigate(['/signup']);
  }

  forgot() {
    this.router.navigate(['forgot'], { relativeTo: this.route });
  }

}
