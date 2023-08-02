import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Customer, SecurityUser, TypeCustomer } from 'core-models';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class HelpersService {

  typeCustomer = TypeCustomer;

  constructor(private translateService:TranslateService,
              private toastr: ToastrService) { }

  returnCustomerListSorted(customers:Customer[]):Customer[] {

      return customers.sort((a, b) => {
        const companyNameA = a.company_name || '';
        const companyNameB = b.company_name || '';

        const nameA = a.type === this.typeCustomer.person && companyNameA === '' ? a.first_name.toLowerCase() : companyNameA.toLowerCase();
        const nameB = b.type === this.typeCustomer.person && companyNameB === '' ? b.first_name.toLowerCase() : companyNameB.toLowerCase();

        if (nameA < nameB) {
          return -1;
        } else if (nameA > nameB) {
          return 1;
        } else {
          return 0;
        }
      });

  }

  returnSecurityUsersListSorted(securityUsers:SecurityUser[]){

    return securityUsers.sort((a, b) => {

      const nameA = a.user.first_name;
      const nameB = b.user.first_name;

      if (nameA < nameB) {
        return -1;
      } else if (nameA > nameB) {
        return 1;
      } else {
        return 0;
      }
    });

  }

  showConfirmationDeleteDialog(): Promise<any> {
    return Swal.fire({
      title: this.translateService.instant(
        'clients.table.buttons.confirm_question_delete'
      ),
      text: this.translateService.instant(
        'clients.table.buttons.actions_cannot_be_reversed'
      ),
      iconHtml: '<img src="assets/images/alert-delete.svg">',
      confirmButtonText: 'Delete', // Customize as needed
      showCancelButton: true,
      cancelButtonText: 'Cancel', // Customize as needed
      customClass: {
        popup: 'c-alert c-alert--delete',
      },
    }).then((result) => {
      return result;
    });
  }

  showMessageCreated(){
    this.showCustomMessage('Ok','Ok','successMessages.created_succesfully');
  }

  showMessageUpdated(){
    this.showCustomMessage('Ok','Ha sido exitosa tu transacción.','¡Cambios guardados!');
  }

  showMessageDeleted(){
    this.showCustomMessage('Ok','Ok','successMessages.deleted_successfully');
  }

  showMessageRequiredFields(){
    this.showCustomMessage('Error','Error','clients.form_create.remember_fill_required_information')
  }

  showCustomMessage(type:'Ok' | 'Error',title:string,message:string){
    if(type === 'Ok'){
      this.toastr.success(title, this.translateService.instant(message));
    }
    else{
      this.toastr.error(title, this.translateService.instant(message));
    }
  }

}
