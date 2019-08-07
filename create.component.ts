import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Validators, FormControl, FormGroup, AbstractControl, ValidationErrors } from '@angular/forms';
import { MessageService, SelectItem } from 'primeng/primeng';
import { EmployeesService } from '../employees.service';
import { throwError, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CreateComponent implements OnInit {
  private minDate: Date;
  private maxDate: Date;
  private year: string;

  private createEmployeeForm: FormGroup;

  private designationSelect: SelectItem[];
  private departmentSelect: SelectItem[];
  private workingShiftSelect: SelectItem[];

  constructor(private messageService: MessageService, private employeesService: EmployeesService, private router: Router) { }

  reset() {
    let today = new Date();
    this.year = today.getFullYear().toString();

    // NO USE AS OF NOW
    // let month = today.getMonth();
    // let prevMonth = (month === 0) ? 11 : month - 1;
    // this.minDate = new Date();
    // this.minDate.setMonth(prevMonth);

    this.maxDate = new Date();

    this.designationSelect = [{ label: "Select One", value: null }];
    this.departmentSelect = [{ label: "Select One", value: null }];
    this.workingShiftSelect = [
      { label: 'Select One', value: null },
      { label: 'Day Shift', value: 'D' },
      { label: 'Night Shift', value: 'N' }
    ];
  }

  ngOnInit() {
    this.reset();

    this.createEmployeeForm = new FormGroup({
      employeeName: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z].(([ -!][a-zA-Z-!])?[a-zA-Z]*)*$')]),
      employeeCode: new FormControl('', {
        validators: [
          Validators.required,
          Validators.pattern('[SWD]+ [0-9]*')
        ],
        asyncValidators: [this.employeeCodeValidator.bind(this)],
        updateOn: 'blur'
      }),
      dateOfJoining: new FormControl(null, Validators.required),
      employeeEmail: new FormControl('', Validators.email),
      employeePhone: new FormControl('', [Validators.minLength(10), Validators.maxLength(12), Validators.pattern('[1-9]+[0-9]*')]),
      designationMstId: new FormControl(null, Validators.required),
      departmentMstId: new FormControl(null, Validators.required),
      workingShift: new FormControl(null, Validators.required),
      leaveApplicableDateTime: new FormControl(null, Validators.required),
      accountNo: new FormControl('', {
        validators: [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(18),
          Validators.pattern('[0-9]*')
        ],
        asyncValidators: [this.accountNoValidator.bind(this)],
        updateOn: 'blur'
      }),
      grossSalaryAmount: new FormControl(null, [Validators.required, Validators.minLength(4), Validators.maxLength(6), Validators.pattern('[1-9]+[0-9]*')]),

      isPFApplicable: new FormControl(false, this.pfAcNoValidator.bind(this)),
      pfAcNo: new FormControl({ value: null, disabled: true }, {
        validators: [
          Validators.minLength(10),
          Validators.maxLength(12),
          Validators.pattern('[1-9]+[0-9]*')
        ],
        asyncValidators: [this.pfAcNoExistsValidator.bind(this)],
        updateOn: 'blur'
      }),

      isESIApplicable: new FormControl(false, this.esiAcNoValidator.bind(this)),
      esiAcNo: new FormControl({ value: null, disabled: true }, {
        validators: [
          Validators.minLength(10),
          Validators.maxLength(17),
          Validators.pattern('[1-9]+[0-9]*')
        ],
        asyncValidators: [this.esiAcNoExistsValidator.bind(this)],
        updateOn: 'blur'
      })
    });

    this.employeesService.getDesignations().subscribe(
      (data: any) => {
        if (data) {
          data.forEach(obj => {
            this.designationSelect.push({ label: obj.designationName, value: obj.id })
          });
        }
      },
      (error) => {
        return throwError(error);
      });

    this.employeesService.getDepartments().subscribe(
      (data: any) => {
        if (data) {
          data.forEach(obj => {
            this.departmentSelect.push({ label: obj.departmentName, value: obj.id })
          });
        }
      },
      (error) => {
        return throwError(error);
      });
  }

  onSubmit(createEmployeeFormVal: any) {
    this.employeesService.createEmployee(createEmployeeFormVal).subscribe(
      (data: any) => {
        if (data = true) {
          this.showMessage('success', true, false, 'success', 'Success', 'Employee saved successfully.');
        }
        else {
          this.showMessage('error', false, true, 'error', 'Error', 'Employee save unsuccessful.');
        }
      },
      (error) => {
        this.showMessage('error', false, true, 'error', 'Error', 'Employee save unsuccessful.');
        return throwError(error);
      }
    );
  }

  showMessage(messageKey: string, messageSticky: boolean, messageClosable: boolean, messageSeverity: string, messageSummary: string, messageDetail: string) {
    this.messageService.add({ key: messageKey, sticky: messageSticky, closable: messageClosable, severity: messageSeverity, summary: messageSummary, detail: messageDetail });
  }

  closeDialog() {
    this.reset();
    this.router.navigate(['/dashboard/employees/view-delete']);
  }

  /* ==================================================================================================================== */

  employeeCodeValidator(control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    return this.employeesService.checkEmployeeCode({ "employeeCode": control.value }).pipe(
      map(data => {
        return (data && data == true) ? { "employeeCodeExists": true } : null;
      })
    );
  }

  accountNoValidator(control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    return this.employeesService.checkAccountNo(control.value).pipe(
      map(data => {
        return (data && data == true) ? { "accountNoExists": true } : null;
      })
    );
  }

  pfAcNoValidator(control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    if (control.value === true) {
      this.createEmployeeForm.controls.pfAcNo.enable();
    } else {
      if (this.createEmployeeForm != undefined) {
        this.createEmployeeForm.controls.pfAcNo.reset();
        this.createEmployeeForm.controls.pfAcNo.disable();
      }
    }

    return null;
  }

  esiAcNoValidator(control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    if (control.value === true) {
      this.createEmployeeForm.controls.esiAcNo.enable();
    } else {
      if (this.createEmployeeForm != undefined) {
        this.createEmployeeForm.controls.esiAcNo.reset();
        this.createEmployeeForm.controls.esiAcNo.disable();
      }
    }

    return null;
  }

  pfAcNoExistsValidator(control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    return this.employeesService.checkPfAcNo(control.value).pipe(
      map(data => {
        console.log('data', data);
        return (data && data == true) ? { "pfAccountNoExists": true } : null;
      })
    );
  }

  esiAcNoExistsValidator(control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    return this.employeesService.checkEsiAcNo(control.value).pipe(
      map(data => {
        return (data && data == true) ? { "esiAccountNoExists": true } : null;
      })
    );
  }
}