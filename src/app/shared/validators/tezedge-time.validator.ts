import { FormControl } from '@angular/forms';
import * as moment from 'moment-mini-ts';

export class TezedgeTimeValidator {

  static isDate(control: FormControl): { [key: string]: any } {
    const pattern = /^02\/(?:[01]\d|2\d)\/(?:19|20)(?:0[048]|[13579][26]|[2468][048])|(?:0[13578]|10|12)\/(?:[0-2]\d|3[01])\/(?:19|20)\d{2}|(?:0[469]|11)\/(?:[0-2]\d|30)\/(?:19|20)\d{2}|02\/(?:[0-1]\d|2[0-8])\/(?:19|20)\d{2}$/;

    if (!moment(control.value).format('MM/DD/YYYY').match(pattern)) {
      return { invalidDate: true };
    }
    return null;
  }

  static isHour(control: FormControl): { [key: string]: any } {
    const pattern =  /^([0-9]|0[0-9]|1[0-9]|2[0-3])$/;

    if (!control.value.toString().match(pattern)) {
      return { invalidHour: true };
    }
    return null;
  }

}
