import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Customer, SecurityUser, TypeCustomer } from 'core-models';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { saveAs } from 'file-saver';
import * as moment from 'moment';


@Injectable({
  providedIn: 'root'
})
export class HelpersService {

  typeCustomer = TypeCustomer;

  constructor(private translateService:TranslateService,
              private toastr: ToastrService) { }

  getDateRange(periodCode: string) {

    let startDate, endDate;

    endDate = moment().format('YYYY-MM-DD'); // Fecha actual

    switch (periodCode) {
      case 'last_seven_days':
        startDate = moment().subtract(7, 'days').format('YYYY-MM-DD');
        break;
      case 'this_month':
        startDate = moment().startOf('month').format('YYYY-MM-DD');
        break;
      case 'last_three_months':
        startDate = moment().subtract(3, 'months').startOf('month').format('YYYY-MM-DD');
        break;
      case 'last_six_months':
        startDate = moment().subtract(6, 'months').startOf('month').format('YYYY-MM-DD');
        break;
      case 'last_year':
        startDate = moment().subtract(1, 'year').startOf('month').format('YYYY-MM-DD');
        break;
      default:
        throw new Error('Código de período no válido');
    }

    return {startDate, endDate};
  }

  returnDateFormatted(date:string,format:string){
    return moment(date).format(format) ?? ''
  }

  openNewTabWithHtml(data:any){
    const newTab = window.open();
    if(newTab) newTab.document.body.innerHTML = data;
  }

  downloadDocument(data:any,document_name = null){
   if(document_name) {
     saveAs(data,document_name);
   }
   else{
    saveAs(data)
   }
  }

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

  showConfirmationExitInvoice(){

    return Swal.fire({
      title: this.translateService.instant('invoicing.invoice.do_you_want_to_abandone_this_invoice'),
      text: this.translateService.instant(
        'clients.table.buttons.actions_cannot_be_reversed'
      ),
      iconHtml: '<img src="assets/images/Signo_advertencia.svg">',
      confirmButtonText: this.translateService.instant('invoicing.invoice.im_sure'),
      showCancelButton: true,
      cancelButtonText: this.translateService.instant('invoicing.invoice.cancel'),
      customClass: {
        popup: 'c-alert-exit',
      },
    }).then((result) => {
      return result;
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
        popup: 'c-alert',
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
