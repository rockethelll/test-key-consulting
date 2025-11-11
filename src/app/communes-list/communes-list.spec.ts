import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunesList } from './communes-list';

describe('CommunesList', () => {
  let component: CommunesList;
  let fixture: ComponentFixture<CommunesList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommunesList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommunesList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
