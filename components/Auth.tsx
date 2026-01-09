'use client';

import { useState } from 'react';
import { db } from '@/lib/db';

export default function Auth({ onAuthSuccess }: { onAuthSuccess?: () => void }) {
  const { user, isLoading } = db.useAuth();
  
  if (isLoading) {
    return <div className="auth-form"><p>Loading...</p></div>;
  }
  
  if (user?.id) {
    // User is authenticated
    return (
      <div className="auth-form">
        <p>Signed in as {user.email}</p>
        <button onClick={() => db.auth.signOut()}>Sign Out</button>
      </div>
    );
  }
  
  // User is not authenticated - show magic code authentication form
  return <MagicCodeAuth onSuccess={onAuthSuccess} />;
}

function MagicCodeAuth({ onSuccess }: { onSuccess?: () => void }) {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Step 1: Send magic code to email
  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await db.auth.sendMagicCode({ email });
      setStep('code');
    } catch (err: any) {
      setError(err.message || 'Failed to send verification code');
    } finally {
      setLoading(false);
    }
  };
  
  // Step 2: Verify code and sign in
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await db.auth.signInWithMagicCode({ email, code });
      // User will be automatically signed in
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || 'Invalid verification code');
      setCode('');
    } finally {
      setLoading(false);
    }
  };
  
  // Resend code functionality
  const handleResendCode = async () => {
    setError('');
    setLoading(true);
    try {
      await db.auth.sendMagicCode({ email });
    } catch (err: any) {
      setError(err.message || 'Failed to resend code');
    } finally {
      setLoading(false);
    }
  };
  
  // Reset flow to start over
  const handleBackToEmail = () => {
    setStep('email');
    setCode('');
    setError('');
  };
  
  if (step === 'email') {
    return (
      <form onSubmit={handleSendCode} className="auth-form">
        <h2>Sign In with Magic Code</h2>
        <p>Enter your email to receive a 6-digit verification code</p>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          disabled={loading}
        />
        {error && <div className="error">{error}</div>}
        <button type="submit" disabled={loading || !email}>
          {loading ? 'Sending...' : 'Send Verification Code'}
        </button>
      </form>
    );
  }
  
  // Step 2: Code verification
  return (
    <form onSubmit={handleVerifyCode} className="auth-form">
      <h2>Enter Verification Code</h2>
      <p>We sent a 6-digit code to {email}</p>
      <input
        type="text"
        value={code}
        onChange={(e) => {
          // Only allow 6 digits
          const value = e.target.value.replace(/\D/g, '').slice(0, 6);
          setCode(value);
        }}
        placeholder="000000"
        maxLength={6}
        required
        disabled={loading}
        className="code-input"
      />
      {error && <div className="error">{error}</div>}
      <button type="submit" disabled={loading || code.length !== 6}>
        {loading ? 'Verifying...' : 'Verify Code'}
      </button>
      <button 
        type="button" 
        onClick={handleResendCode}
        disabled={loading}
        className="resend-button"
      >
        Resend Code
      </button>
      <button 
        type="button" 
        onClick={handleBackToEmail}
        disabled={loading}
        className="back-button"
      >
        Back to Email
      </button>
    </form>
  );
}
