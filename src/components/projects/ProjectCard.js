import Link from 'next/link';
import { Calendar, IndianRupee, ArrowUpRight } from 'lucide-react';

function formatDateSafe(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
}

export function ProjectCard({ project, hasApplied }) {
  const deadlineMs = new Date(project.deadline).getTime();
  const isUrgent = deadlineMs - Date.now() < 3 * 24 * 60 * 60 * 1000 && deadlineMs > Date.now();

  return (
    <Link href={`/projects/${project._id}`} className="block h-full outline-none">
      <div className="h-full flex flex-col justify-between p-8 rounded-2xl transition-all duration-300 bg-white border border-border/20 hover:border-border/50 hover:shadow-sm cursor-pointer relative group">

        <div className="space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-3">
              {(isUrgent || hasApplied) && (
              <div className="flex items-center gap-2">
                {isUrgent && (
                  <span className="px-2 py-0.5 rounded-full bg-[#ffd3cf] text-[#d04841] text-[11px] font-medium tracking-wide">
                    Urgent
                  </span>
                )}
                {hasApplied && (
                  <span className="px-2 py-0.5 rounded-full bg-[#cedefd] text-[#181717] text-[11px] font-medium tracking-wide">
                    Applied
                  </span>
                )}
              </div>
              )}
              <h3 className="text-2xl font-medium text-[#181717] group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                {project.title}
              </h3>
            </div>
            
            <div className="w-8 h-8 flex items-center justify-center opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-300 shrink-0">
              <ArrowUpRight className="h-5 w-5 text-primary" />
            </div>
          </div>
          
          <p className="text-[15px] text-[#666666] line-clamp-2 leading-relaxed font-normal">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-2">
            {project.skillsRequired?.slice(0, 4).map((skill) => (
              <span key={skill} className="px-3 py-1 rounded bg-[#eeebea] text-[#181717] text-[13px] font-medium">
                {skill}
              </span>
            ))}
            {project.skillsRequired?.length > 4 && (
              <span className="px-3 py-1 rounded bg-transparent text-[#666666] border border-[#eeebea] text-[13px] font-medium">
                +{project.skillsRequired.length - 4}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between pt-6 mt-6 border-t border-[#eeebea]">
          <div className="flex items-center gap-1.5 text-[#181717]">
            <IndianRupee className="h-5 w-5 text-[#5a82de]" />
            <span className="font-medium text-[15px]">{project.budget}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#666666] text-[14px]">
            <Calendar className="h-4 w-4" />
            <span>{formatDateSafe(project.deadline)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
