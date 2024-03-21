import { Component, OnInit } from '@angular/core';
import { LangService } from './services/lang.service';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent implements OnInit {
  constructor(private langService: LangService) { }

  ngOnInit(): void {
    this.langService.init();
  }
}
