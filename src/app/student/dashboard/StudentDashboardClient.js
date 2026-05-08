'use client';

import Link from 'next/link';
import CountUp from 'react-countup';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { Briefcase, Clock, Star, ArrowRight, FileText, CheckCircle2, Wallet, Mail, Sparkles, ChevronRight, User } from 'lucide-react';

function AIMatchBar({ score }) {
  if (score == null) return null;
  const pct = Math.min(100, Math.max(0, score));
  let color = '#22c55e';
  let bg = '#cbf4c9';
  if (pct < 50) { color = '#ef4444'; bg = '#ffd3cf'; }
  else if (pct < 75) { color = '#f59e0b'; bg = '#f8e5b9'; }

  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-16 rounded-full bg-[#eeebea] overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-[12px] font-semibold tabular-nums" style={{ color }}>
        {pct}%
      </span>
    </div>
  );
}

const statusConfig = {
  pending:  { bg: '#f8e5b9', text: '#78350f', dot: '#f59e0b', label: 'Pending' },
  accepted: { bg: '#cbf4c9', text: '#14532d', dot: '#22c55e', label: 'Accepted' },
  rejected: { bg: '#ffd3cf', text: '#b91c1c', dot: '#ef4444', label: 'Rejected' },
};

export function StudentDashboardClient({ proposals, availableProjects, session, invitationCount = 0 }) {
  const isMobile = useIsMobile();
  const pendingCount = proposals.filter((p) => p.status === 'pending').length;
  const acceptedCount = proposals.filter((p) => p.status === 'accepted').length;

  return (
    <div className="container mx-auto py-12 px-4 md:px-8 max-w-7xl">
      {/* Header */}
      <div className={`flex ${isMobile ? 'flex-col gap-6' : 'justify-between items-end'} mb-14`}>
        <div className="space-y-3">
          <div className="inline-flex items-center px-4 py-2 bg-[#cedefd] text-[#181717] rounded-full text-[13px] font-medium">
            <Sparkles className="h-4 w-4 mr-2" />
            Student Portal
          </div>
          <h1 className="text-4xl md:text-[48px] font-medium text-[#181717] tracking-tight leading-none">
            Welcome Back
          </h1>
          <p className="text-[16px] text-[#666666] font-normal max-w-md leading-relaxed">
            Manage your proposals and track your freelance career.
          </p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <Link
            href="/student/invitations"
            className="btn-pill-2 flex items-center h-[52px] relative"
          >
            <Mail className="mr-2 h-5 w-5" />
            Invitations
            {invitationCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-[#d04841] text-white text-[11px] font-semibold flex items-center justify-center shadow-sm">
                {invitationCount}
              </span>
            )}
          </Link>
          <Link
            href="/student/profile"
            className="btn-ghost flex items-center h-[52px]"
          >
            <User className="mr-2 h-5 w-5" />
            Profile
          </Link>
          <Link
            href="/student/wallet"
            className="btn-ghost flex items-center h-[52px]"
          >
            <Wallet className="mr-2 h-5 w-5" />
            Wallet
          </Link>
          <Link
            href="/projects"
            className="btn-filled-2 flex items-center h-[52px]"
          >
            <Briefcase className="mr-2 h-5 w-5" />
            Find Work
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
        {/* Pending Proposals */}
        <div className="bg-white p-6 rounded-[24px] border border-border/10 hover:border-border/30 hover:shadow-md hover:shadow-[#2e2d2d]/5 transition-all duration-300">
          <div className="flex items-center gap-3 mb-5">
            <div className="h-10 w-10 rounded-xl bg-[#f8e5b9] flex items-center justify-center">
              <Clock className="h-5 w-5 text-[#d97706]" />
            </div>
            <p className="text-[14px] font-medium text-[#666666] leading-tight">
              Pending<br />Proposals
            </p>
          </div>
          <p className="text-[40px] font-medium text-[#181717] leading-none tabular-nums">
            <CountUp end={pendingCount} duration={1.5} />
          </p>
        </div>

        {/* Accepted Projects */}
        <div className="bg-white p-6 rounded-[24px] border border-border/10 hover:border-border/30 hover:shadow-md hover:shadow-[#2e2d2d]/5 transition-all duration-300">
          <div className="flex items-center gap-3 mb-5">
            <div className="h-10 w-10 rounded-xl bg-[#cbf4c9] flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5 text-[#166534]" />
            </div>
            <p className="text-[14px] font-medium text-[#666666] leading-tight">
              Accepted<br />Projects
            </p>
          </div>
          <p className="text-[40px] font-medium text-[#181717] leading-none tabular-nums">
            <CountUp end={acceptedCount} duration={1.5} />
          </p>
        </div>

        {/* Open Projects */}
        <div className="bg-white p-6 rounded-[24px] border border-border/10 hover:border-border/30 hover:shadow-md hover:shadow-[#2e2d2d]/5 transition-all duration-300">
          <div className="flex items-center gap-3 mb-5">
            <div className="h-10 w-10 rounded-xl bg-[#cedefd] flex items-center justify-center">
              <Briefcase className="h-5 w-5 text-[#5a82de]" />
            </div>
            <p className="text-[14px] font-medium text-[#666666] leading-tight">
              Open<br />Projects
            </p>
          </div>
          <p className="text-[40px] font-medium text-[#181717] leading-none tabular-nums">
            <CountUp end={availableProjects.length} duration={1.5} />
          </p>
        </div>

        {/* Reliability Score - dark card */}
        <div className="group relative bg-[#2e2d2d] p-6 rounded-[24px] overflow-hidden hover:shadow-xl hover:shadow-[#2e2d2d]/20 transition-all duration-300">
          <div className="absolute top-0 right-0 w-28 h-28 bg-[#5a82de]/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
          <div className="relative">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-10 w-10 rounded-xl bg-[#5a82de]/20 flex items-center justify-center">
                <Star className="h-5 w-5 text-[#93c5fd]" />
              </div>
              <p className="text-[14px] font-medium text-[#a8a29e] leading-tight">
                Reliability<br />Score
              </p>
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-[40px] font-medium text-white leading-none tabular-nums">
                <CountUp end={session.reliabilityScore || 0} duration={1.5} />
              </p>
              <span className="text-[#a8a29e] font-medium text-[15px]">/ 100</span>
            </div>
          </div>
        </div>
      </div>

      {/* Proposals List */}
      <div className="space-y-5">
        <div className="flex justify-between items-center pb-2">
          <h2 className="text-[28px] font-medium tracking-tight text-[#181717]">
            Recent Proposals
          </h2>
          <span className="text-[14px] text-[#666666] font-medium">
            {proposals.length} proposal{proposals.length !== 1 ? 's' : ''}
          </span>
        </div>

        {proposals.length === 0 ? (
          <div className="text-center py-24 px-4 bg-white border border-border/10 rounded-[32px]">
            <div className="h-16 w-16 bg-[#f9f7f6] rounded-full border border-border/10 flex items-center justify-center mx-auto mb-6">
              <FileText className="h-8 w-8 text-[#666666]" />
            </div>
            <h3 className="text-[20px] font-medium mb-3 text-[#181717]">No proposals yet</h3>
            <p className="text-[#666666] mb-8 max-w-md mx-auto font-normal text-[15px] leading-relaxed">
              Your freelance journey starts here. Browse open projects and submit your first proposal to get hired.
            </p>
            <Link
              href="/projects"
              className="btn-filled-2 inline-flex items-center justify-center"
            >
              Explore Projects
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        ) : (
          <div className="grid gap-3">
            {proposals.slice(0, 10).map((proposal, index) => {
              const config = statusConfig[proposal.status] || statusConfig.pending;
              return (
                <div
                  key={proposal._id}
                  className="group relative flex flex-col md:flex-row items-start md:items-center justify-between p-6 rounded-[20px] border border-border/10 bg-white hover:border-border/30 hover:shadow-md hover:shadow-[#2e2d2d]/5 transition-all duration-300 gap-4"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Left accent */}
                  <div className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 w-1 h-10 rounded-r-full" style={{ backgroundColor: config.dot }} />

                  <div className="min-w-0 flex-1 pl-0 md:pl-4">
                    <Link
                      href={`/projects/${proposal.projectId?._id}`}
                      className="text-[17px] font-medium text-[#181717] hover:text-primary transition-colors line-clamp-1 mb-2 block"
                    >
                      {proposal.projectId?.title || 'Unknown Project'}
                    </Link>
                    <p className="text-[14px] text-[#666666] line-clamp-2 font-normal leading-relaxed">
                      {proposal.coverLetter}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 w-full md:w-auto justify-between md:justify-end">
                    {proposal.aiScore != null && (
                      <AIMatchBar score={proposal.aiScore} />
                    )}
                    <span
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold tracking-wide"
                      style={{ backgroundColor: config.bg, color: config.text }}
                    >
                      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: config.dot }} />
                      {config.label}
                    </span>
                    <Link
                      href={`/projects/${proposal.projectId?._id}`}
                      className="p-2 rounded-xl hover:bg-[#f9f7f6] text-[#999] hover:text-[#181717] transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
