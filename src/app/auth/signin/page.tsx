'use client';

import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function SignInPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <a
              href="/auth/signup"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              create a new account
            </a>
          </p>
        </div>
        <div className="mt-8">
          <Authenticator
            hideSignUp={true}
            components={{
              SignIn: {
                Header() {
                  return (
                    <div className="text-center">
                      <h1 className="text-2xl font-bold text-gray-900">
                        Welcome back to Kalpla
                      </h1>
                    </div>
                  );
                },
                Footer() {
                  return (
                    <div className="text-center text-sm text-gray-600">
                      Don't have an account?{' '}
                      <a
                        href="/auth/signup"
                        className="font-medium text-blue-600 hover:text-blue-500"
                      >
                        Sign up
                      </a>
                    </div>
                  );
                },
              },
            }}
          >
            {({ signOut, user }) => {
              if (user) {
                // Redirect to dashboard after successful sign in
                router.push('/dashboard');
              }
              return null;
            }}
          </Authenticator>
        </div>
      </div>
    </div>
  );
}
