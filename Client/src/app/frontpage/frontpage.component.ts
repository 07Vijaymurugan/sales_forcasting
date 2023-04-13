import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-frontpage',
  templateUrl: './frontpage.component.html',
  styleUrls: ['./frontpage.component.css']
})
export class FrontpageComponent {
  constructor(private toastr: ToastrService,private router:Router){}
  register(){
    this.router.navigate(['/register']);
  }
  login(){
    this.router.navigate(['/login']);
  }
}
