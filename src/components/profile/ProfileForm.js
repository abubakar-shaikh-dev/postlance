'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateProfile } from '@/lib/actions/profile';
import { profileSchema } from '@/lib/validations';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { X, Plus, Trash2, ArrowLeft, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export function ProfileForm({ profile }) {
  const router = useRouter();
  const [serverError, setServerError] = useState('');
  const [skillInput, setSkillInput] = useState('');
  const [linkInput, setLinkInput] = useState('');

  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: profile?.name || '',
      bio: profile?.bio || '',
      skills: profile?.skills || [],
      education: profile?.education || '',
      university: profile?.university || '',
      portfolioLinks: profile?.portfolioLinks || [],
      phone: profile?.phone || '',
    },
  });

  const skills = form.watch('skills');
  const portfolioLinks = form.watch('portfolioLinks');

  const onSubmit = async (data) => {
    setServerError('');
    const result = await updateProfile(data);
    if (result?.success) {
      toast.success(result.message);
      router.back();
    } else if (result?.message) {
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
    const currentSkills = form.getValues('skills') || [];
    if (trimmed && !currentSkills.includes(trimmed)) {
      form.setValue('skills', [...currentSkills, trimmed], { shouldValidate: true });
    }
    setSkillInput('');
  };

  const removeSkill = (index) => {
    const currentSkills = form.getValues('skills') || [];
    form.setValue('skills', currentSkills.filter((_, i) => i !== index), { shouldValidate: true });
  };

  const addLink = () => {
    const trimmed = linkInput.trim();
    if (!trimmed) return;
    const currentLinks = form.getValues('portfolioLinks') || [];
    if (currentLinks.includes(trimmed)) {
      setServerError('This link has already been added');
      return;
    }
    try {
      new URL(trimmed);
      form.setValue('portfolioLinks', [...currentLinks, trimmed], { shouldValidate: true });
      setLinkInput('');
      setServerError('');
    } catch {
      setServerError('Please enter a valid URL');
    }
  };

  const removeLink = (index) => {
    const currentLinks = form.getValues('portfolioLinks') || [];
    form.setValue('portfolioLinks', currentLinks.filter((_, i) => i !== index), { shouldValidate: true });
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
                <h1 className="text-3xl font-medium text-[#181717]">Edit Profile</h1>
                <p className="text-[15px] text-[#666666] mt-1">Update your profile information.</p>
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
                  Saving...
                </>
              ) : (
                'Save Profile'
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

              {/* Left Column */}
              <div className="space-y-8">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[16px] font-medium text-[#181717]">Full Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g. John Doe" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[16px] font-medium text-[#181717]">Bio</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Tell others about yourself..."
                          className="min-h-[160px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Phone */}
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[16px] font-medium text-[#181717]">
                        WhatsApp Phone
                      </FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="+919876543210" />
                      </FormControl>
                      <p className="text-[12px] text-[#666666] mt-1">
                        For WhatsApp notifications. Include country code.
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Right Column */}
              <div className="space-y-8">
                {/* Skills */}
                <div className="space-y-3">
                  <FormLabel className="text-[16px] font-medium text-[#181717]">Skills</FormLabel>
                  <div className="flex gap-2">
                    <Input
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      placeholder="e.g. React, Figma"
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
                  {form.formState.errors.skills?.message && (
                    <p className="text-sm font-medium text-destructive">{form.formState.errors.skills.message}</p>
                  )}
                </div>

                {/* Education */}
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="education"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[16px] font-medium text-[#181717]">Education</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g. B.S. Computer Science" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="university"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[16px] font-medium text-[#181717]">University</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g. MIT" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Links */}
                <div className="space-y-3">
                  <FormLabel className="text-[16px] font-medium text-[#181717]">Portfolio Links</FormLabel>
                  <div className="flex gap-2">
                    <Input
                      value={linkInput}
                      onChange={(e) => setLinkInput(e.target.value)}
                      placeholder="https://github.com/you"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') { e.preventDefault(); addLink(); }
                      }}
                    />
                    <button
                      type="button"
                      onClick={addLink}
                      className="bg-[#eeebea] text-[#181717] hover:bg-black/10 px-4 rounded-xl flex items-center justify-center transition-colors"
                    >
                      <Plus className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="space-y-2 pt-2">
                    {portfolioLinks.map((link, index) => (
                      <div key={`${link}-${index}`} className="flex items-center gap-2 text-[14px] text-[#666666] bg-[#f9f7f6] px-4 py-2 rounded-xl">
                        <span className="truncate flex-1">{link}</span>
                        <button type="button" onClick={() => removeLink(index)} className="hover:text-destructive text-[#181717] transition-colors p-1 rounded-full hover:bg-black/5">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  {form.formState.errors.portfolioLinks?.message && (
                    <p className="text-sm font-medium text-destructive">{form.formState.errors.portfolioLinks.message}</p>
                  )}
                </div>

              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
