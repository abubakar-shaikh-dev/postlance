import { getProfile } from '@/lib/actions/profile';
import { ProfileForm } from '@/components/profile/ProfileForm';

export const metadata = {
  title: 'Edit Profile - PostLance',
};

export default async function EditProfilePage() {
  const profile = await getProfile();

  return (
    <div className="w-full py-12 px-4 md:px-8 max-w-7xl mx-auto">
      <ProfileForm profile={profile} />
    </div>
  );
}
