import { Component } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

// validate
function equaValues(controlName1: string, controlName2: string) {
    return (control: AbstractControl) => {
        const val1 = control.get(controlName1)?.value;
        const val2 = control.get(controlName2)?.value;

        if (val1 === val2) {
            return null;
        }
        return { passwordNotEqual: true };
    };
}

@Component({
    selector: 'app-signup',
    standalone: true,
    templateUrl: './signup.component.html',
    styleUrl: './signup.component.css',
    imports: [ReactiveFormsModule],
})
export class SignupComponent {
    // tạo một form phản ứng
    form = new FormGroup({
        email: new FormControl('', {
            validators: [Validators.email, Validators.required],
        }),

        passwords: new FormGroup(
            {
                password: new FormControl('', {
                    validators: [Validators.required, Validators.minLength(6)],
                }),
                confirmPassword: new FormControl('', {
                    validators: [Validators.required, Validators.minLength(6)],
                }),
            },
            {
                validators: [equaValues('password', 'confirmPassword')],
            },
        ),

        userName: new FormGroup({
            firstName: new FormControl('', {
                validators: [Validators.required],
            }),
            lastName: new FormControl('', {
                validators: [Validators.required],
            }),
        }),

        address: new FormGroup({
            street: new FormControl('', {
                validators: [Validators.required],
            }),
            number: new FormControl('', {
                validators: [Validators.required],
            }),
            postalCode: new FormControl('', {
                validators: [Validators.required],
            }),
            city: new FormControl('', {
                validators: [Validators.required],
            }),
        }),

        role: new FormControl<'student' | 'teacher' | 'employee' | 'founder' | 'other'>('student', {
            validators: [Validators.required],
        }),
        source: new FormArray([new FormControl(false), new FormControl(false), new FormControl(false)]),
        agree: new FormControl(false, {
            validators: [Validators.required],
        }),
    });

    // xử lý khi ấn signup
    onSubmit() {
        if (this.form.invalid) {
            console.log('invalid form');
        }
        // console.log(this.form);
    }

    // xử lý khi ấn reset
    onReset() {
        this.form.reset();
    }
}
