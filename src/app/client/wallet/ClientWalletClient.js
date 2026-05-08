'use client';

import { useState } from 'react';
import CountUp from 'react-countup';
import { Wallet, Send, ArrowDownLeft, ArrowUpRight, Briefcase, IndianRupee, X, ChevronRight } from 'lucide-react';
import { TransactionList } from '@/components/wallet/TransactionList';
import { TopUpDialog } from '@/components/wallet/TopUpDialog';
import { sendMoney } from '@/lib/actions/wallet';
import { toast } from 'sonner';

export function ClientWalletClient({ wallet, projects }) {
  const [sendOpen, setSendOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [splitAmount, setSplitAmount] = useState('');
  const [sending, setSending] = useState(false);

  const balance = wallet?.balance || 0;
  const transactions = wallet?.transactions || [];
  const totalToppedUp = transactions
    .filter((t) => t.type === 'credit')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalSent = transactions
    .filter((t) => t.type === 'debit')
    .reduce((sum, t) => sum + t.amount, 0);

  const openSend = (project) => {
    const remaining = project.agreedAmount - (project.paidAmount || 0);
    setSelectedProject(project);
    setSplitAmount(remaining > 0 ? String(remaining) : '');
    setSendOpen(true);
  };

  const handleSend = async () => {
    const amt = Number(splitAmount);
    if (!amt || amt <= 0) {
      toast.error('Enter a valid amount.');
      return;
    }
    if (!selectedProject) return;

    const remaining = selectedProject.agreedAmount - (selectedProject.paidAmount || 0);
    if (amt > remaining) {
      toast.error(`Cannot send more than the remaining ₹${remaining.toLocaleString()}.`);
      return;
    }
    if (amt > balance) {
      toast.error('Insufficient wallet balance. Top up first.');
      return;
    }

    setSending(true);
    const result = await sendMoney({
      studentId: selectedProject.hiredStudentId._id || selectedProject.hiredStudentId,
      amount: amt,
      projectId: selectedProject._id,
    });
    if (result.success) {
      toast.success(result.message);
      setSendOpen(false);
      setSelectedProject(null);
    } else {
      toast.error(result.message);
    }
    setSending(false);
  };

  const setFullAmount = () => {
    if (!selectedProject) return;
    const remaining = selectedProject.agreedAmount - (selectedProject.paidAmount || 0);
    setSplitAmount(String(remaining));
  };

  return (
    <div className="container mx-auto py-12 px-4 md:px-8 max-w-5xl">
      {/* Header */}
      <div className="mb-12">
        <div className="inline-flex items-center px-4 py-2 bg-[#efddfd] text-[#181717] rounded text-[13px] font-medium mb-4">
          <Wallet className="h-4 w-4 mr-2" />
          My Wallet
        </div>
        <h1 className="text-4xl md:text-[48px] font-medium text-[#181717] tracking-tight">
          Wallet
        </h1>
        <p className="text-[16px] text-[#666666] mt-2">
          Manage your balance and pay hired students for active projects.
        </p>
      </div>

      {/* Balance Card */}
      <div className="card-ts p-8 md:p-10 rounded-[32px] mb-8">
        <p className="text-[14px] font-medium text-[#f9f7f6]/70 mb-2 uppercase tracking-wide">
          Available Balance
        </p>
        <div className="flex items-baseline gap-1 mb-8">
          <span className="text-[14px] font-medium text-[#f9f7f6]/60">₹</span>
          <span className="text-[56px] md:text-[64px] font-medium text-white leading-none tabular-nums">
            <CountUp end={balance} duration={1.5} separator="," />
          </span>
        </div>
        <TopUpDialog />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-12">
        <div className="bg-white p-6 rounded-[24px] border border-border/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-xl bg-[#cbf4c9] flex items-center justify-center">
              <ArrowDownLeft className="h-5 w-5 text-[#181717]" />
            </div>
            <p className="text-[13px] font-medium text-[#666666]">Total Topped Up</p>
          </div>
          <p className="text-[28px] font-medium text-[#181717] tabular-nums">
            ₹<CountUp end={totalToppedUp} duration={1.5} separator="," />
          </p>
        </div>
        <div className="bg-white p-6 rounded-[24px] border border-border/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-xl bg-[#ffd3cf] flex items-center justify-center">
              <ArrowUpRight className="h-5 w-5 text-[#d04841]" />
            </div>
            <p className="text-[13px] font-medium text-[#666666]">Total Paid Out</p>
          </div>
          <p className="text-[28px] font-medium text-[#181717] tabular-nums">
            ₹<CountUp end={totalSent} duration={1.5} separator="," />
          </p>
        </div>
      </div>

      {/* Active Project Payments */}
      {projects.length > 0 && (
        <div className="mb-12">
          <h2 className="text-[24px] font-medium text-[#181717] mb-6">Project Payments</h2>
          <div className="grid gap-4">
            {projects.map((project) => {
              const agreed = project.agreedAmount || 0;
              const paid = project.paidAmount || 0;
              const remaining = agreed - paid;
              const progress = agreed > 0 ? Math.round((paid / agreed) * 100) : 0;
              const isComplete = remaining <= 0;

              return (
                <div
                  key={project._id}
                  className="bg-white rounded-[24px] border border-border/10 p-6 hover:border-border/20 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-[18px] font-medium text-[#181717] truncate">
                          {project.title}
                        </h3>
                        <span className={`px-2 py-0.5 rounded text-[11px] font-medium tracking-wide ${
                          isComplete ? 'bg-[#cbf4c9] text-[#181717]' : 'bg-[#cedefd] text-[#181717]'
                        }`}>
                          {isComplete ? 'Paid' : 'Paying'}
                        </span>
                      </div>
                      <p className="text-[14px] text-[#666666]">
                        {project.hiredStudentId?.name || 'Student'}
                      </p>
                    </div>

                    {!isComplete && (
                      <button
                        onClick={() => openSend(project)}
                        disabled={balance <= 0}
                        className="btn-filled-2 h-10 px-5 flex items-center gap-2 text-[13px] shrink-0 disabled:opacity-40"
                      >
                        <Send className="h-4 w-4" />
                        Send Payment
                      </button>
                    )}
                  </div>

                  {/* Progress bar */}
                  <div className="mt-4">
                    <div className="flex justify-between text-[13px] font-medium mb-2">
                      <span className="text-[#666666]">
                        ₹{paid.toLocaleString()} paid of ₹{agreed.toLocaleString()}
                      </span>
                      <span className={isComplete ? 'text-[#181717]' : 'text-[#d04841]'}>
                        {isComplete ? 'Complete' : `₹${remaining.toLocaleString()} remaining`}
                      </span>
                    </div>
                    <div className="h-2 bg-[#eeebea] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isComplete ? 'bg-[#cbf4c9]' : progress > 0 ? 'bg-[#d04841]' : 'bg-[#eeebea]'
                        }`}
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {projects.length === 0 && balance > 0 && (
        <div className="text-center py-12 px-4 bg-white border border-border/10 rounded-[24px] mb-12">
          <div className="h-12 w-12 bg-[#f9f7f6] rounded-full border border-border/10 flex items-center justify-center mx-auto mb-4">
            <Briefcase className="h-6 w-6 text-[#666666]" />
          </div>
          <h3 className="text-[16px] font-medium text-[#181717] mb-1">No active hires yet</h3>
          <p className="text-[14px] text-[#666666]">
            Once you hire a student for a project, payment options will appear here.
          </p>
        </div>
      )}

      {/* Transaction History */}
      <h2 className="text-[24px] font-medium text-[#181717] mb-6">Transaction History</h2>
      <TransactionList transactions={transactions} />

      {/* Send Money Modal */}
      {sendOpen && selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#181717]/30 backdrop-blur-sm" onClick={() => { setSendOpen(false); setSelectedProject(null); }} />
          <div className="relative bg-white rounded-[32px] border border-border/10 w-full max-w-md p-8 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[20px] font-medium text-[#181717]">Send Payment</h2>
              <button
                onClick={() => { setSendOpen(false); setSelectedProject(null); }}
                className="p-2 rounded-xl hover:bg-[#f9f7f6] text-[#666666]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-5">
              {/* Project info */}
              <div className="bg-[#f9f7f6] rounded-2xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-[14px]">
                  <Briefcase className="h-4 w-4 text-[#666666]" />
                  <span className="font-medium text-[#181717]">{selectedProject.title}</span>
                </div>
                <div className="flex items-center gap-2 text-[14px]">
                  <span className="text-[#666666]">To:</span>
                  <span className="font-medium text-[#181717]">
                    {selectedProject.hiredStudentId?.name || 'Student'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[13px]">
                  <span className="text-[#666666]">Agreed: ₹{selectedProject.agreedAmount?.toLocaleString()}</span>
                  <span className="text-[#666666]">Paid: ₹{(selectedProject.paidAmount || 0).toLocaleString()}</span>
                </div>
              </div>

              {/* Amount input */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[13px] font-medium text-[#666666]">
                    Amount (₹)
                  </label>
                  <button
                    onClick={setFullAmount}
                    className="text-[12px] font-medium text-[#d04841] hover:underline"
                  >
                    Pay remaining ₹{(selectedProject.agreedAmount - (selectedProject.paidAmount || 0)).toLocaleString()}
                  </button>
                </div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[16px] font-medium text-[#666666]">
                    ₹
                  </span>
                  <input
                    type="number"
                    value={splitAmount}
                    onChange={(e) => setSplitAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full h-12 pl-8 pr-4 rounded-xl border border-border/20 bg-[#f9f7f6] text-[16px] font-medium text-[#181717] placeholder:text-[#999] outline-none focus:border-[#d04841]/40"
                  />
                </div>
                {balance > 0 && (
                  <p className="text-[12px] text-[#666666] mt-1.5">
                    Wallet balance: ₹{balance.toLocaleString()}
                  </p>
                )}
              </div>

              <button
                onClick={handleSend}
                disabled={sending || !splitAmount || Number(splitAmount) <= 0}
                className="btn-filled-2 w-full h-12 text-[15px] disabled:opacity-50"
              >
                {sending ? 'Sending...' : `Send ₹${(Number(splitAmount) || 0).toLocaleString()}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
