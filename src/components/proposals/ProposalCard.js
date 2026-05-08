'use client';

import { useFormStatus } from 'react-dom';
import { reviewProposal } from '@/lib/actions/proposals';
import { Button } from '@/components/ui/button';
import Avvvatars from 'avvvatars-react';
import { Check, X, IndianRupee, Star, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export function ProposalCard({ proposal }) {
  const student = proposal.studentId || {};

  const statusStyles = {
    pending: 'bg-[#eeebea] text-[#666666]',
    accepted: 'bg-[#cbf4c9] text-[#181717]',
    rejected: 'bg-[#ffd3cf] text-[#d04841]',
  };

  const studentIdentifier = student.email || student.name || student._id || 'unknown';

  const handleAccept = async () => {
    const result = await reviewProposal(proposal._id, 'accepted');
    if (result?.success) {
      toast.success(result.message || 'Proposal accepted.');
    } else {
      toast.error(result?.message || 'Failed to accept proposal.');
    }
  };

  const handleReject = async () => {
    const result = await reviewProposal(proposal._id, 'rejected');
    if (result?.success) {
      toast.success(result.message || 'Proposal declined.');
    } else {
      toast.error(result?.message || 'Failed to decline proposal.');
    }
  };

  return (
    <div className="w-full flex flex-col p-8 rounded-2xl bg-white border border-border/20 transition-all duration-300 hover:border-border/50 hover:shadow-sm">
      <div className="flex flex-col sm:flex-row gap-6 items-start">
        <div className="mt-1 shrink-0">
          <Avvvatars value={studentIdentifier} size={56} />
        </div>

        <div className="flex-1 min-w-0 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="font-medium text-xl text-[#181717]">{student.name || 'Student'}</h3>
              <span className={cn(
                "px-3 py-1 rounded-full text-[12px] font-medium tracking-wide",
                statusStyles[proposal.status]
              )}>
                {proposal.status}
              </span>
              
              {student.reliabilityScore > 0 && (
                <div className="flex items-center gap-1 px-3 py-1 rounded bg-[#cedefd] text-[#181717] text-[13px] font-medium">
                  <Star className="h-3.5 w-3.5 text-[#5a82de] fill-current" />
                  <span>{student.reliabilityScore}/100</span>
                </div>
              )}
              {proposal.aiScore != null && (
                <div className="flex items-center gap-1 px-3 py-1 rounded bg-[#efddfd] text-[#181717] text-[13px] font-medium">
                  <span className="font-bold">AI Match:</span> {proposal.aiScore}%
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-4 text-[14px] bg-[#f9f7f6] px-4 py-2 rounded-full shrink-0">
              <span className="flex items-center gap-1.5 text-[#181717] font-medium">
                <IndianRupee className="h-4 w-4 text-[#5a82de]" />
                {proposal.proposedBudget}
              </span>
              <div className="w-[1px] h-3 bg-[#2e2d2d]/20" />
              <span className="flex items-center gap-1.5 text-[#666666]">
                <Clock className="h-4 w-4" />
                {proposal.estimatedDuration || 'N/A'}
              </span>
            </div>
          </div>

          {student.skills?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-5">
              {student.skills.slice(0, 5).map((skill) => (
                <span key={skill} className="px-3 py-1 rounded text-[13px] font-medium bg-[#eeebea] text-[#181717]">
                  {skill}
                </span>
              ))}
            </div>
          )}

          <p className="text-[15px] text-[#181717] leading-relaxed font-normal whitespace-pre-wrap pl-5 border-l-4 border-[#eeebea]">
            {proposal.coverLetter}
          </p>

          {proposal.status === 'pending' && (
            <div className="flex items-center gap-3 mt-8 pt-6 border-t border-[#eeebea]">
              <form action={handleAccept} className="flex-1 sm:flex-none">
                <ReviewButton status="accepted" />
              </form>
              <form action={handleReject} className="flex-1 sm:flex-none">
                <ReviewButton status="rejected" />
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ReviewButton({ status }) {
  const { pending } = useFormStatus();

  if (status === 'accepted') {
    return (
      <button 
        type="submit" 
        disabled={pending}
        className="w-full sm:w-auto flex items-center justify-center rounded-2xl bg-primary text-white px-6 py-3 text-[15px] font-medium hover:bg-[#b83b34] transition-colors"
      >
        <Check className="mr-2 h-5 w-5" />
        Accept Proposal
      </button>
    );
  }

  return (
    <button 
      type="submit" 
      disabled={pending}
      className="w-full sm:w-auto flex items-center justify-center rounded-2xl bg-white text-[#2e2d2d] border border-[#eeebea] px-6 py-3 text-[15px] font-medium hover:bg-gray-50 transition-colors"
    >
      <X className="mr-2 h-5 w-5" />
      Decline
    </button>
  );
}
