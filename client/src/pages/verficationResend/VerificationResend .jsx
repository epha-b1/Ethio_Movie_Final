import React, { useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import styles from './VerificationResend.module.css';

const VerificationResend = () => {
  const location = useLocation();
  const email = location.state?.email || ''; // Get email from location state
  const [isResent, setIsResent] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const resendEmail = async () => {
    try {
      setErrorMessage(''); 
      await axios.post('/auth/resend-verification', { email });
      toast.success("Verification email resent!")
      setIsResent(true);
    } catch (error) {
      setErrorMessage('Error resending verification email. Please try again.');
      toast.error("Error resending verification email!")

      console.error('Error resending verification email:', error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.messageBox}>
        <h2 className={styles.messageTitle}>Almost there!</h2>
        <p className={styles.messageText}>
          We’ve sent you an email at {email}.
          <br />
          Please follow the instructions in the email.
        </p>
        {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
        {!isResent ? (
          <button className={styles.resendButton} onClick={resendEmail}>
            Resend Verification Email
          </button>
        ) : (
          <p className={styles.messageText}>Verification email resent!</p>
        )}
      </div>
    </div>
  );
};

export default VerificationResend;
