'use client';

// React & Hooks
import { useState } from 'react';
import { useForm } from 'react-hook-form';

// Utils & Libs
import { zodResolver } from '@hookform/resolvers/zod';
import { login } from '@/lib/actions/auth';
import { loginSchema } from '@/lib/validations';

// Components
import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';

// Icons
import { Loader2, Eye, EyeOff, ChevronDown } from 'lucide-react';

export function LoginForm() {
  const [serverError, setServerError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showRoleSelect, setShowRoleSelect] = useState(false);
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', role: '' },
  });

  const onSubmit = async (data) => {
    setServerError('');
    // Only include role if the user has explicitly selected one
    const submitData = { ...data };
    if (!showRoleSelect || !submitData.role) {
      delete submitData.role;
    }
    const result = await login(submitData);
    if (result?.message) {
      setServerError(result.message);
    }
    if (result?.errors) {
      Object.entries(result.errors).forEach(([field, messages]) => {
        form.setError(field, { message: messages[0] });
      });
    }
  };

  return (
    <div className="w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 flex flex-col gap-0">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-[#181717] font-medium text-[15px]">Email address</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    type="email" 
                    placeholder="you@example.com" 
                    disabled={form.formState.isSubmitting}
                    className="h-12 rounded-xl border-border/20 bg-[#f9f7f6] focus-visible:bg-white transition-colors text-[15px]"
                  />
                </FormControl>
                <FormMessage className="text-sm font-medium text-destructive" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <div className="flex items-center justify-between">
                  <FormLabel className="text-[#181717] font-medium text-[15px]">Password</FormLabel>
                  <a href="#" className="text-[13px] font-medium text-[#d04841] hover:text-[#d04841]/80 transition-colors">
                    Forgot password?
                  </a>
                </div>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      disabled={form.formState.isSubmitting}
                      className="pr-10 h-12 rounded-xl border-border/20 bg-[#f9f7f6] focus-visible:bg-white transition-colors text-[15px]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={form.formState.isSubmitting}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666666] hover:text-[#181717] transition-colors disabled:opacity-50"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage className="text-sm font-medium text-destructive" />
              </FormItem>
            )}
          />

          {/* Optional role selector for multi-role accounts */}
          <div>
            {!showRoleSelect ? (
              <button
                type="button"
                onClick={() => setShowRoleSelect(true)}
                className="text-[13px] font-medium text-[#5a82de] hover:text-[#5a82de]/80 transition-colors cursor-pointer"
              >
                Have multiple roles? Select which role to sign in as →
              </button>
            ) : (
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem className="space-y-2 animate-fade-in-up">
                    <FormLabel className="text-[#181717] font-medium text-[15px]">Sign in as</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <select
                          {...field}
                          value={field.value || ''}
                          onChange={(e) => field.onChange(e.target.value || undefined)}
                          disabled={form.formState.isSubmitting}
                          className="flex h-12 w-full appearance-none rounded-xl border border-transparent bg-[#f9f7f6] px-4 py-1 text-[15px] hover:bg-[#eeebea] focus-visible:outline-none focus-visible:bg-white focus-visible:ring-1 focus-visible:ring-border/20 transition-colors cursor-pointer disabled:opacity-50 text-[#181717]"
                        >
                          <option value="">Auto-detect (last used role)</option>
                          <option value="student">Student</option>
                          <option value="client">Client</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center px-2 text-[#666666]">
                          <ChevronDown className="h-4 w-4" />
                        </div>
                      </div>
                    </FormControl>
                    <p className="text-[12px] text-[#666666]">
                      If your account has both roles, you can choose which one to use.
                    </p>
                    <FormMessage className="text-sm font-medium text-destructive" />
                  </FormItem>
                )}
              />
            )}
          </div>

          {serverError && (
            <div className="p-3 text-[14px] font-medium text-[#d04841] bg-[#ffd3cf] rounded-xl flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d04841] shrink-0" />
              {serverError}
            </div>
          )}

          <button
            type="submit"
            className="w-full h-12 text-[16px] font-medium btn-filled-2 flex items-center justify-center mt-2 group"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>
      </Form>
    </div>
  );
}
