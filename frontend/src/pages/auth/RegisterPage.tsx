/**
 * Register Page Component
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '../../store/authStore';
import { Button, Input, Card } from '../../components/common';

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  password_confirm: z.string().min(1, 'Please confirm your password'),
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  business_name: z.string().optional(),
  phone: z.string().optional(),
}).refine((data) => data.password === data.password_confirm, {
  message: "Passwords don't match",
  path: ['password_confirm'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register: registerUser } = useAuthStore();
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setApiError(null);
    try {
      await registerUser(data);
      navigate('/dashboard');
    } catch (error: any) {
      const errorMsg = error.response?.data?.email?.[0] || error.response?.data?.detail || 'Registration failed';
      setApiError(errorMsg);
    }
  };

  return (
    <div className="min-h-screen bg-soft-gray flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full animate-slide-up">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-deep-navy mb-2">InvoiceFlow</h1>
          <p className="text-slate-gray">Create your account</p>
        </div>

        <Card>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* API Error */}
            {apiError && (
              <div className="bg-error-red bg-opacity-10 border border-error-red text-error-red px-4 py-3 rounded-button">
                {apiError}
              </div>
            )}

            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                placeholder="John"
                error={errors.first_name?.message}
                {...register('first_name')}
                required
              />
              <Input
                label="Last Name"
                placeholder="Doe"
                error={errors.last_name?.message}
                {...register('last_name')}
                required
              />
            </div>

            {/* Email */}
            <Input
              label="Email"
              type="email"
              placeholder="john@example.com"
              error={errors.email?.message}
              {...register('email')}
              required
            />

            {/* Business Name */}
            <Input
              label="Business Name"
              placeholder="John's Consulting (optional)"
              error={errors.business_name?.message}
              {...register('business_name')}
            />

            {/* Phone */}
            <Input
              label="Phone"
              type="tel"
              placeholder="+1 (555) 123-4567 (optional)"
              error={errors.phone?.message}
              {...register('phone')}
            />

            {/* Password */}
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              helperText="At least 8 characters"
              {...register('password')}
              required
            />

            {/* Confirm Password */}
            <Input
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              error={errors.password_confirm?.message}
              {...register('password_confirm')}
              required
            />

            {/* Submit Button */}
            <Button
              type="submit"
              fullWidth
              isLoading={isSubmitting}
            >
              Create Account
            </Button>

            {/* Login Link */}
            <div className="text-center">
              <p className="text-body-sm text-slate-gray">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="text-royal-blue font-semibold hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-body-sm text-slate-gray">
            By creating an account, you agree to our Terms of Service
          </p>
        </div>
      </div>
    </div>
  );
};
