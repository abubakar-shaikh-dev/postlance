'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { submitProposal } from '@/lib/actions/proposals';
import { proposalSchema } from '@/lib/validations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';

export function ProposalForm({ projectId, onClose }) {
  const [serverError, setServerError] = useState('');
  const form = useForm({
    resolver: zodResolver(proposalSchema),
    defaultValues: {
      coverLetter: '',
      proposedBudget: '',
      estimatedDuration: '',
    },
  });

  const onSubmit = async (data) => {
    setServerError('');
    const result = await submitProposal({ ...data, projectId });
    if (result?.success) {
      toast.success(result.message);
      onClose();
      return;
    }
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="coverLetter"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[15px] font-medium text-[#181717]">Cover Letter</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Explain why you're the right fit for this project. Mention relevant skills, experience, and your approach..."
                  className="min-h-[160px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="proposedBudget"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[15px] font-medium text-[#181717]">Your Rate (₹)</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#666666] font-medium">₹</span>
                    <Input {...field} type="number" placeholder="5000" className="pl-8" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="estimatedDuration"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[15px] font-medium text-[#181717]">Estimated Time</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g. 2 weeks" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {serverError && (
          <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">{serverError}</p>
        )}

        <div className="flex gap-4 justify-end pt-6 border-t border-border/10 mt-8">
          <button type="button" onClick={onClose} className="btn-ghost">
            Cancel
          </button>
          <button type="submit" disabled={form.formState.isSubmitting} className="btn-filled-2">
            {form.formState.isSubmitting ? 'Submitting...' : 'Submit Proposal'}
          </button>
        </div>
      </form>
    </Form>
  );
}
