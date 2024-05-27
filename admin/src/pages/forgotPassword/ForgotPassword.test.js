import React from 'react';
import { render, screen, fireEvent, waitFor, } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; // Import this for additional matchers like .toBeInTheDocument()
import ForgotPassword from './ForgotPassword';

describe('ForgotPassword component', () => {
  test('renders forgot password form', () => {
    render(<ForgotPassword />);
    const emailInput = screen.getByPlaceholderText('Enter your email');
    expect(emailInput).toBeInTheDocument();
    const requestButton = screen.getByRole('button', { name: 'Request password reset' });
    expect(requestButton).toBeInTheDocument();
  });


});
