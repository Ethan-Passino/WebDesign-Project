import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import Login from './Login';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
test('renders learn react link', () => {
  render(<Login />);
  const linkElement = screen.getByText(/Login placeholder page/i);
  expect(linkElement).toBeInTheDocument();
});
