import React from 'react';
import { render, screen } from '@testing-library/react';
import LoadingSpinner from '../../component/LoadingSpinner';

describe('LoadingSpinner', () => {
  test('renders with default props', () => {
    render(<LoadingSpinner />);
    
    // Spinner div should be in the document
    const spinner = screen.getByRole('status', { hidden: true }) || screen.getByTestId('spinner');
    expect(spinner).toBeInTheDocument();

    // Should have default size classes (md)
    const spinnerDiv = screen.getByRole('status', { hidden: true }) || screen.getByTestId('spinner');
    expect(spinnerDiv).toHaveClass('w-12 h-12');

    // Should not render message by default
    expect(screen.queryByText(/./)).not.toBeInTheDocument();

    // Should render non-fullscreen container
    const container = spinnerDiv.parentElement;
    expect(container).toHaveClass('flex flex-col items-center py-10');
  });

  test('renders spinner with size sm', () => {
    render(<LoadingSpinner size="sm" />);
    const spinnerDiv = screen.getByRole('status', { hidden: true }) || screen.getByTestId('spinner');
    expect(spinnerDiv).toHaveClass('w-8 h-8');
  });

  test('renders spinner with size lg', () => {
    render(<LoadingSpinner size="lg" />);
    const spinnerDiv = screen.getByRole('status', { hidden: true }) || screen.getByTestId('spinner');
    expect(spinnerDiv).toHaveClass('w-16 h-16');
  });

  test('renders spinner with fullScreen prop', () => {
    render(<LoadingSpinner fullScreen />);
    const container = screen.getByText((content, element) => {
      return element.className.includes('fixed inset-0 bg-black/60 flex flex-col items-center justify-center z-50');
    });
    expect(container).toBeInTheDocument();

    // Spinner inside fullscreen container
    const spinnerDiv = container.querySelector('div');
    expect(spinnerDiv).toHaveClass('animate-spin');
  });

  test('renders message when provided', () => {
    const message = 'Loading data...';
    render(<LoadingSpinner message={message} />);
    expect(screen.getByText(message)).toBeInTheDocument();
  });

  test('renders message with correct styles in fullScreen mode', () => {
    const message = 'Please wait...';
    render(<LoadingSpinner fullScreen message={message} />);
    const messageElement = screen.getByText(message);
    expect(messageElement).toBeInTheDocument();
    expect(messageElement).toHaveClass('text-gray-300 mt-4 text-sm');
  });

  test('renders message with correct styles in non-fullScreen mode', () => {
    const message = 'Please wait...';
    render(<LoadingSpinner message={message} />);
    const messageElement = screen.getByText(message);
    expect(messageElement).toBeInTheDocument();
    expect(messageElement).toHaveClass('text-gray-400 mt-4 text-sm');
  });
});
