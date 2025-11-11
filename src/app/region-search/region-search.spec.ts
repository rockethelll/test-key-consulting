import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, beforeEach, it, expect } from 'vitest';
import { RegionSearch } from './region-search';

describe('RegionSearchComponent', () => {
  let component: RegionSearch;
  let fixture: ComponentFixture<RegionSearch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegionSearch]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegionSearch);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
