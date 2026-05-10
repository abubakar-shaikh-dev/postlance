import { getProfile } from '@/lib/actions/profile';
import { getStudentProposals } from '@/lib/actions/proposals';
import { ProfileView } from './ProfileView';

export const metadata = {
  title: 'My Profile - PostLance',
};

export default async function StudentProfilePage() {
  const [profile, proposals] = await Promise.all([
    getProfile(),
    getStudentProposals(),
  ]);

  const acceptedCount = proposals.filter((p) => p.status === 'accepted').length;
  const totalProposals = proposals.length;

  return (
    <div className="w-full mx-auto py-12 px-4 md:px-8 max-w-7xl">
      <ProfileView profile={profile} acceptedCount={acceptedCount} totalProposals={totalProposals} />
    </div>
  );
}
