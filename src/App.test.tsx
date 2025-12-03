import React from 'react';
import { render, waitFor } from './test-utils';
import App from './App';

jest.mock('../README.md', () => ({
  text: jest.fn().mockResolvedValue('hello world'),
}));

// Mock fetch to resolve immediately
global.fetch = jest.fn(() =>
  Promise.resolve({
    text: () => Promise.resolve('# Test Markdown'),
  }),
) as jest.Mock;

test('renders home page', async () => {
  const { getByTestId } = render(<App />);

  await waitFor(() => {
    expect(getByTestId('MockReactMarkdown')).toBeInTheDocument();
  });
});
