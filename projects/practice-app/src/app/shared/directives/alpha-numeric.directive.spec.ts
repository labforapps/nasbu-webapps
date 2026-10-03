import { ElementRef } from '@angular/core';

import { AlphaNumericDirective } from './alpha-numeric.directive';

describe('AlphaNumericDirective', () => {
  it('should create an instance', () => {
    const elementRef = new ElementRef(document.createElement('input'));
    const directive = new AlphaNumericDirective(elementRef);
    expect(directive).toBeTruthy();
  });
});
