import * as lpn from 'google-libphonenumber';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';

import { CountryCode } from './data/country-code';
import { CountryISO } from './enums/country-iso.enum';
import { SearchCountryField } from './enums/search-country-field.enum';
import { ChangeData } from './interfaces/change-data';
import { Country } from './model/country.model';
import { PhoneNumberFormat } from './enums/phone-number-format.enum';

@Component({
  selector: 'ngx-intl-tel-input',
  templateUrl: './ngx-intl-tel-input.component.html',
  styleUrls: ['./bootstrap-dropdown.css', './ngx-intl-tel-input.component.css'],
  providers: [CountryCode],
})
export class NgxIntlTelInputComponent implements OnInit, OnChanges {
  @Input() value: string | undefined = '';
  @Input() preferredCountries: Array<string> = [];
  @Input() enablePlaceholder = true;
  @Input() customPlaceholder!: string;
  @Input() numberFormat: PhoneNumberFormat = PhoneNumberFormat.International;
  @Input() cssClass = 'form-control';
  @Input() onlyCountries: Array<string> = [];
  @Input() enableAutoCountrySelect = true;
  @Input() searchCountryFlag = true;
  @Input() searchCountryField: SearchCountryField[] = [SearchCountryField.All];
  @Input() searchCountryPlaceholder = 'Search Country';
  @Input() maxLength: number = 15;
  @Input() selectFirstCountry = false;
  @Input() phoneValidation = true;
  @Input() inputId = 'phone';
  @Input() separateDialCode = true;

  @Output() readonly numberChange = new EventEmitter<string>();

  separateDialCodeClass!: string;
  selectedCountryISO: CountryISO = CountryISO.UnitedStates;
  selectedCountry: Country = {
    areaCodes: undefined,
    dialCode: '',
    htmlId: '',
    flagClass: '',
    iso2: '',
    name: '',
    placeHolder: '',
    priority: 0,
  };

  phoneNumber: string | undefined = '';
  allCountries: Array<Country> = [];
  countriesAvailables: Array<Country> = [];
  preferredCountriesInDropDown: Array<Country> = [];
  phoneUtil: any = lpn.PhoneNumberUtil.getInstance();
  disabled = false;
  errors: Array<any> = ['Phone number is required.'];
  countrySearchText = '';

  @ViewChild('countryList') countryList!: ElementRef;

  constructor(private countryCodeData: CountryCode) {}

  ngOnInit() {
    this.init();
    this.phoneNumber = this.value;
    this.updateSelectedCountry();
    this.checkSeparateDialCodeStyle();
    this.countriesAvailables = [...this.allCountries];
  }

  ngOnChanges(changes: SimpleChanges) {
    this.updateSelectedCountry();
    this.checkSeparateDialCodeStyle();
    if (
      this.countriesAvailables.findIndex(
        (c) => c.iso2 === this.selectedCountry.iso2
      ) === -1
    )
      this.countriesAvailables.push(this.selectedCountry);
  }

  /*
		This is a wrapper method to avoid calling this.ngOnInit() in writeValue().
		Ref: http://codelyzer.com/rules/no-life-cycle-call/
	*/

  init() {
    this.fetchCountryData();
    if (this.onlyCountries.length) {
      this.allCountries = this.allCountries.filter((c) =>
        this.onlyCountries.includes(c.iso2)
      );
    }
    if (this.selectFirstCountry) {
      if (this.preferredCountriesInDropDown.length) {
        this.setSelectedCountry(this.preferredCountriesInDropDown[0]);
      } else {
        this.setSelectedCountry(this.allCountries[0]);
      }
    }
    this.updateSelectedCountry();
    this.checkSeparateDialCodeStyle();
  }

  setSelectedCountry(country: Country) {
    this.selectedCountry = country;
  }

