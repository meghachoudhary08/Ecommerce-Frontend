import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { Luv2ShopFormService } from 'src/app/services/luv2-shop-form.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  totalPrice: number=0;
  totalQuantity: number=0;

  creditCardYears: number[]=[];
  creditCardMonths: number[]=[];

  countries: Country[]=[];
  shippingAddressStates: State[]=[];
  billingAddressStates: State[]=[];

  checkoutFormGroup: FormGroup|any;
  constructor(private formBuilder: FormBuilder,
              private luv2ShopFormService: Luv2ShopFormService) { }

  ngOnInit(): void {
    this.checkoutFormGroup=this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: [''],
        lastName: [''],
        email: ['']
      }),
      shippingAddress: this.formBuilder.group({
        country:[''],
        street:[''],
        city:[''],
        state:[''],
        zipcode:['']
      }),
      billingAddress: this.formBuilder.group({
        country:[''],
        street:[''],
        city:[''],
        state:[''],
        zipcode:['']
      }),
      creditCard: this.formBuilder.group({
        cardType:[''],
        nameOnCard:[''],
        cardNumber:[''],
        securityCode:[''],
        expirationMonth:[''],
        expirationYear:['']
      })
    });
    //populate credit card months
     const startMonth: number=new Date().getMonth()+1;
     console.log("startMonth" + startMonth);

     this.luv2ShopFormService.getCreditCardMonths(startMonth).subscribe(
      data=>{
        console.log("Retrieved credit card months:"+ JSON.stringify(data));
        this.creditCardMonths = data;
      }
     );

    //populate credit card years
    this.luv2ShopFormService.getCreditCardYears().subscribe(
      data=>{
        console.log("Retrieved credit card years:" + JSON.stringify(data));
        this.creditCardYears = data;
      }
    );

    //populate Countries
    this.luv2ShopFormService.getCountries().subscribe(
      data => {
        console.log("Retrieve countries:"+ JSON.stringify(data));
        this.countries = data;
      }
    )
  }
 onSubmit(){
  console.log("Handling the submit button");
  console.log(this.checkoutFormGroup.get('customer').value);
  console.log("The email address is" + this.checkoutFormGroup.get('customer').value.email);
  console.log("The shipping address country is" + this.checkoutFormGroup.get('shippingAddress').value.country.name);
  console.log("The shipping address state is" + this.checkoutFormGroup.get('shippingAddress').value.state.name);


 }



 copyShippingAddressToBillingAddress(event: any){
 if (event.target.checked){
  this.checkoutFormGroup.controls.billingAddress
  .setValue(this.checkoutFormGroup.controls.shippingAddress.value);
 }else{
  this.checkoutFormGroup.controls.billingAddress.reset();
 }
 }

 handleMonthsAndYears(){
  const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');
  const currentYear: number = new Date().getFullYear();
  const selectedYear: number = Number(creditCardFormGroup.value.expirationYear);

  //if the current year equals the selected year, then start with the current month

  let startMonth: number;

  if(currentYear === selectedYear){
    startMonth = new Date().getMonth()+1;
  }else{
    startMonth = 1;
  }

  this.luv2ShopFormService.getCreditCardMonths(startMonth).subscribe(
    data => {
      console.log("Retrieved credit card months: " + JSON.stringify(data));
      this.creditCardMonths = data;
    }
  );
  }

  getStates(formGroupName: string){
    const formGroup = this.checkoutFormGroup.get(formGroupName);
    const countryCode = formGroup.value.country.code;
    const countryName = formGroup.value.country.name;

    console.log(`${formGroupName} country code: ${countryCode}`);
    console.log(`${formGroupName} country name: ${countryName}`);

    this.luv2ShopFormService.getStates(countryCode).subscribe(
      data => {
        if(formGroupName === 'shippingAddress'){
          this.shippingAddressStates = data;
        }else{
          this.billingAddressStates = data;
        }

        // select first item by default
        formGroup.get('state').setValue(data[0]);
      }
    );
  }
 }

