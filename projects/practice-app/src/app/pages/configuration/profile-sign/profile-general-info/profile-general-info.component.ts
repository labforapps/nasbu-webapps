import { Component, Input, OnInit } from '@angular/core';
import { Country, Subscription, SubscriptionAddress, SubscriptionContact, SubtypeContact, TypeContact, WeekDaysDescription,SubtypeContactDescripcion } from 'core-models';
import { CommonService } from 'core-services';

@Component({
  selector: 'app-profile-general-info',
  templateUrl: './profile-general-info.component.html',
  styleUrls: ['./profile-general-info.component.scss']
})
export class ProfileGeneralInfoComponent implements OnInit {

  @Input() subscription!:Subscription;
  subscriptionContactPhones!:SubscriptionContact[];
  subscriptionContactEmail!:SubscriptionContact[];
  typeContact = TypeContact;
  subtypeContact = SubtypeContact;

  countries!:Country[];
  weekDays = [2,3,4,5,6,7,1];

  constructor(private commonSevice:CommonService) { }

  ngOnInit(): void {
    this.setContacts();
    this.fetchCountries();
    this.setScheduleProfile();
  }

  setContacts(){
    this.subscriptionContactPhones = this.subscription.contacts.filter( x => x.type === this.typeContact.phone_number);
    this.subscriptionContactEmail = this.subscription.contacts.filter(x => x.type === this.typeContact.email);
  }

  setScheduleProfile(){
    if(this.subscription.schedules.length === 0){
      this.weekDays.forEach(x => {
        this.subscription.schedules.push({
            "week_day": x,
            "is_closed": true,
            "start_time": "00:00",
            "end_time": "00:00"
        })
      })
    }
  }

  fetchCountries(){
    this.commonSevice.getCountries().subscribe(data => {
      this.countries = data;
    })
  }

  returnCountryName(countryId:string){
    const countryFiltered:Country[] = this.countries.filter(x => x.uuid === countryId);
    return countryFiltered[0].name;
  }

  returnScheduleInformation(weekDay:number){
    const scheduleFiltered = this.subscription.schedules.filter(x => x.week_day === weekDay && !x.is_closed) || [];

    return {
      ...scheduleFiltered[0],
      nameDay: WeekDaysDescription.get(weekDay)
    }
  }

  returnContactDescription(subtypeContact:string){
    return SubtypeContactDescripcion.get(subtypeContact || '');
  }


}
