export default function StudentDashboardLoading() {
  return (
    <div className="w-full mx-auto py-12 px-4 md:px-8 max-w-7xl">
      <div className="animate-pulse">
        {/* Header — matches justify-between items-end */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-16">
          <div className="space-y-4">
            <div className="h-10 w-40 rounded-xl bg-[#eeebea]" />
            <div className="h-5 w-80 rounded bg-[#eeebea]" />
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <div className="h-[52px] w-full sm:w-28 rounded-2xl bg-[#eeebea]" />
            <div className="h-[52px] w-full sm:w-28 rounded-2xl bg-[#eeebea]" />
            <div className="h-[52px] w-full sm:w-32 rounded-2xl bg-[#eeebea]" />
          </div>
        </div>

        {/* Stats Cards — 4 cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white p-8 rounded-[32px] border border-border/20">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 rounded-xl bg-[#eeebea]" />
                <div className="h-4 w-24 rounded bg-[#eeebea]" />
              </div>
              <div className="h-12 w-16 rounded bg-[#eeebea]" />
            </div>
          ))}
        </div>

        {/* "Recent Proposals" heading */}
        <div className="h-8 w-48 rounded bg-[#eeebea] mb-6" />

        {/* Proposal cards */}
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 rounded-[24px] border border-border/20 bg-white gap-4"
            >
              <div className="space-y-2 w-full flex-1">
                <div className="h-5 w-3/4 rounded bg-[#eeebea]" />
                <div className="h-4 w-1/2 rounded bg-[#eeebea]" />
              </div>
              <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                <div className="h-6 w-20 rounded bg-[#eeebea]" />
                <div className="h-6 w-20 rounded bg-[#eeebea]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
