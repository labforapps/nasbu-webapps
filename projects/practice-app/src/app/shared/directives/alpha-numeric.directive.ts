import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appAlphaNumeric]'
})
export class AlphaNumericDirective {
  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event']) onInputChange(event: InputEvent) {
    const initialValue = this.el.nativeElement.value;

    this.el.nativeElement.value = initialValue.replace(/[^a-zA-Z0-9 _]/g, '');
    if (initialValue !== this.el.nativeElement.value) {
      event.stopPropagation();
    }
  }
}
