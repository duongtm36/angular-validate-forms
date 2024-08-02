import { debounceTime } from 'rxjs';
import { FormsModule, NgForm } from '@angular/forms';
import { afterNextRender, Component, DestroyRef, inject, viewChild } from '@angular/core';

@Component({
    selector: 'app-login',
    standalone: true,
    templateUrl: './login.component.html',
    styleUrl: './login.component.css',
    imports: [FormsModule],
})
export class LoginComponent {
    private form = viewChild.required<NgForm>('form');
    private destroyRef = inject(DestroyRef);
    constructor() {
        afterNextRender(() => {
            const savedForm = window.localStorage.getItem('saved-login-form');
            if (savedForm) {
                const loadedFormData = JSON.parse(savedForm);
                const savedEmail = loadedFormData.email;
                setTimeout(() => {
                    this.form().controls['email'].setValue(savedEmail);
                }, 1);
            }
            const subscription = this.form()
                .valueChanges?.pipe(debounceTime(500))
                .subscribe({
                    next: (value) =>
                        window.localStorage.setItem('saved-login-form', JSON.stringify({ email: value.email })),
                });

            this.destroyRef.onDestroy(() => subscription?.unsubscribe());
        });
    }

    onSubmit(formData: NgForm) {
        if (formData.form.invalid) {
            return;
        }
        const dataLogin = formData.form.value;
        const enteredEmail = dataLogin.email;
        const enteredPassword = dataLogin.password;
        // console.log('form: ', formData);
        console.log('email: ', enteredEmail);
        console.log('password: ', enteredPassword);

        formData.form.reset();
    }
}
