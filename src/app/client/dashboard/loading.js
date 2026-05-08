export default function ClientDashboardLoading() {
  return (
    <div className="container mx-auto py-12 px-4 md:px-8 max-w-7xl">
      <div className="animate-pulse">
        {/* Header — matches justify-between items-end */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-16">
          <div className="space-y-4">
            <div className="h-10 w-48 rounded-xl bg-[#eeebea]" />
            <div className="h-5 w-80 rounded bg-[#eeebea]" />
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <div className="h-[52px] w-full sm:w-44 rounded-2xl bg-[#eeebea]" />
            <div className="h-[52px] w-full sm:w-28 rounded-2xl bg-[#eeebea]" />
          </div>
        </div>

        {/* Stats Cards — 3 cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white p-8 rounded-[32px] border border-border/20">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 rounded-xl bg-[#eeebea]" />
                <div className="h-4 w-20 rounded bg-[#eeebea]" />
              </div>
              <div className="h-12 w-16 rounded bg-[#eeebea]" />
            </div>
          ))}
        </div>

        {/* "My Projects" heading */}
        <div className="h-8 w-44 rounded bg-[#eeebea] mb-6" />

        {/* Project cards */}
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex flex-col lg:flex-row items-start lg:items-center justify-between p-8 rounded-[24px] border border-border/20 bg-white gap-6"
            >
              <div className="flex-1 space-y-3 w-full">
                <div className="flex items-center gap-3">
                  <div className="h-6 w-48 rounded bg-[#eeebea]" />
                  <div className="h-5 w-16 rounded bg-[#eeebea]" />
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-4 w-24 rounded bg-[#eeebea]" />
                  <div className="w-1 h-1 rounded-full bg-[#eeebea]" />
                  <div className="h-4 w-32 rounded bg-[#eeebea]" />
                </div>
              </div>
              <div className="flex items-center gap-3 w-full lg:w-auto pt-4 lg:pt-0 border-t border-border/10 lg:border-t-0">
                <div className="h-8 w-24 rounded bg-[#eeebea]" />
                <div className="h-[42px] w-28 rounded-full bg-[#eeebea]" />
                <div className="h-[42px] w-36 rounded-full bg-[#eeebea]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
