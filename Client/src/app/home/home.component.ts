import { Component } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormControl } from '@angular/forms';
import * as FileSaver from 'file-saver';
import * as Papa from 'papaparse';

interface Attribute {
  value: string;
  viewValue: string;
}

 export interface fileuploadresponse {
  success: boolean;
  message: string;
  csv: string;
}


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  username:any;
  selectedFile: File |null = null;
  formcontrol=new FormControl(null);
  periodcontrol=new FormControl(0);
  csvData:any;
  resultcsv: fileuploadresponse | undefined;
  constructor(private service: AuthService, private toastr: ToastrService, private router: Router,private forecastService: AuthService) { 
    this.username=sessionStorage.getItem('user_id');
    localStorage.setItem('isloggedin',localStorage.getItem('user_id')!)
  }
  Attributes: Attribute[] = [
    {value: '1', viewValue: 'Sony'},
    {value: '2', viewValue: 'LG'},
    {value: '3', viewValue: 'Samsung'},
    {value: '4', viewValue: 'Panasonic'},
  ];

  onFileSelected(event :any): void {
    this.selectedFile = event.target.files[0];
  }
  logout() {
    // Perform any logout actions here
    this.toastr.success('Logout Successful');
    this.router.navigate(['/login']);
  }

  onSubmit(selectedProduct: string): void {
    const formData = new FormData();
    formData.append('file', this.selectedFile as File);
    formData.append('user_id', localStorage.getItem('user_id')!);
    formData.append('product', selectedProduct);
    formData.append('interval', this.formcontrol.value!);
    formData.append('period', this.periodcontrol.value!.toString());
    console.log(Response)
    this.service.uploadCSV(formData).subscribe(
      (response:fileuploadresponse) => {
        const success = response.success;
        const message = response.message;
        if (success) {
          this.csvData = response.csv;
          console.log(response.csv);
          // this.resultcsv = response;
          // console.log(this.resultcsv);
          this.toastr.success(`${message}`);
          this.router.navigate(['home'], { state: { message } }); // Pass the name to the Home component
        }
        else{
          this.toastr.error(response.message);
        }
      },
      (error) => {
        console.error(error);
        this.toastr.warning("enter valid data!!");
      }
   );}
   downloadcsv(){
    const parsedData = Papa.parse(this.csvData).data;
    const resultcsv = Papa.unparse(parsedData);
    const blob = new Blob([resultcsv], { type: 'text/csv;charset=utf-8;' });
    FileSaver.saveAs(blob, 'result.csv');
    this.toastr.success("File downloaded successfully")
   }  
}
