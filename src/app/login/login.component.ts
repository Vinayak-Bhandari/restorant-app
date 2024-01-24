import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastComponent, NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  formValue!: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router, private toast: NgToastService) { }

  ngOnInit(): void {
    this.formValue = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  login() {
    this.http.get<any>("http://localhost:3000/signup").subscribe(res => {
      const user = res.find((a: any) => {
        return a.email === this.formValue.value.email && a.password === this.formValue.value.password
      })

      if (user) {
        alert("User Successfully Login");
        // this.toast.success({detail:'Success Message',summary:'User Successfully Login',duration:9000})
        this.formValue.reset();
        this.router.navigate(['restaurant']);
        localStorage.setItem('token', "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c")
        this.formValue.value.email ? localStorage.setItem('usertype', 'employee') : ''
      } else {
        alert("User Not Found with this credential");
        this.formValue.reset();
        // this.toast.error({detail:'Error Message',summary:'User Not Found with this credential',duration:8000})
      }
    }, error => {
      alert("Something Went Wrong!!")
      // this.toast.warning({detail:'Error Message',summary:'Something Went Wrong!!',duration:8000})
    })
  }
}
