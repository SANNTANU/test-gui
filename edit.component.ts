import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Router, ActivatedRoute } from '@angular/router';
import { EmployeesService } from '../../employees.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  display: boolean = true;

  private editEmployeeForm: FormGroup;

  employeeId: string;
  employeeCode: string;
  employeeName: string;
  employeeEmail: string;
  selectedDesignationName: string;
  selectedDepartmentId: any;
  accountNo: string;
  grossSalaryAmount: string;
  pfAcNo: string;
  esiAcNo: string;
  editFormData1: any;
  designation: any[];
  department: any[];
  departmentDetails: any[];

  constructor(private messageService: MessageService, private router: Router, private activatedRoute: ActivatedRoute, private employeesService: EmployeesService) { }

  ngOnInit() {
    this.employeesService.getDesignation().subscribe(
      (data: any) => {
        this.designation = data;
        console.log('this.datasource ----- ' + JSON.stringify(this.designation));
      });

    this.activatedRoute.paramMap.subscribe(params => {
      this.employeeId = params.get("employeeId");
    })

    this.employeesService.getCreatedEmployeesById(this.employeeId).subscribe(
      (data: any) => {
        console.log('data.......' + JSON.stringify(data));
        this.employeeCode = data[0].employeeCode;
        this.employeeName = data[0].employeeName;
        this.employeeEmail = data[0].employeeEmail;
        this.selectedDepartmentId = data[0].departmentMstId;
        this.selectedDesignationName = data[0].designationName;
        this.accountNo = data[0].accountNo;
        this.grossSalaryAmount = data[0].grossSalaryAmount;
        this.pfAcNo = data[0].pfAcNo;
        this.esiAcNo = data[0].esiAcNo;
        console.log("designation....." + (this.selectedDepartmentId));
      }
    );

    this.employeesService.getDepartment().subscribe(
      (data: any) => {
        this.department = data;
        data.forEach(function (value, i) {
        });
      });

    this.editEmployeeForm = new FormGroup({
      employeeCode: new FormControl(),
      employeeName: new FormControl(),
      employeePhone: new FormControl(),
      employeeEmail: new FormControl(),
      designationName: new FormControl(),
      departmentName: new FormControl(),
      accountNo: new FormControl(),
      grossSalaryAmount: new FormControl(),
      pfAcNo: new FormControl(),
      esiAcNo: new FormControl()
    });    
  }

  showTopCenter() {
    this.messageService.add({ key: 'tc', severity: 'info', summary: 'Message', detail: 'The Password has been changed successfully' });
  }

  closePopup() {
    this.router.navigate(['dashboard', 'employees', 'view-delete']);
  }

  redirect() {
    this.router.navigate(['dashboard', 'employees', 'view-delete']);
  }
}