  public onPhoneNumberChange(): void {
    let countryCode: string | undefined;
    // Handle the case where the user sets the value programatically based on a persisted ChangeData obj.
    if (this.phoneNumber && typeof this.phoneNumber === 'object') {
      const numberObj: ChangeData = this.phoneNumber;
      this.phoneNumber = numberObj.number;
      countryCode = numberObj.countryCode;
    }

    this.value = this.phoneNumber;
    countryCode = countryCode || this.selectedCountry.iso2;
    // @ts-ignore
    const number = this.getParsedNumber(this.phoneNumber, countryCode);

    // auto select country based on the extension (and areaCode if needed) (e.g select Canada if number starts with +1 416)
    if (this.enableAutoCountrySelect) {
      countryCode =
        number && number.getCountryCode()
          ? // @ts-ignore
            this.getCountryIsoCode(number.getCountryCode(), number)
          : this.selectedCountry.iso2;
      if (countryCode && countryCode !== this.selectedCountry.iso2) {
        const newCountry = this.allCountries
          .sort((a, b) => {
            return a.priority - b.priority;
          })
          .find((c) => c.iso2 === countryCode);
        if (newCountry) {
          this.selectedCountry = newCountry;
        }
      }
    }
    countryCode = countryCode ? countryCode : this.selectedCountry.iso2;

    this.checkSeparateDialCodeStyle();

    if (!this.value) return;
    const intlNo = number
      ? this.phoneUtil.format(number, lpn.PhoneNumberFormat.INTERNATIONAL)
      : '';

    // parse phoneNumber if separate dial code is needed
    this.phoneNumber = intlNo;
    this.numberChange.emit(intlNo);
  }

  onInputKeyPress(event: KeyboardEvent): void {
    const allowedChars = /[0-9\+\-\(\)\ ]/;
    const allowedCtrlChars = /[axcv]/; // Allows copy-pasting
    const allowedOtherKeys = [
      'ArrowLeft',
      'ArrowUp',
      'ArrowRight',
      'ArrowDown',
      'Home',
      'End',
      'Insert',
      'Delete',
      'Backspace',
    ];

    if (
      !allowedChars.test(event.key) &&
      !(event.ctrlKey && allowedCtrlChars.test(event.key)) &&
      !allowedOtherKeys.includes(event.key)
    ) {
      event.preventDefault();
    }
  }

  writeValue(obj: any): void {
    if (obj === undefined) {
      this.init();
    }
    this.phoneNumber = obj;
    setTimeout(() => {
      this.onPhoneNumberChange();
    }, 1);
  }

  resolvePlaceholder(): string {
    let placeholder = '';
    if (this.customPlaceholder) {
      placeholder = this.customPlaceholder;
    } else if (this.selectedCountry.placeHolder) {
      placeholder = this.selectedCountry.placeHolder;
    }
    return placeholder;
  }

  /* --------------------------------- Helpers -------------------------------- */
  /**
   * Returns parse PhoneNumber object.
   * @param phoneNumber string
   * @param countryCode string
   */
  private getParsedNumber(
    phoneNumber: string,
    countryCode: string
  ): lpn.PhoneNumber {
    let number: lpn.PhoneNumber;
    try {
      number = this.phoneUtil.parse(phoneNumber, countryCode.toUpperCase());
    } catch (e) {}
    // @ts-ignore
    return number;
  }

  /**
   * Adjusts input alignment based on the dial code presentation style.
   */
  private checkSeparateDialCodeStyle() {
    if (this.separateDialCode && this.selectedCountry) {
      const cntryCd = this.selectedCountry.dialCode;
      this.separateDialCodeClass =
        'separate-dial-code iti-sdc-' + (cntryCd.length + 1);
    } else {
      this.separateDialCodeClass = '';
    }
  }

