import { Component, Input, OnInit } from '@angular/core';
import { Country, Subscription, SubscriptionAddress, SubscriptionContact, TypeContact, WeekDaysDescription } from 'core-models';
import { CommonService } from 'projects/core-services/src/public-api';

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
  countries!:Country[];
  weekDays = [2,3,4,5,6,7,1];

  constructor(private commonSevice:CommonService) { }

  ngOnInit(): void {
    this.setArrayFields();
    console.log(this.subscription);

    if(this.subscription.schedules.length === 0){
      this.subscription.schedules = [
        {
            "week_day": 2,
            "is_closed": true,
            "start_time": "00:00",
            "end_time": "00:00"
        },
        {
            "week_day": 3,
            "is_closed": true,
            "start_time": "00:00",
            "end_time": "00:00"
        },
        {
            "week_day": 4,
            "is_closed": true,
            "start_time": "00:00",
            "end_time": "00:00"
        },
        {
            "week_day": 5,
            "is_closed": true,
            "start_time": "00:00",
            "end_time": "00:00"
        },
        {
            "week_day": 6,
            "is_closed": true,
            "start_time": "00:00",
            "end_time": "00:00"
        },
        {
            "week_day": 7,
            "is_closed": true,
            "start_time": "00:00",
            "end_time": "00:00"
        },
        {
            "week_day": 1,
            "is_closed": true,
            "start_time": "00:00",
            "end_time": "00:00"
        }
     ]
    }
  }

  setArrayFields(){
    this.subscriptionContactPhones = this.subscription.contacts.filter( x => x.type === this.typeContact.phone_number);
    this.subscriptionContactEmail = this.subscription.contacts.filter(x => x.type === this.typeContact.email);
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
    const scheduleFiltered = this.subscription.schedules.filter(x => x.week_day === weekDay);
    console.log(scheduleFiltered);

    return {
      ...scheduleFiltered[0],
      nameDay: WeekDaysDescription.get(scheduleFiltered[0].week_day)
    }
  }


}
