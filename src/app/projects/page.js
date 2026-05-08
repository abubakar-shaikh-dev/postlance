import { getProjects } from '@/lib/actions/projects';
import { getStudentProposals } from '@/lib/actions/proposals';
import { getSession } from '@/lib/dal';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { ProjectFilters } from './ProjectFilters';

export const metadata = {
  title: 'Browse Projects - PostLance',
};

export default async function ProjectsPage({ searchParams }) {
  const { search, skills } = await searchParams;
  const filters = {};
  if (search) filters.search = search;
  if (skills) filters.skills = skills.split(',');

  const projects = await getProjects({ ...filters, status: 'open' });

  const session = await getSession();
  let appliedProjectIds = [];
  if (session?.role === 'student') {
    const proposals = await getStudentProposals();
    appliedProjectIds = proposals.map(p => p.projectId?._id ? p.projectId._id.toString() : p.projectId?.toString());
  }

  return (
    <div className="w-full py-12 px-4 md:px-12 max-w-7xl mx-auto">
      <div className="flex flex-col gap-6 mb-10 pb-8 border-b border-border/10">
        <div>
          <h1 className="text-4xl md:text-[48px] font-medium text-[#181717] tracking-tight leading-tight mb-2">Browse Projects</h1>
          <p className="text-[16px] text-[#666666]">Discover and apply for open student freelance projects.</p>
        </div>
        <ProjectFilters />
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 mt-6">
        {projects.map((project) => (
          <ProjectCard key={project._id} project={project} hasApplied={appliedProjectIds.includes(project._id.toString())} />
        ))}
        {projects.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center p-16 bg-white border border-border/10 rounded-[32px] text-center">
            <h3 className="text-[20px] font-medium text-[#181717] mb-2">No projects found</h3>
            <p className="text-[15px] text-[#666666]">Try adjusting your search filters to find more projects.</p>
          </div>
        )}
      </div>
    </div>
  );
}