  /**
   * Sifts through all countries and returns iso code of the primary country
   * based on the number provided.
   * @param countryCode country code in number format
   * @param number PhoneNumber object
   */
  private getCountryIsoCode(
    countryCode: number,
    number: lpn.PhoneNumber
  ): string | undefined {
    // Will use this to match area code from the first numbers
    // @ts-ignore
    const rawNumber = number['values_']['2'].toString();
    // List of all countries with countryCode (can be more than one. e.x. US, CA, DO, PR all have +1 countryCode)
    const countries = this.allCountries.filter(
      (c) => c.dialCode === countryCode.toString()
    );
    // Main country is the country, which has no areaCodes specified in country-code.ts file.
    const mainCountry = countries.find((c) => c.areaCodes === undefined);
    // Secondary countries are all countries, which have areaCodes specified in country-code.ts file.
    const secondaryCountries = countries.filter(
      (c) => c.areaCodes !== undefined
    );
    let matchedCountry = mainCountry ? mainCountry.iso2 : undefined;

    /*
			Iterate over each secondary country and check if nationalNumber starts with any of areaCodes available.
			If no matches found, fallback to the main country.
		*/
    secondaryCountries.forEach((country) => {
      // @ts-ignore
      country.areaCodes.forEach((areaCode) => {
        if (rawNumber.startsWith(areaCode)) {
          matchedCountry = country.iso2;
        }
      });
    });

    return matchedCountry;
  }

  /**
   * Gets formatted example phone number from phoneUtil.
   * @param countryCode string
   */
  protected getPhoneNumberPlaceHolder(countryCode: string): string {
    try {
      return this.phoneUtil.format(
        this.phoneUtil.getExampleNumber(countryCode),
        lpn.PhoneNumberFormat[this.numberFormat]
      );
    } catch (e) {
      // @ts-ignore
      return e;
    }
  }

  /**
   * Clearing the list to avoid duplicates (https://github.com/webcat12345/ngx-intl-tel-input/issues/248)
   */
  protected fetchCountryData(): void {
    this.allCountries = [];

    this.countryCodeData.allCountries.forEach((c) => {
      const country: Country = {
        name: c[0].toString(),
        iso2: c[1].toString(),
        dialCode: c[2].toString(),
        priority: +c[3] || 0,
        areaCodes: (c[4] as string[]) || undefined,
        htmlId: `iti-0__item-${c[1].toString()}`,
        flagClass: `iti__${c[1].toString().toLocaleLowerCase()}`,
        placeHolder: '',
      };

      if (this.enablePlaceholder) {
        country.placeHolder = this.getPhoneNumberPlaceHolder(
          country.iso2.toUpperCase()
        );
      }

      this.allCountries.push(country);
    });
  }

  /**
   * Updates selectedCountry.
   */
  private updateSelectedCountry() {
    if (this.selectedCountryISO) {
      // @ts-ignore
      this.selectedCountry = this.allCountries.find((c) => {
        return c.iso2.toLowerCase() === this.selectedCountryISO.toLowerCase();
      });
      if (this.selectedCountry) {
        if (this.phoneNumber) {
          this.onPhoneNumberChange();
        }
      }
    }
  }
  availableCountriesSearch(event: any) {
    this.countriesAvailables = this.allCountries.filter((country) => {
      if (
        country.name.toLowerCase().includes(event.target.value.toLowerCase())
      ) {
        return true;
      } else if (
        country.iso2.toLowerCase().includes(event.target.value.toLowerCase())
      ) {
        return true;
      } else if (
        country.dialCode
          .toLowerCase()
          .includes(event.target.value.toLowerCase())
      ) {
        return true;
      } else if (
        `+${country.dialCode}`
          .toLowerCase()
          .includes(event.target.value.toLowerCase())
      ) {
        return true;
      } else return false;
    });
  }
  changeSelected(event: any, el: { focus: () => void }) {
    const countrySelected = this.allCountries.find((c) => {
      return c.iso2.toLowerCase() === event.toLowerCase();
    }) as Country;

    this.setSelectedCountry(countrySelected);
    this.checkSeparateDialCodeStyle();

    if (this.phoneNumber && this.phoneNumber.length > 0) {
      this.value = this.phoneNumber;
      const number = this.getParsedNumber(
        this.phoneNumber,
        this.selectedCountry.iso2
      );
      const intlNo = number
        ? this.phoneUtil.format(number, lpn.PhoneNumberFormat.INTERNATIONAL)
        : '';
      // parse phoneNumber if separate dial code is needed

      this.numberChange.emit(intlNo);
    }

    el.focus();
  }
  changeIso(event: any) {
    this.selectedCountryISO = event;
    this.updateSelectedCountry();
  }
  fillAgain() {
    this.countriesAvailables = this.allCountries;
  }
}
