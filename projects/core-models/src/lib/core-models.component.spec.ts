import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoreModelsComponent } from './core-models.component';

describe('CoreModelsComponent', () => {
  let component: CoreModelsComponent;
  let fixture: ComponentFixture<CoreModelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoreModelsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoreModelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
