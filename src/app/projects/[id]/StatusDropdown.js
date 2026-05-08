'use client';

import { useState } from 'react';
import { updateProjectStatus } from '@/lib/actions/projects';
import { toast } from 'sonner';

const STATUSES = [
  { value: 'open', label: 'Open' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

const statusBadge = {
  open: 'bg-[#cbf4c9] text-[#181717]',
  in_progress: 'bg-[#cedefd] text-[#181717]',
  completed: 'bg-[#eeebea] text-[#666666]',
  cancelled: 'bg-[#ffd3cf] text-[#d04841]',
};

export function StatusDropdown({ projectId, currentStatus }) {
  const [status, setStatus] = useState(currentStatus);
  const [updating, setUpdating] = useState(false);

  const handleChange = async (e) => {
    const newStatus = e.target.value;
    if (newStatus === status) return;

    setUpdating(true);
    try {
      await updateProjectStatus(projectId, newStatus);
      setStatus(newStatus);
      toast.success(`Project marked as ${STATUSES.find((s) => s.value === newStatus)?.label}`);
    } catch (err) {
      toast.error(err.message || 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="relative inline-flex items-center gap-2">
      <select
        value={status}
        onChange={handleChange}
        disabled={updating}
        className={`appearance-none cursor-pointer px-4 py-2 pr-8 rounded-xl text-[13px] font-medium tracking-wide border-0 outline-none ${statusBadge[status]}`}
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center' }}
      >
        {STATUSES.map((s) => (
          <option key={s.value} value={s.value} className="bg-white text-[#181717]">
            {s.label}
          </option>
        ))}
      </select>
      {updating && (
        <span className="text-[12px] text-[#666666]">Updating...</span>
      )}
    </div>
  );
}
