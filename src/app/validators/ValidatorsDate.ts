import { ValidatorFn, AbstractControl} from '@angular/forms';


export class ValidatorsDate {

    static validatorsDate(control: AbstractControl){
        let fecha:string[];
        fecha=control.value.toString().split('-');
        console.log(2);
        if (Number(fecha[0]) <1920 || Number(fecha[0]) > Number((new Date()).getFullYear()) - 5 ) {
            return { fecha : false};
        }else{
           return null;
        }
    }
}