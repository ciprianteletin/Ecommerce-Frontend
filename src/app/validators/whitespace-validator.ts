import {FormControl, ValidationErrors} from '@angular/forms';

export class WhitespaceValidator {
  static notOnlyWhitespace(control: FormControl): ValidationErrors | null {

    if (control.value != null && control.value.trim().length <= 1) {
      return {notOnlyWhitespace: true};
    }
    return null;
  }
}
