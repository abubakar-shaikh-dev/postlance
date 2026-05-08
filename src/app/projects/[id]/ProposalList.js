import { getProposalsForProject } from '@/lib/actions/proposals';
import { ProposalCard } from '@/components/proposals/ProposalCard';

export async function ProposalList({ projectId }) {
  const proposals = await getProposalsForProject(projectId);

  if (!proposals?.length) {
    return (
      <div>
        <h2 className="text-[24px] font-medium text-[#181717] mb-6">Proposals</h2>
        <p className="text-[15px] text-[#666666] bg-white border border-border/10 rounded-[24px] p-8 text-center">
          No proposals yet. Share your project link to attract students.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-[24px] font-medium text-[#181717] mb-6">
        Proposals ({proposals.length})
      </h2>
      <div className="space-y-3">
        {proposals.map((proposal) => (
          <ProposalCard key={proposal._id} proposal={proposal} />
        ))}
      </div>
    </div>
  );
}
