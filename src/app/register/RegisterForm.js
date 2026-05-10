'use client';

// React & Hooks
import { useState } from 'react';
import { useForm } from 'react-hook-form';

// Utils & Libs
import { zodResolver } from '@hookform/resolvers/zod';
import { signup } from '@/lib/actions/auth';
import { signupSchema } from '@/lib/validations';

// Components
import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';

// Icons
import { Loader2, Eye, EyeOff, ChevronDown } from 'lucide-react';

export function RegisterForm() {
  const [serverError, setServerError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: '', email: '', password: '', role: '' },
  });

  const onSubmit = async (data) => {
    setServerError('');
    const result = await signup(data);
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="text-[#181717] font-medium text-[14px]">Full Name</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="John Doe" 
                    disabled={form.formState.isSubmitting}
                    className="h-10 rounded-xl border-border/20 bg-[#f9f7f6] focus-visible:bg-white transition-colors text-[14px]"
                  />
                </FormControl>
                <FormMessage className="text-[13px] font-medium text-destructive" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="text-[#181717] font-medium text-[14px]">Email address</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    type="email" 
                    placeholder="you@example.com" 
                    disabled={form.formState.isSubmitting}
                    className="h-10 rounded-xl border-border/20 bg-[#f9f7f6] focus-visible:bg-white transition-colors text-[14px]"
                  />
                </FormControl>
                <FormMessage className="text-[13px] font-medium text-destructive" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="text-[#181717] font-medium text-[14px]">Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      disabled={form.formState.isSubmitting}
                      className="pr-10 h-10 rounded-xl border-border/20 bg-[#f9f7f6] focus-visible:bg-white transition-colors text-[14px]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={form.formState.isSubmitting}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666666] hover:text-[#181717] transition-colors disabled:opacity-50"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage className="text-[13px] font-medium text-destructive" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="text-[#181717] font-medium text-[14px]">I want to...</FormLabel>
                <FormControl>
                  <div className="relative">
                    <select
                      {...field}
                      disabled={form.formState.isSubmitting}
                      className="flex h-10 w-full appearance-none rounded-xl border border-transparent bg-[#f9f7f6] px-4 py-1 text-[14px] hover:bg-[#eeebea] focus-visible:outline-none focus-visible:bg-white focus-visible:ring-1 focus-visible:ring-border/20 transition-colors cursor-pointer disabled:opacity-50 text-[#181717]"
                    >
                      <option value="" disabled hidden>Select your role</option>
                      <option value="student">Find work as a Student</option>
                      <option value="client">Hire talent as a Client</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center px-2 text-[#666666]">
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </div>
                </FormControl>
                <FormMessage className="text-[13px] font-medium text-destructive" />
              </FormItem>
            )}
          />

          {serverError && (
            <div className="p-2.5 text-[13px] font-medium text-[#d04841] bg-[#ffd3cf] rounded-xl flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d04841] shrink-0" />
              {serverError}
            </div>
          )}

          <button
            type="submit"
            className="w-full h-10 text-[15px] font-medium btn-filled-2 flex items-center justify-center mt-1 group"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>
      </Form>
    </div>
  );
}
