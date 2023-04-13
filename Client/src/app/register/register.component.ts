import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { ToastrService } from 'ngx-toastr'

export interface User {
  id: string | null | undefined;
  name: string | null | undefined;
  password: string | null | undefined;
  email: string | null | undefined;
  gender: string | null | undefined;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  constructor(private builder: FormBuilder, private service: AuthService, private router: Router,
    private toastr: ToastrService) {

  }

  registerForm = this.builder.group({
    id: this.builder.control('', Validators.compose([Validators.required, Validators.minLength(5)])),
    name: this.builder.control('', Validators.required),
    password: this.builder.control('', Validators.compose([Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')])),
    email: this.builder.control('', Validators.compose([Validators.required, Validators.email])),
    gender: this.builder.control('male'),
   });
  proceedRegister() {
    if (this.registerForm.valid) {
      const user: User = {
        id: this.registerForm.value.id,
        name: this.registerForm.value.name,
        password: this.registerForm.value.password,
        email: this.registerForm.value.email,
        gender: this.registerForm.value.gender,
            };
  
      this.service.RegisterUser(user).subscribe(
        (result) => {
          result = result as RegisterResponse;
          const success = result.success;
          const message = result.message;
          if (success) {
            this.toastr.success(message);
            this.router.navigate(['login']);
          } else {
            this.toastr.warning(message);
          }
        },
        (error) => {
          console.error(error);
          this.toastr.warning(error.message);
        }

      );
      

    } else {
      this.toastr.warning('Please Enter Valid data !!')
    }
  }
  register() {
    // Perform any logout actions here
    this.toastr.success('login to your account');
    this.router.navigate(['/login']);
    localStorage.removeItem('preventForwardNavigation');
  }
}