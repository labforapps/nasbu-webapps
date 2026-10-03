import { ElementRef, Renderer2 } from '@angular/core';

import { AutofocusDirective } from './autofocus.directive';

describe('AutofocusDirective', () => {
  it('should create an instance', () => {
    const elementRef = new ElementRef(document.createElement('input'));
    const renderer = jasmine.createSpyObj<Renderer2>('Renderer2', ['selectRootElement']);
    const directive = new AutofocusDirective(elementRef, renderer);
    expect(directive).toBeTruthy();
  });
});
