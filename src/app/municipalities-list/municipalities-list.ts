import { DecimalPipe, Location } from '@angular/common';
import {
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { debounceTime, Subject, switchMap } from 'rxjs';
import { SearchMunicipalites } from '../GeoApiService/municipalitiesService/search-municipalites';
import {
  DEFAULT_PAGE,
  DEFAULT_SORT_COLUMN,
  DEFAULT_SORT_DIRECTION,
  PAGINATION_ITEMS_PER_PAGE,
} from '../core/constants/app.constants';
import { Municipality } from '../core/models/municipality.model';

type SortColumn = 'nom' | 'codesPostaux' | 'population' | null;
type SortDirection = 'asc' | 'desc';

@Component({
  selector: 'app-municipalities-list',
  imports: [DecimalPipe],
  templateUrl: './municipalities-list.html',
})
export class MunicipalitiesList implements OnInit {
  location = inject(Location);
  activatedRoute = inject(ActivatedRoute);
  searchMunicipalitesService = inject(SearchMunicipalites);
  codeDepartment = signal<string>('');
  municipalities = signal<Municipality[]>([]);
  destroyRef = inject(DestroyRef);

  // Sort and pagination
  sortColumn = signal<SortColumn>(DEFAULT_SORT_COLUMN);
  sortDirection = signal<SortDirection>(DEFAULT_SORT_DIRECTION);
  currentPage = signal<number>(DEFAULT_PAGE);
  itemsPerPage = PAGINATION_ITEMS_PER_PAGE;
  searchTerm = signal<string>('');
  private searchSubject = new Subject<string>();

  // Filtered municipalities
  filteredMunicipalities = computed(() => {
    const municipalities = this.municipalities();
    const search = this.searchTerm().toLowerCase().trim();

    if (!search) {
      return municipalities;
    }

    return municipalities.filter(
      (municipality) =>
        municipality.nom.toLowerCase().includes(search) ||
        municipality.codeDepartement.toLowerCase().includes(search) ||
        municipality.codesPostaux.some((cp) =>
          cp.toLowerCase().includes(search)
        )
    );
  });

  // Sort the municipalities by the given column
  sortedMunicipalities = computed(() => {
    const municipalities = this.filteredMunicipalities();
    const column = this.sortColumn();
    const direction = this.sortDirection();

    if (!column) {
      return municipalities;
    }

    return [...municipalities].sort((a, b) => {
      let comparison = 0;

      switch (column) {
        case 'nom':
          // Use localeCompare for a French alphabetical sort with accents
          comparison = a.nom.localeCompare(b.nom, 'fr', {
            sensitivity: 'base',
          });
          break;
        case 'codesPostaux':
          // Sort by the first postal code
          const aCode = a.codesPostaux[0] || '';
          const bCode = b.codesPostaux[0] || '';
          if (aCode < bCode) {
            comparison = -1;
          } else if (aCode > bCode) {
            comparison = 1;
          } else {
            comparison = 0;
          }
          break;
        case 'population':
          const aPop = a.population || 0;
          const bPop = b.population || 0;
          if (aPop < bPop) {
            comparison = -1;
          } else if (aPop > bPop) {
            comparison = 1;
          } else {
            comparison = 0;
          }
          break;
        default:
          return 0;
      }

      // Inverser le résultat si le tri est décroissant
      return direction === 'asc' ? comparison : -comparison;
    });
  });

  // Get the paginated municipalities
  paginatedMunicipalities = computed(() => {
    const sorted = this.sortedMunicipalities();
    const page = this.currentPage();
    const start = (page - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return sorted.slice(start, end);
  });

  // Total number of pages
  totalPages = computed(() => {
    return Math.ceil(this.sortedMunicipalities().length / this.itemsPerPage);
  });

  // Maximum item number displayed on current page
  maxDisplayedItem = computed(() => {
    return Math.min(
      this.currentPage() * this.itemsPerPage,
      this.sortedMunicipalities().length
    );
  });

  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      this.codeDepartment.set(params['codeDepartment']);
    });

    // Debounce search input (300ms)
    this.searchSubject
      .pipe(debounceTime(300), takeUntilDestroyed(this.destroyRef))
      .subscribe((searchValue) => {
        this.searchTerm.set(searchValue);
        // Reset to the first page when searching
        this.currentPage.set(1);
      });
  }

  private _ = toObservable(this.codeDepartment)
    .pipe(
      switchMap((codeDepartment) =>
        this.searchMunicipalitesService.searchMunicipalites(codeDepartment)
      ),
      takeUntilDestroyed(this.destroyRef)
    )
    .subscribe((municipalities) => {
      this.municipalities.set(municipalities);
      // Reset to the first page when new data arrives
      this.currentPage.set(1);
    });

  goBack() {
    this.location.back();
  }

  // Sort the municipalities by the given column
  sort(column: SortColumn) {
    if (this.sortColumn() === column) {
      // Invert the direction if the same column is clicked
      this.sortDirection.set(this.sortDirection() === 'asc' ? 'desc' : 'asc');
    } else {
      // New column, sort by ascending order
      this.sortColumn.set(column);
      this.sortDirection.set('asc');
    }
    // Reset to the first page when sorting
    this.currentPage.set(1);
  }

  // Get the sort icon for the given column
  getSortIcon(column: SortColumn): string {
    if (this.sortColumn() !== column) {
      return '↕️';
    }
    return this.sortDirection() === 'asc' ? '↑' : '↓';
  }

  private scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Go to the given page
  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      this.scrollToTop();
    }
  }

  // Go to the previous page
  previousPage() {
    if (this.currentPage() > 1) {
      this.currentPage.set(this.currentPage() - 1);
      this.scrollToTop();
    }
  }

  // Go to the next page
  nextPage() {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.set(this.currentPage() + 1);
      this.scrollToTop();
    }
  }

  // Get the page numbers for pagination
  getPageNumbers(): number[] {
    const total = this.totalPages();
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  // On search change
  onSearchChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchSubject.next(target.value);
  }
}
