import React from 'react';

interface LoginPageProps {
  onGoogleLogin: () => void;
  onMicrosoftLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onGoogleLogin, onMicrosoftLogin }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto bg-sunshine-500 rounded-full flex items-center justify-center mb-6">
            <span className="text-3xl">☀️</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Sunshine</h2>
          <p className="text-gray-500">Sign in to start recording and transcribing your meetings</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={onGoogleLogin}
            className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sunshine-500"
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
              />
            </svg>
            Continue with Google
          </button>

          <button
            onClick={onMicrosoftLogin}
            className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sunshine-500"
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zM24 11.4H12.6V0H24v11.4z"
              />
            </svg>
            Continue with Microsoft
          </button>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          By continuing, you agree to Sunshine's{' '}
          <a href="#" className="text-sunshine-600 hover:text-sunshine-500">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="text-sunshine-600 hover:text-sunshine-500">
            Privacy Policy
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 