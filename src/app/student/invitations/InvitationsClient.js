'use client';

import { useState } from 'react';
import Avvvatars from 'avvvatars-react';
import { respondToInvitation } from '@/lib/actions/invitations';
import { toast } from 'sonner';
import { Mail, Check, X, Clock, Briefcase, IndianRupee, Calendar, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export function InvitationsClient({ invitations: initial }) {
  const [invitations, setInvitations] = useState(initial);
  const [loading, setLoading] = useState(null);

  const pending = invitations.filter((i) => i.status === 'pending');
  const responded = invitations.filter((i) => i.status !== 'pending');

  const handleRespond = async (id, status) => {
    setLoading(id);
    const result = await respondToInvitation(id, status);
    if (result.success) {
      setInvitations((prev) =>
        prev.map((i) => (i._id === id ? { ...i, status } : i))
      );
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
    setLoading(null);
  };

  return (
    <div className="container mx-auto py-12 px-4 md:px-8 max-w-5xl">
      <div className="mb-12">
        <div className="inline-flex items-center px-4 py-2 bg-[#efddfd] text-[#181717] rounded text-[13px] font-medium mb-4">
          <Mail className="h-4 w-4 mr-2" />
          Invitations
        </div>
        <h1 className="text-4xl md:text-[48px] font-medium text-[#181717] tracking-tight">
          Project Invitations
        </h1>
        <p className="text-[16px] text-[#666666] mt-2">
          Clients have invited you to apply for their projects.
        </p>
      </div>

      {/* Pending */}
      {pending.length > 0 && (
        <div className="mb-12">
          <h2 className="text-[20px] font-medium text-[#181717] mb-4">
            Pending ({pending.length})
          </h2>
          <div className="space-y-4">
            {pending.map((inv) => {
              const project = inv.projectId || {};
              const client = inv.clientId || {};
              const clientId = client.email || client.name || client._id || 'unknown';

              return (
                <div
                  key={inv._id}
                  className="bg-white rounded-[24px] border border-[#d04841]/10 p-6 hover:border-[#d04841]/20 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-4 min-w-0">
                      <Avvvatars value={clientId} size={44} />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Link
                            href={`/projects/${project._id}`}
                            className="text-[18px] font-medium text-[#181717] hover:text-[#d04841] transition-colors truncate"
                          >
                            {project.title || 'Project'}
                          </Link>
                          <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#eeebea] text-[#666666] shrink-0">
                            <Clock className="h-3 w-3 inline mr-1" />
                            {new Date(inv.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        </div>
                        <p className="text-[14px] text-[#666666]">
                          {client.name || 'Client'} invited you
                          {inv.message ? ` — "${inv.message}"` : ''}
                        </p>
                        <div className="flex items-center gap-3 mt-2 text-[13px] text-[#666666]">
                          <span className="flex items-center gap-1">
                            <IndianRupee className="h-3.5 w-3.5" />
                            {project.budget}
                          </span>
                          {project.deadline && (
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5" />
                              {new Date(project.deadline).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                              })}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <button
                        onClick={() => handleRespond(inv._id, 'declined')}
                        disabled={loading === inv._id}
                        className="h-10 px-4 rounded-xl border border-border/20 text-[13px] font-medium text-[#666666] hover:bg-[#f9f7f6] transition-colors disabled:opacity-50"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleRespond(inv._id, 'accepted')}
                        disabled={loading === inv._id}
                        className="btn-filled-2 h-10 px-5 flex items-center gap-2 text-[13px] disabled:opacity-50"
                      >
                        <Check className="h-4 w-4" />
                        Accept & Apply
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Responded */}
      {responded.length > 0 && (
        <div>
          <h2 className="text-[20px] font-medium text-[#181717] mb-4">
            Responded ({responded.length})
          </h2>
          <div className="space-y-3">
            {responded.map((inv) => {
              const project = inv.projectId || {};
              const client = inv.clientId || {};
              const clientId = client.email || client.name || client._id || 'unknown';

              return (
                <div
                  key={inv._id}
                  className="bg-white rounded-[24px] border border-border/10 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 opacity-60"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Avvvatars value={clientId} size={36} />
                    <div className="min-w-0">
                      <p className="text-[15px] font-medium text-[#181717] truncate">
                        {project.title || 'Project'}
                      </p>
                      <p className="text-[13px] text-[#666666]">
                        {client.name || 'Client'} · {inv.status === 'accepted' ? 'Accepted' : 'Declined'}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded text-[12px] font-medium tracking-wide shrink-0 ${
                      inv.status === 'accepted'
                        ? 'bg-[#cbf4c9] text-[#181717]'
                        : 'bg-[#ffd3cf] text-[#d04841]'
                    }`}
                  >
                    {inv.status === 'accepted' ? 'Accepted' : 'Declined'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {invitations.length === 0 && (
        <div className="text-center py-24 px-4 bg-white border border-border/10 rounded-[32px]">
          <div className="h-16 w-16 bg-[#f9f7f6] rounded-full border border-border/10 flex items-center justify-center mx-auto mb-6">
            <Mail className="h-8 w-8 text-[#666666]" />
          </div>
          <h3 className="text-[20px] font-medium mb-3 text-[#181717]">No invitations yet</h3>
          <p className="text-[#666666] max-w-md mx-auto font-normal text-[15px] leading-relaxed">
            When a client invites you to their project, it will appear here.
          </p>
        </div>
      )}
    </div>
  );
}
