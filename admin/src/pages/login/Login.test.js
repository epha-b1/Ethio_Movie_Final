import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; // for the `toBeInTheDocument` matcher
import Auth from './Login'; // Adjust the import path as necessary

describe('Login Component', () => {
  test('renders login form', () => {
    const { getByPlaceholderText, getByText } = render(<Auth />);
    expect(getByPlaceholderText('Email or phone number')).toBeInTheDocument();
    expect(getByPlaceholderText('Password')).toBeInTheDocument();
    expect(getByText('Sign In')).toBeInTheDocument();
  });

  test('displays "Forgot password?" link', () => {
    const { getByText } = render(<Auth />);
    expect(getByText('Forgot password?')).toBeInTheDocument();
  });
});
