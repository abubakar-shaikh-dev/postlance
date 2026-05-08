import { getSession } from '@/lib/dal';
import { getStudentsForDiscovery, getClientOpenProjects } from '@/lib/actions/invitations';
import { FindTalentClient } from './FindTalentClient';
import { redirect } from 'next/navigation';

export default async function FindTalentPage() {
  const session = await getSession();
  if (!session) redirect('/login');

  const [students, openProjects] = await Promise.all([
    getStudentsForDiscovery(),
    session.role === 'client' ? getClientOpenProjects() : [],
  ]);

  return (
    <FindTalentClient
      students={students}
      openProjects={openProjects}
      role={session.role}
    />
  );
}
