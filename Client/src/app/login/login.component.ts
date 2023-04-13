import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr'
import { HomeComponent } from '../home/home.component';
import { AuthService } from '../service/auth.service';

export interface LoginResponse {
  success: boolean;
  message: string;
}
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor(private builder: FormBuilder, private toastr: ToastrService, private service: AuthService,
    private router: Router) {
      localStorage.setItem('isloggedin','Null')
      sessionStorage.clear();

  }
  result: any;

  loginForm = this.builder.group({
    username: this.builder.control('', Validators.required),
    password: this.builder.control('', Validators.required)
  });

 register() {
    // Perform any logout actions here
    this.toastr.success('Sign up your details');
    this.router.navigate(['/register']);
    localStorage.removeItem('preventForwardNavigation');
  }

  proceedLogin() {
    if (this.loginForm.valid) {
      this.service.Login(this.loginForm.value.username!, this.loginForm.value.password!)
  .subscribe(
    (result) => {
      result = result as LoginResponse;
      const success = result.success;
      const message = result.message;
      if (success) {
        sessionStorage.setItem('user_id',this.loginForm.value.username!)
        localStorage.setItem('isloggedin','HomeComponent')
        this.toastr.success(`Welcome ${message}`);

        this.router.navigate(['home'], { state: { message } }); // Pass the name to the Home component
      } else {
        this.toastr.warning(message);
      }
    },
    (error) => {
      console.error(error);
      this.toastr.warning("Enter Valid Data!!");
    }
  );


    } else {
      this.toastr.warning('Please Enter Valid data !!')
    }
  }
}


