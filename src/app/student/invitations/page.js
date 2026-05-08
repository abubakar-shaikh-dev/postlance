import { verifySession } from '@/lib/dal';
import { getStudentInvitations } from '@/lib/actions/invitations';
import { redirect } from 'next/navigation';
import { InvitationsClient } from './InvitationsClient';

export default async function InvitationsPage() {
  const session = await verifySession();
  if (session.role !== 'student') redirect('/client/dashboard');

  const invitations = await getStudentInvitations();

  return <InvitationsClient invitations={invitations} />;
}
