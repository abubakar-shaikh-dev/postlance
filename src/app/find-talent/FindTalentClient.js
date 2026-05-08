'use client';

import { useState, useMemo } from 'react';
import Avvvatars from 'avvvatars-react';
import { Search, Star, Award, Briefcase, GraduationCap, Sparkles, X, Send, Users, MapPin } from 'lucide-react';
import { inviteStudent } from '@/lib/actions/invitations';
import { toast } from 'sonner';
import { SKILLS } from '@/lib/constants';

function getScoreColor(score) {
  if (score >= 80) return { bg: '#cbf4c9', text: '#14532d', ring: '#86efac' };
  if (score >= 60) return { bg: '#cedefd', text: '#1e3a5f', ring: '#93c5fd' };
  if (score >= 40) return { bg: '#f8e5b9', text: '#78350f', ring: '#fcd34d' };
  return { bg: '#eeebea', text: '#666666', ring: '#d6d3d1' };
}

function StudentCard({ student, role, onInvite, index }) {
  const identifier = student.email || student.name || student._id || 'unknown';
  const skills = student.skills || [];
  const score = student.reliabilityScore || 0;
  const scoreColor = getScoreColor(score);

  return (
    <div
      className="group relative bg-white rounded-[24px] border border-border/10 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#2e2d2d]/6 hover:border-border/30"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Subtle top accent */}
      <div
        className="absolute top-0 left-6 right-6 h-[3px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `linear-gradient(90deg, ${scoreColor.ring}, transparent)` }}
      />

      {/* Header: Avatar + Name + Score */}
      <div className="flex items-start gap-4 mb-4">
        <div className="relative shrink-0">
          <Avvvatars value={identifier} size={52} />
          <div
            className="absolute -bottom-0.5 -right-0.5 h-5 w-5 rounded-full border-2 border-white flex items-center justify-center"
            style={{ backgroundColor: scoreColor.bg }}
          >
            <Star className="h-2.5 w-2.5" style={{ color: scoreColor.text }} fill="currentColor" />
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="text-[18px] font-medium text-[#181717] truncate leading-tight">
            {student.name || 'Student'}
          </h3>
          {student.education ? (
            <p className="text-[13px] text-[#666666] flex items-center gap-1 mt-0.5">
              <GraduationCap className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{student.education}</span>
            </p>
          ) : (
            <p className="text-[13px] text-[#666666] mt-0.5">Student</p>
          )}
        </div>

        {/* Score badge */}
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full shrink-0 text-[13px] font-semibold tabular-nums"
          style={{ backgroundColor: scoreColor.bg, color: scoreColor.text }}
        >
          <Star className="h-3.5 w-3.5" fill="currentColor" />
          {score}
        </div>
      </div>

      {/* Bio */}
      {student.bio && (
        <p className="text-[14px] text-[#666666] leading-relaxed mb-4 line-clamp-2">
          {student.bio}
        </p>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-5">
          {skills.slice(0, 5).map((s) => (
            <span
              key={s}
              className="px-2.5 py-1 rounded-lg bg-[#f9f7f6] text-[#181717] text-[12px] font-medium border border-transparent hover:border-border/20 hover:bg-[#eeebea] transition-colors cursor-default"
            >
              {s}
            </span>
          ))}
          {skills.length > 5 && (
            <span className="px-2.5 py-1 rounded-lg text-[#666666] text-[12px] font-medium bg-transparent border border-[#eeebea]">
              +{skills.length - 5} more
            </span>
          )}
        </div>
      )}

      {/* CTA - Always visible */}
      {role === 'client' && (
        <button
          onClick={() => onInvite(student)}
          className="w-full h-10 flex items-center justify-center gap-2 text-[13px] font-medium rounded-full border border-[#eeebea] bg-white text-[#2e2d2d] hover:bg-[#f9f7f6] hover:border-[#d6d3d1] transition-all active:scale-[0.98]"
        >
          <Send className="h-3.5 w-3.5" />
          Invite to Project
        </button>
      )}
    </div>
  );
}

