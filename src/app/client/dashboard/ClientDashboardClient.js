'use client';

import Link from 'next/link';
import CountUp from 'react-countup';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { Briefcase, Plus, Clock, FileText, BarChart3, Wallet, Users, ArrowRight, Circle, ChevronRight, User } from 'lucide-react';

export function ClientDashboardClient({ projects, proposalCounts }) {
  const isMobile = useIsMobile();

  const openProjects = projects.filter((p) => p.status === 'open');
  const totalProposals = Object.values(proposalCounts).reduce((a, b) => a + b, 0);

  const statusConfig = {
    open:        { bg: '#cbf4c9', text: '#14532d', icon: Circle, dot: '#22c55e' },
    in_progress: { bg: '#cedefd', text: '#1e3a5f', icon: Clock, dot: '#3b82f6' },
    completed:   { bg: '#eeebea', text: '#666666', icon: null, dot: '#a8a29e' },
    cancelled:   { bg: '#ffd3cf', text: '#b91c1c', icon: null, dot: '#ef4444' },
  };

  const statusLabel = {
    open: 'Open',
    in_progress: 'In Progress',
    completed: 'Completed',
    cancelled: 'Cancelled',
  };

  return (
    <div className="w-full mx-auto py-12 px-4 md:px-8 max-w-7xl">
      {/* Header */}
      <div className={`flex ${isMobile ? 'flex-col gap-6' : 'justify-between items-end'} mb-14`}>
        <div className="space-y-3">
          <h1 className="text-4xl md:text-[48px] font-medium text-[#181717] tracking-tight leading-none">
            My Projects
          </h1>
          <p className="text-[16px] text-[#666666] font-normal max-w-md leading-relaxed">
            Manage your open projects and review incoming proposals.
          </p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto flex-wrap">
          <Link
            href="/find-talent"
            className="btn-pill-2 flex items-center h-[52px]"
          >
            <Users className="mr-2 h-5 w-5" />
            Find Talent
          </Link>
          <Link
            href="/projects/new"
            className="btn-filled-2 flex items-center h-[52px]"
          >
            <Plus className="mr-2 h-5 w-5" />
            Post New Project
          </Link>
          <Link
            href="/client/profile"
            className="btn-ghost flex items-center h-[52px]"
          >
            <User className="mr-2 h-5 w-5" />
            Profile
          </Link>
          <Link
            href="/client/wallet"
            className="btn-ghost flex items-center h-[52px]"
          >
            <Wallet className="mr-2 h-5 w-5" />
            Wallet
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-14">
        {/* Total Projects - white card */}
        <div className="group bg-white p-8 rounded-[24px] border border-border/10 hover:border-border/30 hover:shadow-md hover:shadow-[#2e2d2d]/5 transition-all duration-300">
          <div className="flex items-center gap-4 mb-5">
            <div className="h-12 w-12 rounded-xl bg-[#cedefd] flex items-center justify-center">
              <Briefcase className="h-5 w-5 text-[#5a82de]" />
            </div>
            <p className="text-[15px] font-medium text-[#666666] leading-tight">
              Total<br />Projects
            </p>
          </div>
          <p className="text-[48px] font-medium text-[#181717] leading-none tabular-nums">
            <CountUp end={projects.length} duration={1.5} />
          </p>
        </div>

        {/* Active Projects - white card with green accent */}
        <div className="group bg-white p-8 rounded-[24px] border border-border/10 hover:border-border/30 hover:shadow-md hover:shadow-[#2e2d2d]/5 transition-all duration-300">
          <div className="flex items-center gap-4 mb-5">
            <div className="h-12 w-12 rounded-xl bg-[#cbf4c9] flex items-center justify-center">
              <Clock className="h-5 w-5 text-[#166534]" />
            </div>
            <p className="text-[15px] font-medium text-[#666666] leading-tight">
              Active<br />Projects
            </p>
          </div>
          <p className="text-[48px] font-medium text-[#181717] leading-none tabular-nums">
            <CountUp end={openProjects.length} duration={1.5} />
          </p>
        </div>

        {/* Total Proposals - dark card */}
        <div className="group relative bg-[#2e2d2d] p-8 rounded-[24px] overflow-hidden hover:shadow-xl hover:shadow-[#2e2d2d]/20 transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#5a82de]/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
          <div className="relative">
            <div className="flex items-center gap-4 mb-5">
              <div className="h-12 w-12 rounded-xl bg-[#5a82de]/20 flex items-center justify-center">
                <FileText className="h-5 w-5 text-[#93c5fd]" />
              </div>
              <p className="text-[15px] font-medium text-[#a8a29e] leading-tight">
                Total<br />Proposals
              </p>
            </div>
            <p className="text-[48px] font-medium text-white leading-none tabular-nums">
              <CountUp end={totalProposals} duration={1.5} />
            </p>
          </div>
        </div>
      </div>

      {/* Project List */}
      <div className="space-y-5">
        <div className="flex justify-between items-center pb-2">
          <h2 className="text-[28px] font-medium tracking-tight text-[#181717]">
            All Projects
          </h2>
          <span className="text-[14px] text-[#666666] font-medium">
            {projects.length} project{projects.length !== 1 ? 's' : ''}
          </span>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-24 px-4 bg-white border border-border/10 rounded-[32px]">
            <div className="h-16 w-16 bg-[#f9f7f6] rounded-full border border-border/10 flex items-center justify-center mx-auto mb-6">
              <Briefcase className="h-8 w-8 text-[#666666]" />
            </div>
            <h3 className="text-[20px] font-medium mb-3 text-[#181717]">No projects posted yet</h3>
            <p className="text-[#666666] mb-8 max-w-md mx-auto font-normal text-[15px] leading-relaxed">
              Ready to find great talent? Post your first project and let students submit their proposals.
            </p>
            <Link
              href="/projects/new"
              className="btn-filled-2 inline-flex items-center justify-center"
            >
              <Plus className="mr-2 h-5 w-5" />
              Post a Project
            </Link>
          </div>
        ) : (
          <div className="grid gap-3">
            {projects.map((project) => {
              const config = statusConfig[project.status];
              const count = proposalCounts[project._id] || 0;
              return (
                <div
                  key={project._id}
                  className="group flex flex-col lg:flex-row items-start lg:items-center justify-between p-6 rounded-[20px] border border-border/10 bg-white hover:border-border/30 hover:shadow-md hover:shadow-[#2e2d2d]/5 transition-all duration-300 gap-5"
                >
                  {/* Left accent dot */}
                  <div className="hidden lg:block absolute left-0 top-1/2 -translate-y-1/2 w-1 h-10 rounded-r-full" style={{ backgroundColor: config.dot }} />

                  <div className="flex-1 min-w-0 pl-0 lg:pl-4">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <Link
                        href={`/projects/${project._id}`}
                        className="text-[18px] font-medium text-[#181717] hover:text-primary transition-colors line-clamp-1"
                      >
                        {project.title}
                      </Link>
                      <span
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-semibold tracking-wide"
                        style={{ backgroundColor: config.bg, color: config.text }}
                      >
                        <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: config.dot }} />
                        {statusLabel[project.status]}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-[14px] text-[#666666]">
                      <span className="flex items-center gap-1.5 font-medium">
                        <span className="text-[#181717]">Budget:</span> ₹{project.budget?.toLocaleString()}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-[#d6d3d1]" />
                      <span>
                        Due {new Date(project.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto pt-4 lg:pt-0 border-t border-border/10 lg:border-t-0">
                    {count > 0 && (
                      <Link
                        href={`/projects/${project._id}`}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#f9f7f6] text-[13px] font-semibold text-[#181717] hover:bg-[#eeebea] transition-colors"
                      >
                        <FileText className="h-4 w-4 text-[#5a82de]" />
                        {count} proposal{count !== 1 ? 's' : ''}
                      </Link>
                    )}
                    <Link
                      href={`/projects/${project._id}`}
                      className="btn-pill-2 h-[42px] inline-flex items-center"
                    >
                      View Details
                      <ChevronRight className="ml-1 h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </Link>
                    <Link
                      href={`/projects/${project._id}/evaluations`}
                      className="btn-pill h-[42px] inline-flex items-center"
                    >
                      <BarChart3 className="mr-2 h-4 w-4" />
                      AI Evaluation
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
