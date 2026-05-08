import { getEvaluations } from '@/lib/actions/evaluate';
import { getProjectById } from '@/lib/actions/projects';
import { getSession } from '@/lib/dal';
import { notFound } from 'next/navigation';
import { EvaluateButton } from './EvaluateButton';
import { EvaluationCard } from './EvaluationCard';
import Link from 'next/link';
import { ArrowLeft, Sparkles, BarChart3, Users } from 'lucide-react';

export const metadata = {
  title: 'AI Applicant Evaluation - PostLance',
};

export default async function EvaluationsPage({ params }) {
  const { id } = await params;
  const project = await getProjectById(id);
  if (!project) notFound();

  const session = await getSession();
  const evaluations = await getEvaluations(id);

  const pendingCount = evaluations.filter((p) => p.status === 'pending').length;
  const hiredCount = evaluations.filter((p) => p.status === 'accepted').length;

  return (
    <div className="container mx-auto py-12 px-4 md:px-8 max-w-5xl">
      <div className="mb-4">
        <Link
          href={`/projects/${id}`}
          className="inline-flex items-center gap-1.5 text-[14px] font-medium text-[#666666] hover:text-[#181717] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Project
        </Link>
      </div>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10 pb-8 border-b border-border/10">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#efddfd] text-[#181717] rounded text-[13px] font-medium">
            <Sparkles className="h-4 w-4" />
            AI-Powered Ranking
          </div>
          <h1 className="text-4xl md:text-[48px] font-medium text-[#181717] tracking-tight leading-tight">
            Applicant Rankings
          </h1>
          <p className="text-[16px] text-[#666666]">{project.title}</p>
        </div>
        <EvaluateButton projectId={id} />
      </div>

      {evaluations.length === 0 ? (
        <div className="text-center py-24 px-4 bg-white border border-border/10 rounded-[32px]">
          <div className="h-16 w-16 bg-[#f9f7f6] rounded-full border border-border/10 flex items-center justify-center mx-auto mb-6">
            <Sparkles className="h-8 w-8 text-[#666666]" />
          </div>
          <h3 className="text-[20px] font-medium mb-3 text-[#181717]">No evaluations yet</h3>
          <p className="text-[#666666] max-w-md mx-auto font-normal text-[15px] leading-relaxed">
            Run the AI evaluation to score and rank applicants based on skills, experience, and proposal quality.
          </p>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-6 mb-6">
            <div className="flex items-center gap-2 text-[14px] font-medium text-[#666666]">
              <Users className="h-4 w-4" />
              <span>{evaluations.length} applicant{evaluations.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center gap-2 text-[14px] font-medium text-[#666666]">
              <BarChart3 className="h-4 w-4" />
              <span>{pendingCount} pending</span>
            </div>
            {hiredCount > 0 && (
              <div className="flex items-center gap-2 text-[14px] font-medium text-[#cbf4c9]">
                <span className="w-2 h-2 rounded-full bg-[#cbf4c9]" />
                <span>{hiredCount} hired</span>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {evaluations.map((proposal, index) => (
              <EvaluationCard
                key={proposal._id}
                proposal={proposal}
                rank={index + 1}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
