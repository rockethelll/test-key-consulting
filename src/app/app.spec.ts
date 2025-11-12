import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { render, screen } from '@testing-library/angular';
import { beforeEach, describe, expect, it } from 'vitest';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await render(App, {
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
  });
  it.only('should render the app', async () => {
    expect(App).toBeTruthy();
  });

  it('should render title', async () => {
    expect(
      screen.getByRole('heading', {
        name: 'Bienvenue sur le site de recherche de communes',
      })
    ).toBeInTheDocument();
  });
});
