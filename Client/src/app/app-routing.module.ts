import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './guard/auth.guard';
import { FrontpageComponent } from './frontpage/frontpage.component';
const routes: Routes = [
  {path:'home',component:HomeComponent,canActivate : [AuthGuard]},
  {path:'register',component:RegisterComponent},
  {path:'login',component:LoginComponent},
  {path:'',component:FrontpageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
