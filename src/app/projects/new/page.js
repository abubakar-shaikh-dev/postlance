import { CreateProjectForm } from './CreateProjectForm';
import { getSession } from '@/lib/dal';

export const metadata = {
  title: 'Post a Project - PostLance',
};

export default async function NewProjectPage() {
  const session = await getSession();
  
  return (
    <div className="min-h-screen bg-background">
      <main className="w-full py-12 px-4 md:px-8 max-w-7xl mx-auto">
        <CreateProjectForm />
      </main>
    </div>
  );
}
