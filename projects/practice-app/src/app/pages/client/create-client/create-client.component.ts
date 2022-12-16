import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogListComponent } from '../../../components/dialogs/dialog-list/dialog-list.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService, CustomersService } from 'core-services';
import { Customer, SelectedSubscription } from 'core-models';


@Component({
  selector: 'app-create-client',
  templateUrl: './create-client.component.html',
  styleUrls: ['./create-client.component.scss'],
})
export class CreateClientComponent implements OnInit {
  selectedSubscription!: SelectedSubscription | null;

  createClientForm = this._formBuilder.group({
    subscription: ['', Validators.required],
    intake_request: [null, Validators.required],
    type: ['P', Validators.required],
    document_type: ['I', Validators.required],
    document_no: ['ad cupidatat nu', Validators.required],
    company_name: ['Lawyer Inc', Validators.required],
    first_name: ['', Validators.required],
    last_name: ['', Validators.required],
  });

  constructor(
    public dialog: MatDialog,
    public _formBuilder: FormBuilder,
    private customerService: CustomersService,
    private authService: AuthService
  ) {}
  ngOnInit(): void {
    this.selectedSubscription = this.authService.getUserInfoFromLocalStorage();
  }
  openDialogList() {
    this.dialog.open(DialogListComponent);
  }

  createClient() {
    const createClient: Customer = {
      ...this.createClientForm.value,
      subscription: this.selectedSubscription?.ssid,
      contacts: [],
      addresses: [],
    };
    console.log(createClient);
     this.customerService.createCustomer(createClient).subscribe((data) => {
       console.log(data);
     });
  }
}
