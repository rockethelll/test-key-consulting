import { render } from '@testing-library/angular';
import { describe, expect, it } from 'vitest';
import { MunicipalitiesList } from './municipalities-list';

describe('MunicipalitiesList', () => {
  it.skip('should render the municipalities list', async () => {
    await render(MunicipalitiesList);
    expect(MunicipalitiesList).toBeTruthy();
  });
});
