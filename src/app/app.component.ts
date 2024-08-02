import { Component } from '@angular/core';

import { LoginComponent } from './auth/login/login.component';
import { ReactiveFormsComponent } from './auth/reactive-forms/reactive-forms.component';
import { SignupComponent } from './auth/signup/signup.component';

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    imports: [LoginComponent, ReactiveFormsComponent, SignupComponent],
})
export class AppComponent {}
