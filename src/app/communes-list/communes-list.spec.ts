import { render } from '@testing-library/angular';
import { describe, expect, it } from 'vitest';
import { CommunesList } from './communes-list';

describe('CommunesList', () => {
  it('should render the communes list', async () => {
    await render(CommunesList);
    expect(CommunesList).toBeTruthy();
  });
});
