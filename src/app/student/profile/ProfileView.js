'use client';

import Link from 'next/link';
import Avvvatars from 'avvvatars-react';
import {
  Star, GraduationCap, Globe, MapPin, Calendar, Edit3,
  Briefcase, CheckCircle2, FileText, ExternalLink, Mail,
} from 'lucide-react';

export function ProfileView({ profile, acceptedCount, totalProposals }) {
  const identifier = profile?.email || profile?.name || 'user';
  const name = profile?.name || 'Student';
  const bio = profile?.bio || '';
  const education = profile?.education || '';
  const university = profile?.university || '';
  const skills = profile?.skills || [];
  const portfolioLinks = profile?.portfolioLinks || [];
  const score = profile?.reliabilityScore || 0;
  const memberSince = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' })
    : null;

  return (
    <div className="space-y-8">
      {/* Profile Header Card */}
      <div className="bg-white rounded-[32px] border border-border/10 p-8 md:p-10 overflow-hidden relative">
        {/* Subtle top gradient bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#5a82de]/60 via-[#5a82de] to-[#d04841]/60" />

        <div className="flex flex-col sm:flex-row items-start gap-6">
          <div className="relative shrink-0">
            <Avvvatars value={identifier} size={80} />
            <div className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-[#cbf4c9] border-2 border-white flex items-center justify-center">
              <Star className="h-3.5 w-3.5 text-[#14532d]" fill="currentColor" />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-[32px] font-medium text-[#181717] tracking-tight">{name}</h1>
                <p className="text-[#666666] text-[16px] mt-0.5">{profile?.email}</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#efddfd] text-[#181717] text-[14px] font-semibold">
                  <Star className="h-4 w-4" fill="currentColor" />
                  {score}/100 Reliability
                </div>
                <Link
                  href="/student/profile/edit"
                  className="btn-pill-2 h-[42px] inline-flex items-center gap-2"
                >
                  <Edit3 className="h-4 w-4" />
                  Edit Profile
                </Link>
              </div>
            </div>

            {bio && (
              <p className="text-[15px] text-[#666666] leading-relaxed mt-4 max-w-2xl">
                {bio}
              </p>
            )}

            {/* Meta chips */}
            <div className="flex flex-wrap items-center gap-4 mt-4">
              {(education || university) && (
                <div className="flex items-center gap-1.5 text-[14px] text-[#666666]">
                  <GraduationCap className="h-4 w-4 text-[#5a82de]" />
                  <span>{[education, university].filter(Boolean).join(', ')}</span>
                </div>
              )}
              {memberSince && (
                <div className="flex items-center gap-1.5 text-[14px] text-[#666666]">
                  <Calendar className="h-4 w-4 text-[#5a82de]" />
                  <span>Member since {memberSince}</span>
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
            <div className="h-10 w-10 rounded-xl bg-[#cbf4c9] flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5 text-[#166534]" />
            </div>
            <div>
              <p className="text-[24px] font-semibold text-[#181717] leading-none">{acceptedCount}</p>
              <p className="text-[13px] text-[#666666] font-medium mt-0.5">Accepted Projects</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[24px] border border-border/10">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#cedefd] flex items-center justify-center">
              <FileText className="h-5 w-5 text-[#5a82de]" />
            </div>
            <div>
              <p className="text-[24px] font-semibold text-[#181717] leading-none">{totalProposals}</p>
              <p className="text-[13px] text-[#666666] font-medium mt-0.5">Total Proposals</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[24px] border border-border/10">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#efddfd] flex items-center justify-center">
              <Star className="h-5 w-5 text-[#7c3aed]" fill="currentColor" />
            </div>
            <div>
              <p className="text-[24px] font-semibold text-[#181717] leading-none">{score}/100</p>
              <p className="text-[13px] text-[#666666] font-medium mt-0.5">Reliability Score</p>
            </div>
          </div>
        </div>
      </div>

      {/* Skills */}
      {skills.length > 0 && (
        <div className="bg-white rounded-[24px] border border-border/10 p-8">
          <h2 className="text-[20px] font-medium text-[#181717] mb-5">Skills</h2>
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

      {/* Portfolio Links */}
      {portfolioLinks.length > 0 && (
        <div className="bg-white rounded-[24px] border border-border/10 p-8">
          <h2 className="text-[20px] font-medium text-[#181717] mb-5">Portfolio Links</h2>
          <div className="grid gap-2">
            {portfolioLinks.map((link) => (
              <a
                key={link}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl bg-[#f9f7f6] text-[#181717] text-[14px] font-medium hover:bg-[#eeebea] transition-colors group"
              >
                <Globe className="h-4 w-4 text-[#5a82de] shrink-0" />
                <span className="truncate flex-1">{link}</span>
                <ExternalLink className="h-4 w-4 text-[#999] opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Empty state for incomplete profile */}
      {!bio && !skills.length && !portfolioLinks.length && (
        <div className="bg-white rounded-[24px] border border-border/10 p-12 text-center">
          <div className="h-14 w-14 bg-[#f9f7f6] rounded-full flex items-center justify-center mx-auto mb-4">
            <Edit3 className="h-7 w-7 text-[#666666]" />
          </div>
          <h3 className="text-[18px] font-medium text-[#181717] mb-2">Complete Your Profile</h3>
          <p className="text-[14px] text-[#666666] mb-6 max-w-md mx-auto leading-relaxed">
            Add your bio, skills, and portfolio links to help clients discover you and increase your chances of getting hired.
          </p>
          <Link
            href="/student/profile/edit"
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
