import { Pipe, PipeTransform } from '@angular/core';
import {setInputCase} from "../helpers/helpers";
import {InputCases} from "../constants/constants";

@Pipe({
  name: 'letterCase'
})
export class LetterCasePipe implements PipeTransform {

  transform(value: string, inputCase: InputCases): string {
    return setInputCase(inputCase, value)
  }
}
