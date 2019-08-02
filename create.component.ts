import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Validators, FormControl, FormGroup, FormArray } from '@angular/forms';
import { MessageService } from 'primeng/primeng';
import { EmployeesService } from '../employees.service';


@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CreateComponent implements OnInit {

  private registrationForm: FormGroup;
  private blockedPage: boolean = false;
  private isEmailChecked: boolean = false;

  esiChecked: boolean = false;
  disabled: boolean = true;

  designation: any[];
  department: any[];
  updatedregistrationForm: any[];

  constructor(private messageService: MessageService, private employeesService: EmployeesService) { }

  reset() {

  }

  ngOnInit() {
    this.reset();

    this.employeesService.getDesignation().subscribe(
      (data: any) => {
        this.designation = data;
        console.log('this.datasource ----- ' + JSON.stringify(this.designation));
      });

    this.employeesService.getDepartment().subscribe(
      (data: any) => {
        this.department = data;
        console.log('this.datasource ----- ' + JSON.stringify(this.department));
      });

    this.registrationForm = new FormGroup({
      employeeName: new FormControl(null, Validators.required),
      employeeCode: new FormControl(null, Validators.required),
      dateOfJoining: new FormControl(null),
      employeeEmail: new FormControl(null),
      employeePhone: new FormControl(null),
      designation: new FormControl(null, Validators.required),
      department: new FormControl(null, Validators.required),
      accountNo: new FormControl(null),
      grossSalaryAmount: new FormControl(null, Validators.required),
      pfAcNo: new FormControl(null),
      esiAcNo: new FormControl(null),
      designationMstId: new FormControl(),
      departmentMstId: new FormControl()
    });
  }

  onSubmit(registrationFormVal: any) {
    this.registrationForm.patchValue({ designationMstId: this.registrationForm.value.designation.id });
    this.registrationForm.patchValue({ departmentMstId: this.registrationForm.value.department.id });

    this.employeesService.createEmployee(this.registrationForm.value).subscribe(
      (data: any) => {
        console.log('data response....' + data);
        if (data = true) {
          console.log('toast working........');
          this.messageService.add({ key: 'tc', severity: 'info', summary: 'Message', detail: 'Employee details saved successfully.' });
        }
      }
    );
    console.log("data......." + JSON.stringify(this.registrationForm.value));
  }
}