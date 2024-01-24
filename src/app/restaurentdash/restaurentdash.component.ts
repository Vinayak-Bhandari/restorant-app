import { Component, OnInit } from '@angular/core';
import { ApiService } from '../shared/api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RestaurentData } from './restaurent.interface.service';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-restaurentdash',
  templateUrl: './restaurentdash.component.html',
  styleUrls: ['./restaurentdash.component.css']
})
export class RestaurentdashComponent implements OnInit {
  userFilter: any = { name: '' };
  allRestaurentData: any;
  formValue!: FormGroup;
  page: number = 1;
  totalLength: any;
  restaurentModelObject: RestaurentData = { id: 1 };// = new RestaurentData;
  showadd!: boolean;
  showbtn!: boolean;
  filteredRestaurants: RestaurentData[] = [];


  constructor(private api: ApiService, private formbuilder: FormBuilder, private toast: NgToastService) { }

  ngOnInit(): void {
    this.formValue = this.formbuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      mobile: ['', Validators.required],
      address: ['', Validators.required],
      services: ['', Validators.required],
    })
    this.getAlldata();
  }

  getAlldata() {
    this.api.getAllRestaurent().subscribe((res: any) => {
      this.allRestaurentData = res;
      console.log(this.allRestaurentData)
    })
  }

  clickaddresto() {
    this.formValue.reset();
    this.showadd = true;
    this.showbtn = false; //update
  }

  //Add Records
  addResto() {
    this.restaurentModelObject.name = this.formValue.value.name;
    this.restaurentModelObject.email = this.formValue.value.email;
    this.restaurentModelObject.mobile = this.formValue.value.mobile;
    this.restaurentModelObject.address = this.formValue.value.address;
    this.restaurentModelObject.services = this.formValue.value.services;
    this.api.postRestaurent(this.restaurentModelObject).subscribe(res => {
      this.toast.success({ detail: 'Update Message', summary: 'Record Added Successfully', duration: 4000 })
      this.formValue.reset();
      this.getAlldata();
    }, error => {
      alert("Something went wrong!!")
    })
  }


  //Delete Records
  deleteResto(data: any) {
    this.restaurentModelObject.id = data.id;
    if (confirm('Are you sure want to delete records?'))
      this.api.deleteRestaurent(data.id).subscribe(res => {
        this.toast.info({ detail: 'Delete Notification', summary: 'Record Deleted successfully', duration: 4000 })
        this.getAlldata();
      })
  }


  //Edit record
  oneditResto(data: any) {
    // this.restaurentModelObject.id=data.id;
    this.showadd = false;
    this.showbtn = true;
    this.formValue.controls['services'].setValue(data.services);
    this.formValue.controls['address'].setValue(data.address);
    this.formValue.controls['email'].setValue(data.email);
    this.formValue.controls['mobile'].setValue(data.mobile);
    this.formValue.controls['name'].setValue(data.name);
  }

  //update records
  updateResto() {
    this.restaurentModelObject.name = this.formValue.value.name;
    this.restaurentModelObject.email = this.formValue.value.email;
    this.restaurentModelObject.mobile = this.formValue.value.mobile;
    this.restaurentModelObject.address = this.formValue.value.address;
    this.restaurentModelObject.services = this.formValue.value.services;

    this.api.updateRestaurent(this.restaurentModelObject, this.restaurentModelObject.id).subscribe(res => {
      // console.log(res)
      this.toast.success({ detail: 'Update Message', summary: 'Record Updated Successfully', duration: 4000 })
      this.formValue.reset()
      this.getAlldata();

    }, error => {
      alert("Something went wrong");
    })
  }

  //logout
  logout() {
    // Assuming 'keyToRemove' is the key you want to remove
    localStorage.removeItem('token');
    // localStorage.clear();
    this.toast.success({ detail: 'Update Message', summary: 'Logout Successfully', duration: 4000 })
  }

  filterRestaurants() {
    this.filteredRestaurants = this.allRestaurentData.filter((restaurant: any) =>
      restaurant.name.toLowerCase().includes(this.userFilter.name.toLowerCase())
    );
  }

}
