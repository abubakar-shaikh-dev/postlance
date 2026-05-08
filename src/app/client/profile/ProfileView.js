'use client';

import Link from 'next/link';
import Avvvatars from 'avvvatars-react';
import {
  Star, Calendar, Edit3,
  Briefcase, CheckCircle2, Clock,
} from 'lucide-react';

export function ClientProfileView({ profile, activeProjects, completedProjects, totalProjects }) {
  const identifier = profile?.email || profile?.name || 'user';
  const name = profile?.name || 'Client';
  const bio = profile?.bio || '';
  const skills = profile?.skills || [];
  const phone = profile?.phone || '';
  const memberSince = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' })
    : null;

  return (
    <div className="space-y-8">
      {/* Profile Header Card */}
      <div className="bg-white rounded-[32px] border border-border/10 p-8 md:p-10 overflow-hidden relative">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#d04841]/60 via-[#d04841] to-[#5a82de]/60" />

        <div className="flex flex-col sm:flex-row items-start gap-6">
          <div className="shrink-0">
            <Avvvatars value={identifier} size={80} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-[32px] font-medium text-[#181717] tracking-tight">{name}</h1>
                <p className="text-[#666666] text-[16px] mt-0.5">{profile?.email}</p>
              </div>

              <Link
                href="/client/profile/edit"
                className="btn-pill-2 h-[42px] inline-flex items-center gap-2"
              >
                <Edit3 className="h-4 w-4" />
                Edit Profile
              </Link>
            </div>

            {bio && (
              <p className="text-[15px] text-[#666666] leading-relaxed mt-4 max-w-2xl">
                {bio}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-4 mt-4">
              {memberSince && (
                <div className="flex items-center gap-1.5 text-[14px] text-[#666666]">
                  <Calendar className="h-4 w-4 text-[#d04841]" />
                  <span>Member since {memberSince}</span>
                </div>
              )}
              {phone && (
                <div className="flex items-center gap-1.5 text-[14px] text-[#666666]">
                  <span className="h-4 w-4 flex items-center justify-center text-[#d04841] text-[12px]">&#9990;</span>
                  <span>{phone}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-[24px] border border-border/10">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#cedefd] flex items-center justify-center">
              <Briefcase className="h-5 w-5 text-[#5a82de]" />
            </div>
            <div>
              <p className="text-[24px] font-semibold text-[#181717] leading-none">{totalProjects}</p>
              <p className="text-[13px] text-[#666666] font-medium mt-0.5">Total Hires</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[24px] border border-border/10">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#f8e5b9] flex items-center justify-center">
              <Clock className="h-5 w-5 text-[#d97706]" />
            </div>
            <div>
              <p className="text-[24px] font-semibold text-[#181717] leading-none">{activeProjects}</p>
              <p className="text-[13px] text-[#666666] font-medium mt-0.5">Active Projects</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[24px] border border-border/10">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#cbf4c9] flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5 text-[#166534]" />
            </div>
            <div>
              <p className="text-[24px] font-semibold text-[#181717] leading-none">{completedProjects}</p>
              <p className="text-[13px] text-[#666666] font-medium mt-0.5">Completed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Skills / Expertise */}
      {skills.length > 0 && (
        <div className="bg-white rounded-[24px] border border-border/10 p-8">
          <h2 className="text-[20px] font-medium text-[#181717] mb-5">Industry & Expertise</h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1.5 rounded-lg bg-[#f9f7f6] text-[#181717] text-[14px] font-medium border border-[#eeebea]"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!bio && !skills.length && (
        <div className="bg-white rounded-[24px] border border-border/10 p-12 text-center">
          <div className="h-14 w-14 bg-[#f9f7f6] rounded-full flex items-center justify-center mx-auto mb-4">
            <Edit3 className="h-7 w-7 text-[#666666]" />
          </div>
          <h3 className="text-[18px] font-medium text-[#181717] mb-2">Complete Your Profile</h3>
          <p className="text-[14px] text-[#666666] mb-6 max-w-md mx-auto leading-relaxed">
            Add your bio and expertise to build trust with freelancers and get better proposals.
          </p>
          <Link
            href="/client/profile/edit"
            className="btn-filled-2 inline-flex items-center gap-2"
          >
            <Edit3 className="h-4 w-4" />
            Edit Profile
          </Link>
        </div>
      )}
    </div>
  );
}
