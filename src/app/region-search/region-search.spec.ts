import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, beforeEach, it, expect } from 'vitest';
import { RegionSearch } from './region-search';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('RegionSearchComponent', () => {
  let component: RegionSearch;
  let fixture: ComponentFixture<RegionSearch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegionSearch],
      providers: [provideHttpClient(), provideHttpClientTesting()],
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
