import { getProfile } from '@/lib/actions/profile';
import { getClientProjectsForPayment } from '@/lib/actions/wallet';
import { ClientProfileView } from './ProfileView';

export const metadata = {
  title: 'My Profile - PostLance',
};

export default async function ClientProfilePage() {
  const [profile, projects] = await Promise.all([
    getProfile(),
    getClientProjectsForPayment(),
  ]);

  const activeProjects = projects.filter((p) => p.status === 'in_progress').length;
  const completedProjects = projects.filter((p) => p.status === 'completed').length;

  return (
    <div className="w-full mx-auto py-12 px-4 md:px-8 max-w-7xl">
      <ClientProfileView
        profile={profile}
        activeProjects={activeProjects}
        completedProjects={completedProjects}
        totalProjects={projects.length}
      />
    </div>
  );
}
