import {InputCases} from "../constants/constants";
import {CaseType} from "../interfaces/interfaces";

export function setInputCase(caseType: CaseType, value: string): string {
  switch (caseType) {
    case InputCases.first:
      return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
    case InputCases.lower:
      return value.toLowerCase();
    case InputCases.upper:
      return value.toUpperCase();
  }

  return value;
}
