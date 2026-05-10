import { getProjectById } from '@/lib/actions/projects';
import { verifySession } from '@/lib/dal';
import { redirect } from 'next/navigation';
import { EditProjectForm } from './EditProjectForm';

export default async function EditProjectPage({ params }) {
  const session = await verifySession();
  
  if (!session || session.role !== 'client') {
    redirect('/login');
  }

  const project = await getProjectById(params.id);

  if (!project) {
    redirect('/projects');
  }

  if (project.clientId._id.toString() !== session.userId) {
    redirect('/projects');
  }

  if (project.status !== 'open') {
    redirect(`/projects/${project._id}`);
  }

  return (
    <div className="w-full max-w-7xl mx-auto py-12 px-4 md:px-8">
      <EditProjectForm project={project} />
    </div>
  );
}
