import { render, screen } from '@testing-library/angular';
import { describe, expect, it } from 'vitest';
import { App } from './app';

describe('App', () => {
  it('should render the app', async () => {
    await render(App);
    expect(App).toBeTruthy();
  });

  it('should render title', async () => {
    await render(App);
    expect(
      screen.getByRole('heading', {
        name: 'Bienvenue sur le site de recherche de communes',
      })
    ).toBeInTheDocument();
  });
});
