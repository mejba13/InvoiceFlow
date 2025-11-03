/**
 * Login Page Component
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '../../store/authStore';
import { Button, Input, Card } from '../../components/common';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setApiError(null);
    try {
      await login(data);
      navigate('/dashboard');
    } catch (error: any) {
      setApiError(error.response?.data?.detail || 'Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen bg-soft-gray flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full animate-slide-up">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-deep-navy mb-2">InvoiceFlow</h1>
          <p className="text-slate-gray">Sign in to your account</p>
        </div>

        <Card>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* API Error */}
            {apiError && (
              <div className="bg-error-red bg-opacity-10 border border-error-red text-error-red px-4 py-3 rounded-button">
                {apiError}
              </div>
            )}

            {/* Email */}
            <Input
              label="Email"
              type="email"
              placeholder="john@example.com"
              error={errors.email?.message}
              {...register('email')}
            />

            {/* Password */}
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register('password')}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              fullWidth
              isLoading={isSubmitting}
            >
              Sign In
            </Button>

            {/* Register Link */}
            <div className="text-center">
              <p className="text-body-sm text-slate-gray">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="text-royal-blue font-semibold hover:underline"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-body-sm text-slate-gray">
            Modern invoice management for professionals
          </p>
        </div>
      </div>
    </div>
  );
};
