'use client';

import { reviewProposal } from '@/lib/actions/proposals';
import Avvvatars from 'avvvatars-react';
import { Trophy, Medal, Star, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useState } from 'react';

function RankBadge({ rank }) {
  if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-500" />;
  if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />;
  if (rank === 3) return <Medal className="h-5 w-5 text-amber-600" />;
  return <span className="text-[13px] font-bold text-[#666666]">#{rank}</span>;
}

function ScoreBar({ label, value, max = 100 }) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-[12px] font-medium">
        <span className="text-[#666666]">{label}</span>
        <span className="text-[#181717] tabular-nums">{value}/{max}</span>
      </div>
      <div className="h-1.5 bg-[#eeebea] rounded-full overflow-hidden">
        <div
          className={cn(
            'h-full rounded-full transition-all',
            value >= 80 ? 'bg-[#cbf4c9]' : value >= 60 ? 'bg-[#d04841]' : 'bg-[#ffd3cf]'
          )}
          style={{ width: `${Math.min(value, 100)}%` }}
        />
      </div>
    </div>
  );
}

export function EvaluationCard({ proposal, rank }) {
  const student = proposal.studentId || {};
  const evaluation = proposal.aiEvaluation || {};
  const [expanded, setExpanded] = useState(false);

  const studentIdentifier = student.email || student.name || student._id || 'unknown';

  const handleAccept = async () => {
    const result = await reviewProposal(proposal._id, 'accepted');
    if (result?.message) {
      toast[result.success ? 'success' : 'error'](result.message);
    }
  };

  return (
    <div className={cn(
      'bg-white rounded-[24px] border border-border/10 overflow-hidden transition-all',
      rank === 1 && 'ring-1 ring-[#d04841]/20 shadow-sm'
    )}>
      <div className="p-6 md:p-8">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <div className="flex items-center justify-center w-8 h-8 shrink-0">
              <RankBadge rank={rank} />
            </div>
            <Avvvatars value={studentIdentifier} size={40} />
            <div className="min-w-0">
              <p className="text-[16px] font-medium text-[#181717] truncate">
                {student.name || 'Unknown Student'}
              </p>
              <div className="flex items-center gap-2 text-[13px] text-[#666666] mt-0.5">
                {student.reliabilityScore > 0 && (
                  <span className="flex items-center gap-0.5">
                    <Star className="h-3 w-3 fill-[#d04841] text-[#d04841]" />
                    {student.reliabilityScore}
                  </span>
                )}
                {student.education && (
                  <>
                    {student.reliabilityScore > 0 && <span className="w-1 h-1 rounded-full bg-[#eeebea]" />}
                    <span>{student.education}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="flex flex-col items-center">
              <span className="text-[28px] font-medium text-[#181717] leading-none tabular-nums">
                {evaluation.overallScore ?? '--'}
              </span>
              <span className="text-[11px] text-[#666666] font-medium mt-0.5">SCORE</span>
            </div>

            {proposal.status === 'pending' && (
              <button
                onClick={handleAccept}
                className="btn-filled-2 h-10 px-4 flex items-center gap-2 text-[13px]"
              >
                <Check className="h-4 w-4" />
                Hire
              </button>
            )}
            {proposal.status !== 'pending' && (
              <span className={cn(
                'px-3 py-1 rounded text-[12px] font-medium tracking-wide',
                proposal.status === 'accepted'
                  ? 'bg-[#cbf4c9] text-[#181717]'
                  : 'bg-[#ffd3cf] text-[#d04841]'
              )}>
                {proposal.status === 'accepted' ? 'Hired' : 'Declined'}
              </span>
            )}
          </div>
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1.5 mt-4 text-[13px] font-medium text-[#666666] hover:text-[#181717] transition-colors"
        >
          {expanded ? (
            <><ChevronUp className="h-4 w-4" /> Hide details</>
          ) : (
            <><ChevronDown className="h-4 w-4" /> View details</>
          )}
        </button>

        {expanded && (
          <div className="mt-5 pt-5 border-t border-border/10 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <ScoreBar label="Skill Match" value={evaluation.skillMatch || 0} />
              <ScoreBar label="Portfolio Relevance" value={evaluation.portfolioRelevance || 0} />
              <ScoreBar label="Reliability" value={evaluation.reliabilityScore || 0} />
              <ScoreBar label="Proposal Quality" value={evaluation.proposalQuality || 0} />
              <ScoreBar label="Availability/Budget" value={evaluation.availabilityMatch || 0} />
            </div>

            {evaluation.summary && (
              <div className="bg-[#f9f7f6] rounded-xl p-4">
                <p className="text-[14px] text-[#666666] leading-relaxed">{evaluation.summary}</p>
              </div>
            )}

            {student.skills?.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {student.skills.slice(0, 6).map((skill) => (
                  <span key={skill} className="px-3 py-1 rounded-lg bg-[#eeebea] text-[#181717] text-[13px] font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
