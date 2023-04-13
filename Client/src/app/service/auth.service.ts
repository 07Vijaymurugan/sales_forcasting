import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User,RegisterResponse } from '../register/register.component';
import { LoginResponse } from '../login/login.component';
import { fileuploadresponse } from '../home/home.component';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http:HttpClient) { 

  }
  apiurl='http://localhost:5000';

  RegisterUser(user: User) {
    return this.http.post<RegisterResponse>(`${this.apiurl}/register`, user);
  }
  Login(username:String,password:String){
    return this.http.post<LoginResponse>(`${this.apiurl}/login` ,{username,password} )
  }
  GetUserbyCode(id:any){
    return this.http.get(this.apiurl+'/'+id);
  }
  Getall(){
    return this.http.get(this.apiurl);
  }
  updateuser(id:any,inputdata:any){
    return this.http.put(this.apiurl+'/'+id,inputdata);
  }
  isloggedin(){
    return sessionStorage.getItem('username')!=null;
  }
  getrole(){
    return sessionStorage.getItem('role')!=null?sessionStorage.getItem('role')?.toString():'';
  }
  GetAllCustomer(){
    return this.http.get('http://localhost:3000/customer');
  }
  Getaccessbyrole(role:any,menu:any){
    return this.http.get('http://localhost:3000/roleaccess?role='+role+'&menu='+menu)
  }
  uploadCSV(formData: FormData) {
    return this.http.post<fileuploadresponse>(`${this.apiurl}/upload`, formData);
  }
  forecast(data: FormData) {
    return this.http.post(this.apiurl, data);
  }
}