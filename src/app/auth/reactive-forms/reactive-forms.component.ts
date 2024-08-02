import { debounceTime, of } from 'rxjs';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

// validate:
function mustContainQuestionMark(control: AbstractControl) {
    //kiểm tra nếu control có ? thì trả về null(không lỗi)
    if (control.value.includes('?')) {
        return null;
    }

    //không có ? thì trả về một đối tượng lỗi doesNotContainQuestionMark
    return { doesNotContainQuestionMark: true };
}

// kiểm tra tính duy nhất của email
function emailIsUnique(control: AbstractControl) {
    // kiểm tra giá trị email nhập vào (control.value)
    // khác với email mẫu trả về null (không lỗi)
    if (control.value !== 'test@example.com') {
        return of(null);
    }
    // trả về đối tượng lỗi notUnique
    return of({ notUnique: true });
}

// tạo giá trị email ban đầu là ''
let initialEmailValue = '';

// gán giá trị lấy từ local cho savedForm
const savedForm = window.localStorage.getItem('saved-login-form');

// nếu savedForm tồn tại, gán giá trị email cho initialEmailValue
if (savedForm) {
    const loadedForm = JSON.parse(savedForm);
    initialEmailValue = loadedForm.email;
}

@Component({
    selector: 'app-reactive-forms',
    standalone: true,
    templateUrl: './reactive-forms.component.html',
    styleUrl: './reactive-forms.component.css',
    imports: [ReactiveFormsModule],
})
export class ReactiveFormsComponent implements OnInit {
    // tiêm DestroyRef service để xử lý khi component bị hủy
    private destroyRef = inject(DestroyRef);

    // định nghĩa một form phản ứng với 2 control là email và password
    form = new FormGroup({
        // gán giá trị email ban đầu là initialEmailValue và định nghĩa validate
        email: new FormControl(initialEmailValue, {
            validators: [Validators.email, Validators.required],

            asyncValidators: [emailIsUnique],
        }),

        // gán giá trị ban đầu cho password là '' và định nghĩa valiadte
        password: new FormControl('', {
            validators: [Validators.minLength(6), Validators.required, mustContainQuestionMark],
        }),
    });

    // thuộc tính getter kiểm tra email và password
    // touched: kiểm tra trường này đã được người dùng tương tác hay chưa
    // dirty: kiểm tra trường này đã có sự thay đổi chưa
    // invalid: kiểm tra trường này đã khớp với yêu cầu của validate chưa
    get emailIsInvalid() {
        return this.form.controls.email.touched && this.form.controls.email.dirty && this.form.controls.email.invalid;
    }

    get passwordIsInvalid() {
        return (
            this.form.controls.password.touched &&
            this.form.controls.password.dirty &&
            this.form.controls.password.invalid
        );
    }

    ngOnInit() {
        // lắng nghe sự thay đổi của form khi người dùng nhập và lưu vào local sau khoảng debounceTime 500s(giảm tần suất cập nhật)
        const subscription = this.form.valueChanges.pipe(debounceTime(500)).subscribe({
            next: (value) => {
                window.localStorage.setItem('saved-login-form', JSON.stringify({ email: value.email }));
            },
        });
        //hủy đăng ký khi component bị hủy
        this.destroyRef.onDestroy(() => subscription.unsubscribe());
    }

    // xử lý khi click vào nút login
    onSubmit() {
        console.log('form: ', this.form);
        const formValue = this.form.value;
        console.log(formValue.email, formValue.password);
    }
}
