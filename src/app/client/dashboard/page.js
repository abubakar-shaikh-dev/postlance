import { verifySession } from '@/lib/dal';
import { connectDB } from '@/lib/db';
import Project from '@/lib/models/Project';
import Proposal from '@/lib/models/Proposal';
import { redirect } from 'next/navigation';
import { ClientDashboardClient } from './ClientDashboardClient';

export default async function ClientDashboardPage() {
  const session = await verifySession();
  if (session.role !== 'client') redirect('/student/dashboard');

  await connectDB();

  const [projects, proposalCounts] = await Promise.all([
    Project.find({ clientId: session.userId })
      .sort({ createdAt: -1 })
      .lean(),
    Proposal.aggregate([
      { $match: { projectId: { $exists: true } } },
      { $group: { _id: '$projectId', count: { $sum: 1 } } },
    ]),
  ]);

  const countsMap = {};
  proposalCounts.forEach((pc) => {
    countsMap[pc._id.toString()] = pc.count;
  });

  return (
    <ClientDashboardClient
      projects={JSON.parse(JSON.stringify(projects))}
      proposalCounts={countsMap}
    />
  );
}
