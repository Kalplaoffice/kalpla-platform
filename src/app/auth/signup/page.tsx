'use client';

import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SignUpPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<string>('Student');

  const roles = [
    { value: 'Student', label: 'Student', description: 'Learn and grow with our courses and programs' },
    { value: 'Instructor', label: 'Instructor', description: 'Create and teach courses to students' },
    { value: 'Mentor', label: 'Mentor', description: 'Guide students in the KSMP program' },
    { value: 'Investor', label: 'Investor', description: 'Access investment opportunities and demos' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <a
              href="/auth/signin"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              sign in to your existing account
            </a>
          </p>
        </div>

        {/* Role Selection */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Choose your role
          </h3>
          <div className="space-y-3">
            {roles.map((role) => (
              <label
                key={role.value}
                className={`relative flex cursor-pointer rounded-lg p-4 border-2 ${
                  selectedRole === role.value
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value={role.value}
                  checked={selectedRole === role.value}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="sr-only"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{role.label}</div>
                  <div className="text-sm text-gray-500">{role.description}</div>
                </div>
                {selectedRole === role.value && (
                  <div className="flex-shrink-0">
                    <div className="h-4 w-4 rounded-full bg-blue-600"></div>
                  </div>
                )}
              </label>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <Authenticator
            hideSignUp={false}
            components={{
              SignUp: {
                Header() {
                  return (
                    <div className="text-center">
                      <h1 className="text-2xl font-bold text-gray-900">
                        Join Kalpla as a {selectedRole}
                      </h1>
                    </div>
                  );
                },
                Footer() {
                  return (
                    <div className="text-center text-sm text-gray-600">
                      Already have an account?{' '}
                      <a
                        href="/auth/signin"
                        className="font-medium text-blue-600 hover:text-blue-500"
                      >
                        Sign in
                      </a>
                    </div>
                  );
                },
              },
            }}
          >
            {({ signOut, user }) => {
              if (user) {
                // Redirect to dashboard after successful sign up
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
