import React from 'react';
import SignInForm from './components/sign-in-form';

interface SignInProps {
  children: React.ReactNode;
}

const SignInPage: React.FC<SignInProps> = ({ children }) => {
  return (
    <div>
      <SignInForm />
    </div>
  );
};

export default SignInPage;
