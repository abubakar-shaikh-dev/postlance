'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createProject } from '@/lib/actions/projects';
import { projectSchema } from '@/lib/validations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { X, Plus, ArrowLeft, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function CreateProjectForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState('');
  const [skillInput, setSkillInput] = useState('');
  const form = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: '',
      description: '',
      skillsRequired: [],
      budget: '',
      deadline: '',
    },
  });

  const skills = form.watch('skillsRequired');

  const onSubmit = async (data) => {
    setServerError('');
    const result = await createProject(data);
    if (result?.message) {
      setServerError(result.message);
    }
    if (result?.errors) {
      Object.entries(result.errors).forEach(([field, messages]) => {
        form.setError(field, { message: messages[0] });
      });
    }
  };

  const addSkill = () => {
    const trimmed = skillInput.trim();
    const currentSkills = form.getValues('skillsRequired') || [];
    if (trimmed && !currentSkills.includes(trimmed)) {
      form.setValue('skillsRequired', [...currentSkills, trimmed], { shouldValidate: true });
    }
    setSkillInput('');
  };

  const removeSkill = (index) => {
    const currentSkills = form.getValues('skillsRequired') || [];
    form.setValue('skillsRequired', currentSkills.filter((_, i) => i !== index), { shouldValidate: true });
  };

  return (
    <div className="w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border/10">
            <div className="flex items-center gap-4">
              <button 
                type="button" 
                onClick={() => router.back()}
                className="p-2 -ml-2 rounded-full hover:bg-black/5 transition-colors text-[#666666] hover:text-[#181717]"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-3xl font-medium text-[#181717]">Post a New Project</h1>
                <p className="text-[15px] text-[#666666] mt-1">Describe what you need done and who you&apos;re looking for.</p>
              </div>
            </div>
            
            <button 
              type="submit" 
              className="btn-filled-2 px-8 py-3 h-12 flex items-center justify-center shrink-0 w-full md:w-auto text-[15px]"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Posting...
                </>
              ) : (
                'Post Project'
              )}
            </button>
          </div>

          {serverError && (
            <div className="p-4 text-[15px] font-medium text-destructive bg-[#ffd3cf] rounded-xl">
              {serverError}
            </div>
          )}

          <div className="bg-white rounded-[32px] p-8 md:p-12 border border-border/20 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              
              <div className="space-y-8">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[16px] font-medium text-[#181717]">Project Title</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g. Mobile App UI Design" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[16px] font-medium text-[#181717]">Description</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Describe the project, deliverables, and any specific requirements..."
                          className="min-h-[200px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-8">
                <div className="space-y-3">
                  <FormLabel className="text-[16px] font-medium text-[#181717]">Skills Required</FormLabel>
                  <div className="flex gap-2">
                    <Input
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      placeholder="e.g. React, Python"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') { e.preventDefault(); addSkill(); }
                      }}
                    />
                    <button 
                      type="button" 
                      onClick={addSkill}
                      className="bg-[#eeebea] text-[#181717] hover:bg-black/10 px-4 rounded-xl flex items-center justify-center transition-colors"
                    >
                      <Plus className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {skills.map((skill, index) => (
                      <div key={`${skill}-${index}`} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#eeebea] text-[#181717] text-[14px] font-medium">
                        {skill}
                        <button type="button" onClick={() => removeSkill(index)} className="hover:text-destructive transition-colors">
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  {form.formState.errors.skillsRequired?.message && (
                    <p className="text-sm font-medium text-destructive">{form.formState.errors.skillsRequired.message}</p>
                  )}
                </div>

                <FormField
                  control={form.control}
                  name="budget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[16px] font-medium text-[#181717]">Budget (INR)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#666666] font-medium">₹</span>
                          <Input {...field} type="number" min="1" placeholder="5000" className="pl-8" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="deadline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[16px] font-medium text-[#181717]">Project Deadline</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input {...field} type="date" className="appearance-none" min={new Date(Date.now() + 86400000).toISOString().split('T')[0]} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
