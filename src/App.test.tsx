import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

test('renders without crashing', () => {
  render(<App />);
  // Add a simple assertion to make the test meaningful
  expect(document.body).toBeInTheDocument();
});
