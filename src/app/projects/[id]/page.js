import { getProjectById } from "@/lib/actions/projects";
import { getStudentProposals } from "@/lib/actions/proposals";
import { getSession } from "@/lib/dal";
import { notFound } from "next/navigation";
import Avvvatars from "avvvatars-react";
import { Calendar, IndianRupee, Clock, User, Send } from "lucide-react";
import { ApplyButton } from "./ApplyButton";
import { ProposalList } from "./ProposalList";
import { StatusDropdown } from "./StatusDropdown";
import { DeleteProjectButton } from "./DeleteProjectButton";
import Link from "next/link";
import { Edit } from "lucide-react";

export default async function ProjectDetailPage({ params }) {
  const { id } = await params;
  const project = await getProjectById(id);
  if (!project) notFound();

  const session = await getSession();

  let hasApplied = false;
  if (session?.role === "student") {
    const proposals = await getStudentProposals();
    hasApplied = proposals.some(
      (p) =>
        (p.projectId?._id
          ? p.projectId._id.toString()
          : p.projectId?.toString()) === project._id.toString(),
    );
  }

  const deadline = new Date(project.deadline);
  const daysLeft = Math.max(
    0,
    Math.ceil((deadline - Date.now()) / (1000 * 60 * 60 * 24)),
  );
  const isExpired = deadline < new Date();
  const isAcceptingProposals = project.status === "open" && !isExpired;

  const statusStyles = {
    open: "bg-[#cbf4c9] text-[#181717]",
    in_progress: "bg-[#cedefd] text-[#181717]",
    completed: "bg-[#eeebea] text-[#666666]",
    cancelled: "bg-[#ffd3cf] text-[#d04841]",
  };

  const statusLabel = {
    open: "Open",
    in_progress: "In Progress",
    completed: "Completed",
    cancelled: "Cancelled",
  };

  return (
    <div className="w-full mx-auto py-12 px-4 md:px-8 max-w-7xl">
      <div className="flex flex-col md:flex-row gap-6 justify-between items-start mb-10 pb-8 border-b border-border/10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span
              className={`px-3 py-1 rounded text-[13px] font-medium tracking-wide ${statusStyles[project.status]}`}
            >
              {statusLabel[project.status]}
            </span>
            {isExpired && project.status === "open" && (
              <span className="px-3 py-1 rounded bg-[#ffd3cf] text-[#d04841] text-[13px] font-medium tracking-wide">
                Deadline Passed
              </span>
            )}
            {!isExpired && daysLeft > 0 && project.status === "open" && (
              <span className="px-3 py-1 rounded border border-[#eeebea] text-[#666666] text-[13px] font-medium tracking-wide">
                {daysLeft} days left
              </span>
            )}
          </div>
          <h1 className="text-4xl md:text-[48px] font-medium text-[#181717] tracking-tight leading-tight">
            {project.title}
          </h1>
          <div className="flex items-center gap-3 mt-4 text-[#666666]">
            <Avvvatars
              value={
                project.clientId?.email ||
                project.clientId?.name ||
                project.clientId?._id ||
                "?"
              }
              size={32}
            />
            <span className="text-[15px] font-medium">
              {project.clientId?.name || "Unknown Client"}
            </span>
          </div>
        </div>

        <div className="flex shrink-0 gap-3 w-full md:w-auto">
          {session?.role === "student" && isAcceptingProposals && (
            <ApplyButton projectId={project._id} hasApplied={hasApplied} />
          )}
          {session?.role === "student" &&
            !isAcceptingProposals &&
            project.status === "open" &&
            !hasApplied && (
              <button
                disabled
                className="bg-[#eeebea] text-[#666666] rounded-2xl h-12 flex items-center justify-center w-full md:w-auto px-6 text-[15px] cursor-not-allowed"
              >
                No Longer Accepting
              </button>
            )}
          {session?.userId === project.clientId?._id && (
            <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3">
              <StatusDropdown
                projectId={project._id}
                currentStatus={project.status}
              />

              {project.status === "open" && (
                <Link
                  href={`/projects/${project._id}/edit`}
                  className="btn-pill-2 h-12 flex items-center justify-center w-full md:w-auto px-6 text-[15px] gap-2"
                >
                  <Edit className="h-4 w-4" /> Edit
                </Link>
              )}

              <Link
                href={`/projects/${project._id}/evaluations`}
                className="btn-pill-2 h-12 flex items-center justify-center w-full md:w-auto px-6 text-[15px]"
              >
                AI Evaluations
              </Link>

              <DeleteProjectButton
                projectId={project._id.toString()}
                status={project.status}
              />
            </div>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <div className="bg-white rounded-[32px] p-8 md:p-10 border border-border/10">
            <h2 className="text-[24px] font-medium text-[#181717] mb-6">
              Description
            </h2>
            <p className="whitespace-pre-wrap text-[16px] leading-relaxed text-[#666666]">
              {project.description}
            </p>
          </div>

          {session?.userId === project.clientId?._id && (
            <ProposalList projectId={project._id} />
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-[32px] p-8 border border-border/10">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-[#cbf4c9] flex items-center justify-center text-[#181717]">
                  <IndianRupee className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[14px] text-[#666666] font-medium mb-1">
                    Budget
                  </p>
                  <p className="font-medium text-[20px] text-[#181717]">
                    {project.budget}
                  </p>
                </div>
              </div>

              <div className="h-[1px] w-full bg-border/10" />

              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-[#eeebea] flex items-center justify-center text-[#181717]">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[14px] text-[#666666] font-medium mb-1">
                    Deadline
                  </p>
                  <p className="font-medium text-[16px] text-[#181717]">
                    {deadline.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      timeZone: "UTC",
                    })}
                  </p>
                </div>
              </div>

              <div className="h-[1px] w-full bg-border/10" />

              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-[#cedefd] flex items-center justify-center text-[#181717]">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[14px] text-[#666666] font-medium mb-1">
                    Posted On
                  </p>
                  <p className="font-medium text-[16px] text-[#181717]">
                    {new Date(project.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      timeZone: "UTC",
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {project.agreedAmount != null && (
            <div className="bg-white rounded-[32px] p-8 border border-border/10">
              <h3 className="text-[20px] font-medium text-[#181717] mb-6">
                Payment Progress
              </h3>
              {(() => {
                const agreed = project.agreedAmount || 0;
                const paid = project.paidAmount || 0;
                const remaining = agreed - paid;
                const progress =
                  agreed > 0 ? Math.round((paid / agreed) * 100) : 0;
                const isFullyPaid = remaining <= 0;

                return (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-[#efddfd] flex items-center justify-center">
                        <User className="h-5 w-5 text-[#181717]" />
                      </div>
                      <div>
                        <p className="text-[13px] text-[#666666] font-medium">
                          Hired Student
                        </p>
                        <p className="text-[15px] font-medium text-[#181717]">
                          {project.hiredStudentId?.name || "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="h-[1px] w-full bg-border/10" />

                    <div className="flex justify-between text-[14px]">
                      <span className="text-[#666666]">Agreed</span>
                      <span className="font-medium text-[#181717]">
                        ₹{agreed.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-[14px]">
                      <span className="text-[#666666]">Paid</span>
                      <span className="font-medium text-[#181717]">
                        ₹{paid.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-[14px]">
                      <span className="text-[#666666]">Remaining</span>
                      <span
                        className={`font-medium ${isFullyPaid ? "text-[#cbf4c9]" : "text-[#d04841]"}`}
                      >
                        {isFullyPaid
                          ? "Fully Paid"
                          : `₹${remaining.toLocaleString()}`}
                      </span>
                    </div>

                    <div className="h-2 bg-[#eeebea] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          isFullyPaid
                            ? "bg-[#cbf4c9]"
                            : progress > 0
                              ? "bg-[#d04841]"
                              : "bg-[#eeebea]"
                        }`}
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>

                    {session?.userId === project.clientId?._id &&
                      !isFullyPaid && (
                        <Link
                          href="/client/wallet"
                          className="btn-pill-2 h-10 w-full flex items-center justify-center text-[13px] gap-2"
                        >
                          <Send className="h-4 w-4" />
                          Go to Wallet to Pay
                        </Link>
                      )}
                  </div>
                );
              })()}
            </div>
          )}

          <div className="bg-white rounded-[32px] p-8 border border-border/10">
            <h3 className="text-[20px] font-medium text-[#181717] mb-6">
              Skills Required
            </h3>
            <div className="flex flex-wrap gap-2">
              {project.skillsRequired?.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1.5 rounded-lg bg-[#eeebea] text-[#181717] text-[14px] font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
