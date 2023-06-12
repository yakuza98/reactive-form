import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AsyncValidatorFn, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Frameworks, InputCases, Messages, MessagesAction} from "./core/constants/constants";
import {CaseType, IHobbies, IVersions} from "./core/interfaces/interfaces";
import {ApiService} from "./core/services/api.service";
import {environment} from "../environment/environment";
import {catchError, Observable} from "rxjs";
import { DatePipe } from '@angular/common';
import {setInputCase} from "./core/helpers/helpers";

const frameworkVersionControlName = 'frameworkVersion';
const hobbyControlName = 'hobby';
const formatDate = 'dd-MM-yyyy';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  titleLogo: string = 'https://s.dou.ua/CACHE/images/img/static/companies/photo_2020-11-23_13-26-01/c553997c93d85254a69536f02679798f.png'
  hobbies: IHobbies[] = []
  joinForm!: FormGroup;
  selectedFramework!: string;
  versionOne!: string[];
  pending: boolean = false;

  frameworks: string[] = [Frameworks.angular, Frameworks.react, Frameworks.vue];
  versions: IVersions = {
    angular: ['1.1.1', '1.2.1', '1.3.3'],
    react: ['2.1.2', '3.2.4', '4.3.1'],
    vue: ['3.3.1', '5.2.1', '5.1.3'],
  };

  inputCases = InputCases;

  @ViewChild('inputClearRef') inputClearRef!: ElementRef
  @ViewChild('inputClearRefDur') inputClearRefDur!: ElementRef

  constructor(
    private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    private apiService: ApiService,
    private datePipe: DatePipe
  ) {}


  ngOnInit() {
    this.initForm()
  }

  prepareSubmit(formValues: any) {

    return {
      ...formValues,
      dateOfBirth: this.datePipe.transform(this.joinForm.value.dateOfBirth, formatDate)
    };
  }

  onSubmit(): void {
    this.pending = true;

    this.apiService.post(environment.postJoinForm, this.prepareSubmit(this.joinForm.value)).pipe(
      catchError((err: any): Observable<any> | any => {
        this.openSnackBar(Messages.errorSnackBarMessage, MessagesAction.close);
        throw Messages.errorSnackBarMessage;
      })).subscribe(() => {
      this.openSnackBar(Messages.openSnackBarMessage, MessagesAction.close)
    });
    this.resetForm();
  }

  private resetForm(): void {
    this.joinForm.reset();
    this.inputClearRef.nativeElement.value = '';
    this.hobbies = [];
    Object.keys(this.joinForm.controls).forEach((control) => {
      this.joinForm.controls[control].setErrors(null);
    })
    // location.reload()
  }

  formControlError = (controlName: string, errorName: string) => {
    return this.joinForm.controls[controlName].hasError(errorName)
  }

  private initForm(): void {
    this.joinForm = this.formBuilder.group({
      firstName: this.setControl('', [Validators.required]),
      lastName: this.setControl('', [Validators.required]),
      dateOfBirth: this.setControl('', [Validators.required]),
      framework: this.setControl('', [Validators.required]),
      [frameworkVersionControlName]: this.setControl({value: '', disabled: true}, [Validators.required]),
      email: this.setControl('', [Validators.required, Validators.email], this.emailValidator),
      [hobbyControlName]: this.setControl([], [Validators.required, Validators.minLength(1)]),
    });
  }


  private setControl(value: string | {value: string, disabled: boolean} | number | [], validators: Validators, asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null) {
    return new FormControl(value, validators, asyncValidator)
  }

  onSelectFramework() {
    switch (this.selectedFramework) {
      case Frameworks.angular:
        this.versionOne = this.versions.angular;
        break;
      case Frameworks.react:
        this.versionOne = this.versions.react;
        break;
      case Frameworks.vue:
        this.versionOne = this.versions.vue;
    }

    // OR
    // this.versionOne = this.versions[this.selectedFramework];

    this.requiredVersionValidator()
  }

  removeKeyword(keyword: IHobbies): void {
    const index = this.hobbies.indexOf(keyword);
    if (index >= 0) {
      this.hobbies.splice(index, 1);
    }
  }

  add(): void {
    const value = this.inputClearRef.nativeElement.value.trim();

    if (value) {
      const valuePrompt = prompt(Messages.enterDurationMessage);
      if(valuePrompt) {
        this.hobbies.push({
          name: value,
          duration: valuePrompt
        });
      }

      this.joinForm.controls[hobbyControlName].setValue(this.hobbies);
      this.inputClearRef.nativeElement.value = '';
    }
  }

  private openSnackBar(message: string, action: string): void {
    this._snackBar.open(message, action, {
      horizontalPosition: 'end',
      verticalPosition: 'top',
      duration: 2000,
    });
  }

  private emailValidator: any = (control: FormControl) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const email = control.value;
        if (email === 'test@test.test') {
          resolve({emailExists: true});
        } else {
          resolve(null);
        }
      }, 2000);
    });
  }

  private requiredVersionValidator(): void {

    if (this.selectedFramework) {
      this.joinForm.controls[frameworkVersionControlName].enable();
      this.joinForm.controls[frameworkVersionControlName].setValidators(Validators.required);
    } else {
      this.joinForm.controls[frameworkVersionControlName].disable();
      this.joinForm.controls[frameworkVersionControlName].clearValidators();
    }
    this.joinForm.controls[frameworkVersionControlName].updateValueAndValidity();
  }

  changeInputCase(controlName: string, inputCase: CaseType) {
    const value = this.joinForm.controls[controlName].value;

    this.joinForm.controls[controlName].patchValue(setInputCase(inputCase, value))
  }
}




