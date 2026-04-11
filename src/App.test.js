import { render, screen } from '@testing-library/react';
import './i18n/i18n';
import App from './App';

test('renders interks branding', async () => {
  render(<App />);
  const brand = await screen.findAllByText(/interks/i);
  expect(brand.length).toBeGreaterThan(0);
});
