import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { OrdersService } from '../all-orders/orders.service';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-shipping-address',
  imports: [ReactiveFormsModule],
  templateUrl: './shipping-address.component.html',
  styleUrl: './shipping-address.component.scss'
})
export class ShippingAddressComponent {
  private ordersService =inject(OrdersService);
  private toastrService = inject(ToastrService)
  cartId !:string;
  private activatedRoute =inject(ActivatedRoute)
  shippingAddress :FormGroup = new FormGroup({
    details : new FormControl(null,[Validators.required,Validators.pattern(/^[A-Za-z0-9\s,.-]{5,100}$/
)]),
    phone : new FormControl(null,[Validators.required,Validators.pattern(/^(01)[0125][0-9]{8}$/)]),
    city : new FormControl(null,[Validators.required,Validators.pattern((/^[ء-يA-Za-z\s-]{2,50}$/))]),
  });
  checkout_order()
  {
    this.activatedRoute.paramMap.subscribe((cart_Id)=>{
      this.cartId =cart_Id.get('cart_Id')!
      if (this.shippingAddress.valid) {
        window.alert("vaild");
        if (this.cartId !=null) {
          this.ordersService.checkout(this.cartId,this.shippingAddress.value).subscribe({
            next:(res)=>{
              window.location.href = res.session.url;
            },
            error:(err)=>{
              console.log(err);
            }
          })
      }
      }
      else{
        this.toastrService.warning("Check your information details");
      }

    })
    // console.log(this.shippingAddress.value);
  }
}
