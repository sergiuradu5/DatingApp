import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberCardDetailedComponent } from './member-card-detailed.component';

describe('MemberCardDetailedComponent', () => {
  let component: MemberCardDetailedComponent;
  let fixture: ComponentFixture<MemberCardDetailedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemberCardDetailedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberCardDetailedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