export function FindTalentClient({ students: initialStudents, openProjects, role }) {
  const [search, setSearch] = useState('');
  const [skillFilter, setSkillFilter] = useState('');
  const [inviteTarget, setInviteTarget] = useState(null);
  const [selectedProject, setSelectedProject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const filtered = useMemo(() => {
    let result = initialStudents;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((s) =>
        (s.name || '').toLowerCase().includes(q) ||
        (s.bio || '').toLowerCase().includes(q) ||
        (s.skills || []).some((sk) => sk.toLowerCase().includes(q))
      );
    }
    if (skillFilter) {
      result = result.filter((s) =>
        (s.skills || []).some((sk) => sk.toLowerCase() === skillFilter.toLowerCase())
      );
    }
    return result;
  }, [initialStudents, search, skillFilter]);

  const handleInvite = async () => {
    if (!selectedProject) {
      toast.error('Select a project.');
      return;
    }
    setSending(true);
    const result = await inviteStudent({
      studentId: inviteTarget._id,
      projectId: selectedProject,
      message,
    });
    if (result.success) {
      toast.success(result.message);
      setInviteTarget(null);
      setSelectedProject('');
      setMessage('');
    } else {
      toast.error(result.message);
    }
    setSending(false);
  };

  return (
    <div className="container mx-auto py-12 px-4 md:px-8 max-w-7xl">
      {/* Header */}
      <div className="mb-10">
        <div className="inline-flex items-center px-4 py-2 bg-[#cedefd] text-[#181717] rounded-full text-[13px] font-medium mb-5">
          <Sparkles className="h-4 w-4 mr-2" />
          Talent Pool
        </div>
        <h1 className="text-4xl md:text-[48px] font-medium text-[#181717] tracking-tight leading-none">
          Find Talent
        </h1>
        <p className="text-[16px] text-[#666666] mt-3 max-w-lg leading-relaxed">
          {role === 'client'
            ? 'Discover skilled students and invite them to your projects.'
            : 'Browse talented freelancers on the platform.'}
        </p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1 group/search">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#999] transition-colors group-focus-within/search:text-[#5a82de]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, bio, or skill..."
            className="w-full h-12 pl-11 pr-10 rounded-2xl border border-border/20 bg-white text-[15px] text-[#181717] placeholder:text-[#999] outline-none focus:border-[#5a82de]/40 focus:ring-2 focus:ring-[#5a82de]/10 transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-[#eeebea] text-[#999] hover:text-[#666666] transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <select
          value={skillFilter}
          onChange={(e) => setSkillFilter(e.target.value)}
          className="h-12 px-4 rounded-2xl border border-border/20 bg-white text-[15px] text-[#181717] outline-none focus:border-[#5a82de]/40 focus:ring-2 focus:ring-[#5a82de]/10 transition-all min-w-[160px] cursor-pointer appearance-none bg-no-repeat"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%23666' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10z'/%3E%3C/svg%3E\")", backgroundPosition: "right 16px center" }}
        >
          <option value="">All Skills</option>
          {SKILLS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Results count */}
      <div className="flex items-center gap-2 mb-6 text-[14px] text-[#666666] font-medium">
        <Award className="h-4 w-4" />
        {filtered.length} student{filtered.length !== 1 ? 's' : ''} found
      </div>

      {/* Student Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-24 px-4 bg-white border border-border/10 rounded-[32px]">
          <div className="h-16 w-16 bg-[#f9f7f6] rounded-full border border-border/10 flex items-center justify-center mx-auto mb-6">
            <Users className="h-8 w-8 text-[#666666]" />
          </div>
          <h3 className="text-[20px] font-medium mb-3 text-[#181717]">No students found</h3>
          <p className="text-[#666666] max-w-md mx-auto font-normal text-[15px] leading-relaxed">
            Try adjusting your search or skill filter to find more students.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((student, index) => (
            <StudentCard
              key={student._id}
              student={student}
              role={role}
              onInvite={setInviteTarget}
              index={index}
            />
          ))}
        </div>
      )}

      {/* Invite Modal */}
      {inviteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#181717]/40 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setInviteTarget(null)} />
          <div className="relative bg-white rounded-[32px] border border-border/10 w-full max-w-md p-8 shadow-2xl shadow-[#2e2d2d]/15 animate-in zoom-in-95 fade-in duration-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-[20px] font-medium text-[#181717]">Invite Student</h2>
                <p className="text-[14px] text-[#666666] mt-0.5">
                  {inviteTarget.name}
                </p>
              </div>
              <button
                onClick={() => setInviteTarget(null)}
                className="p-2 rounded-xl hover:bg-[#f9f7f6] text-[#666666] hover:text-[#181717] transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              {openProjects.length === 0 ? (
                <div className="text-center py-8">
                  <div className="h-12 w-12 bg-[#f9f7f6] rounded-full flex items-center justify-center mx-auto mb-3">
                    <Briefcase className="h-6 w-6 text-[#666666]" />
                  </div>
                  <p className="text-[15px] font-medium text-[#181717] mb-1">No open projects</p>
                  <p className="text-[13px] text-[#666666]">
                    You need an open project to invite students to.
                  </p>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-[13px] font-medium text-[#666666] mb-2">
                      Select Project
                    </label>
                    <select
                      value={selectedProject}
                      onChange={(e) => setSelectedProject(e.target.value)}
                      className="w-full h-12 px-4 rounded-xl border border-border/20 bg-[#f9f7f6] text-[15px] font-medium text-[#181717] outline-none focus:border-[#d04841]/40 focus:ring-2 focus:ring-[#d04841]/10 transition-all"
                    >
                      <option value="">Choose a project...</option>
                      {openProjects.map((p) => (
                        <option key={p._id} value={p._id}>
                          {p.title} (₹{p.budget})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[13px] font-medium text-[#666666] mb-2">
                      Message (optional)
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell the student why you're interested..."
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border border-border/20 bg-[#f9f7f6] text-[15px] text-[#181717] placeholder:text-[#999] outline-none focus:border-[#d04841]/40 focus:ring-2 focus:ring-[#d04841]/10 transition-all resize-none"
                    />
                  </div>

                  <button
                    onClick={handleInvite}
                    disabled={sending || !selectedProject}
                    className="btn-filled-2 w-full h-12 text-[15px] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {sending ? 'Sending...' : 'Send Invitation'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
