'use client';

import Link from 'next/link';
import { useState, useTransition } from 'react';
import CountUp from 'react-countup';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { deleteProject, updateProjectStatus } from '@/lib/actions/projects';
import { toast } from 'sonner';
import {
  Briefcase, Plus, Clock, FileText, BarChart3, Wallet, Users,
  ChevronRight, User, Circle, Trash2, Edit, Loader2, AlertTriangle,
  MoreHorizontal, X, Check
} from 'lucide-react';

export function ClientDashboardClient({ projects, proposalCounts }) {
  const isMobile = useIsMobile();

  const openProjects = projects.filter((p) => p.status === 'open');
  const inProgressProjects = projects.filter((p) => p.status === 'in_progress');
  const totalProposals = Object.values(proposalCounts).reduce((a, b) => a + b, 0);

  const statusConfig = {
    open:        { bg: '#cbf4c9', text: '#14532d', dot: '#22c55e' },
    in_progress: { bg: '#cedefd', text: '#1e3a5f', dot: '#3b82f6' },
    completed:   { bg: '#eeebea', text: '#666666', dot: '#a8a29e' },
    cancelled:   { bg: '#ffd3cf', text: '#b91c1c', dot: '#ef4444' },
  };

  const statusLabel = {
    open: 'Open',
    in_progress: 'In Progress',
    completed: 'Completed',
    cancelled: 'Cancelled',
  };

  const [activeTab, setActiveTab] = useState('all');

  const tabs = [
    { id: 'all', label: 'All Projects', count: projects.length },
    { id: 'open', label: 'Open', count: openProjects.length },
    { id: 'in_progress', label: 'In Progress', count: inProgressProjects.length },
    { id: 'completed', label: 'Completed', count: projects.filter(p => p.status === 'completed').length },
    { id: 'cancelled', label: 'Cancelled', count: projects.filter(p => p.status === 'cancelled').length },
  ];

  const filteredProjects = activeTab === 'all'
    ? projects
    : projects.filter((p) => p.status === activeTab);

  return (
    <div className="w-full mx-auto py-12 px-4 md:px-8 max-w-7xl">
      {/* Header */}
      <div className={`flex ${isMobile ? 'flex-col gap-6' : 'justify-between items-end'} mb-14`}>
        <div className="space-y-3">
          <h1 className="text-4xl md:text-[48px] font-medium text-[#181717] tracking-tight leading-none">
            My Jobs
          </h1>
          <p className="text-[16px] text-[#666666] font-normal max-w-md leading-relaxed">
            Manage your projects, track proposals, and keep everything organized.
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
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-14">
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

        <div className="group bg-white p-8 rounded-[24px] border border-border/10 hover:border-border/30 hover:shadow-md hover:shadow-[#2e2d2d]/5 transition-all duration-300">
          <div className="flex items-center gap-4 mb-5">
            <div className="h-12 w-12 rounded-xl bg-[#cbf4c9] flex items-center justify-center">
              <Circle className="h-5 w-5 text-[#166534]" />
            </div>
            <p className="text-[15px] font-medium text-[#666666] leading-tight">
              Open<br />Projects
            </p>
          </div>
          <p className="text-[48px] font-medium text-[#181717] leading-none tabular-nums">
            <CountUp end={openProjects.length} duration={1.5} />
          </p>
        </div>

        <div className="group bg-white p-8 rounded-[24px] border border-border/10 hover:border-border/30 hover:shadow-md hover:shadow-[#2e2d2d]/5 transition-all duration-300">
          <div className="flex items-center gap-4 mb-5">
            <div className="h-12 w-12 rounded-xl bg-[#cedefd] flex items-center justify-center">
              <Clock className="h-5 w-5 text-[#5a82de]" />
            </div>
            <p className="text-[15px] font-medium text-[#666666] leading-tight">
              In<br />Progress
            </p>
          </div>
          <p className="text-[48px] font-medium text-[#181717] leading-none tabular-nums">
            <CountUp end={inProgressProjects.length} duration={1.5} />
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

      {/* Tab Navigation */}
      <div className="flex items-center gap-1 mb-8 overflow-x-auto pb-2 scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-full text-[14px] font-medium transition-all whitespace-nowrap cursor-pointer ${
              activeTab === tab.id
                ? 'bg-[#181717] text-white'
                : 'bg-transparent text-[#666666] hover:bg-[#eeebea] hover:text-[#181717]'
            }`}
          >
            {tab.label}
            {tab.count > 0 && (
              <span className={`ml-2 px-1.5 py-0.5 rounded text-[11px] font-semibold ${
                activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-[#eeebea] text-[#666666]'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Project List */}
      <div className="space-y-5">
        <div className="flex justify-between items-center pb-2">
          <h2 className="text-[28px] font-medium tracking-tight text-[#181717]">
            {activeTab === 'all' ? 'All Projects' : `${statusLabel[activeTab] || 'Projects'}`}
          </h2>
          <span className="text-[14px] text-[#666666] font-medium">
            {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''}
          </span>
        </div>

        {filteredProjects.length === 0 ? (
          <div className="text-center py-24 px-4 bg-white border border-border/10 rounded-[32px]">
            <div className="h-16 w-16 bg-[#f9f7f6] rounded-full border border-border/10 flex items-center justify-center mx-auto mb-6">
              <Briefcase className="h-8 w-8 text-[#666666]" />
            </div>
            <h3 className="text-[20px] font-medium mb-3 text-[#181717]">
              {activeTab === 'all' ? 'No projects posted yet' : `No ${statusLabel[activeTab]?.toLowerCase() || ''} projects`}
            </h3>
            <p className="text-[#666666] mb-8 max-w-md mx-auto font-normal text-[15px] leading-relaxed">
              {activeTab === 'all'
                ? 'Ready to find great talent? Post your first project and let students submit their proposals.'
                : `You don't have any projects with this status yet.`
              }
            </p>
            {activeTab === 'all' && (
              <Link
                href="/projects/new"
                className="btn-filled-2 inline-flex items-center justify-center"
              >
                <Plus className="mr-2 h-5 w-5" />
                Post a Project
              </Link>
            )}
          </div>
        ) : (
          <div className="grid gap-3">
            {filteredProjects.map((project) => (
              <ProjectRow
                key={project._id}
                project={project}
                config={statusConfig[project.status]}
                statusLabel={statusLabel[project.status]}
                proposalCount={proposalCounts[project._id] || 0}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Individual Project Row with CRUD Actions ─── */
function ProjectRow({ project, config, statusLabel, proposalCount }) {
  const [showConfirm, setShowConfirm] = useState(null); // 'delete' | 'cancel' | null
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await deleteProject(project._id);
        toast.success('Project deleted successfully');
      } catch (error) {
        toast.error(error.message || 'Failed to delete project');
      }
      setShowConfirm(null);
    });
  };

  const handleCancel = () => {
    startTransition(async () => {
      try {
        await updateProjectStatus(project._id, 'cancelled');
        toast.success('Project cancelled');
      } catch (error) {
        toast.error(error.message || 'Failed to cancel project');
      }
      setShowConfirm(null);
    });
  };

  const canEdit = project.status === 'open';
  const canDelete = project.status !== 'in_progress' && project.status !== 'completed';
  const canCancel = project.status === 'open';

  return (
    <div className="group relative flex flex-col lg:flex-row items-start lg:items-center justify-between p-6 rounded-[20px] border border-border/10 bg-white hover:border-border/30 hover:shadow-md hover:shadow-[#2e2d2d]/5 transition-all duration-300 gap-5">
      <div className="flex-1 min-w-0">
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
            {statusLabel}
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
          {proposalCount > 0 && (
            <>
              <span className="w-1 h-1 rounded-full bg-[#d6d3d1]" />
              <span className="flex items-center gap-1">
                <FileText className="h-3.5 w-3.5 text-[#5a82de]" />
                {proposalCount} proposal{proposalCount !== 1 ? 's' : ''}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto pt-4 lg:pt-0 border-t border-border/10 lg:border-t-0">
        {/* Confirmation overlay */}
        {showConfirm && (
          <div className="flex items-center gap-2 mr-2 animate-fade-in-up">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#ffd3cf] text-[#d04841]">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-[13px] font-medium">
                {showConfirm === 'delete' ? 'Delete project & proposals?' : 'Cancel this project?'}
              </span>
            </div>
            <button
              onClick={showConfirm === 'delete' ? handleDelete : handleCancel}
              disabled={isPending}
              className="h-8 px-3 rounded-lg bg-[#d04841] text-white text-[13px] font-medium hover:bg-[#b83b34] transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
              Confirm
            </button>
            <button
              onClick={() => setShowConfirm(null)}
              disabled={isPending}
              className="h-8 px-3 rounded-lg bg-[#eeebea] text-[#666666] text-[13px] font-medium hover:bg-black/10 transition-colors flex items-center cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {!showConfirm && (
          <>
            <Link
              href={`/projects/${project._id}`}
              className="btn-pill-2 h-[38px] inline-flex items-center text-[13px]"
            >
              View
              <ChevronRight className="ml-0.5 h-3.5 w-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
            </Link>

            {canEdit && (
              <Link
                href={`/projects/${project._id}/edit`}
                className="h-[38px] px-3 rounded-full border border-[#eeebea] text-[#666666] text-[13px] font-medium inline-flex items-center gap-1.5 hover:bg-[#f9f7f6] hover:text-[#181717] transition-colors"
              >
                <Edit className="h-3.5 w-3.5" />
                Edit
              </Link>
            )}

            <Link
              href={`/projects/${project._id}/evaluations`}
              className="h-[38px] px-3 rounded-full bg-[#1f1e1e] text-white text-[13px] font-medium inline-flex items-center gap-1.5 hover:bg-black transition-colors"
            >
              <BarChart3 className="h-3.5 w-3.5" />
              AI Eval
            </Link>

            {canCancel && (
              <button
                onClick={() => setShowConfirm('cancel')}
                className="h-[38px] px-3 rounded-full border border-[#ffd3cf] text-[#d04841] text-[13px] font-medium inline-flex items-center gap-1.5 hover:bg-[#ffd3cf]/30 transition-colors cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
                Cancel
              </button>
            )}

            {canDelete && (
              <button
                onClick={() => setShowConfirm('delete')}
                className="h-[38px] w-[38px] rounded-full border border-[#ffd3cf] text-[#d04841] inline-flex items-center justify-center hover:bg-[#ffd3cf]/30 transition-colors cursor-pointer"
                title="Delete project"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
