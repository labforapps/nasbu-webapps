import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogListComponent } from '../../../components/dialogs/dialog-list/dialog-list.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService, CustomersService,CommonService } from 'core-services';
import { Customer, SelectedSubscription,Country } from 'core-models';

@Component({
  selector: 'app-create-client',
  templateUrl: './create-client.component.html',
  styleUrls: ['./create-client.component.scss'],
})
export class CreateClientComponent implements OnInit {
  //selectedSubscription!: SelectedSubscription | null;
  selectedSubscription!: any;
  customer_type: string = 'P';
  countries!:Country[];

  createClientForm = this._formBuilder.group({
    subscription: ['', Validators.required],
    intake_request: [null, Validators.required],
    type: [this.customer_type, Validators.required],
    document_type: ['I', Validators.required],
    document_no: ['ad cupidatat nu', Validators.required],
    company_name: [''],
    first_name: [''],
    last_name: [''],
  });

  constructor(
    public dialog: MatDialog,
    public _formBuilder: FormBuilder,
    private customerService: CustomersService,
    private commonService:CommonService,
    private authService: AuthService
  ) {}
  ngOnInit(): void {
    this.selectedSubscription = this.authService.getUserInfoFromLocalStorage();

    this.fetchCountries();
  }
  openDialogList() {
    this.dialog.open(DialogListComponent);
  }

  setCustomerType(value: string) {
    this.customer_type = value;

    this.createClientForm.patchValue({
      type: value,
    });
  }

  fetchCountries()
  {
    this.commonService.getCountries().subscribe((data) => {
      this.countries = data;
    });
  }

  createClient() {
    const createClient: Customer = {
      ...this.createClientForm.value,
      subscription: this.selectedSubscription?.ssid.uuid,
      contacts: [],
      addresses: [],
    };
    console.log(createClient);
    this.customerService.createCustomer(createClient).subscribe((data) => {
      console.log(data);
    });
  }
}
