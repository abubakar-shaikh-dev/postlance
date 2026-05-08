import { verifySession } from '@/lib/dal';
import { getStudentProposals } from '@/lib/actions/proposals';
import { getProjects } from '@/lib/actions/projects';
import { getInvitationCount } from '@/lib/actions/invitations';
import { redirect } from 'next/navigation';
import { StudentDashboardClient } from './StudentDashboardClient';

export default async function StudentDashboardPage() {
  const session = await verifySession();
  if (session.role !== 'student') redirect('/client/dashboard');

  const [proposals, availableProjects, invitationCount] = await Promise.all([
    getStudentProposals(),
    getProjects({ status: 'open' }),
    getInvitationCount(),
  ]);

  return (
    <StudentDashboardClient
      proposals={proposals}
      availableProjects={availableProjects}
      session={session}
      invitationCount={invitationCount}
    />
  );
}
