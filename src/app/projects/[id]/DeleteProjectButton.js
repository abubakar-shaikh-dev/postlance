'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteProject } from '@/lib/actions/projects';
import { Loader2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export function DeleteProjectButton({ projectId, status }) {
  const [isDeleting, setIsDeleting] = useState(false);

  if (status === 'in_progress' || status === 'completed') {
    return null; // Cannot delete
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this project? This will also delete all proposals.')) return;
    
    setIsDeleting(true);
    try {
      await deleteProject(projectId);
      toast.success('Project deleted successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to delete project');
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="btn-ghost flex items-center justify-center gap-2 p-3 text-red-600 hover:text-red-700 disabled:opacity-50 h-12"
      title="Delete Project"
    >
      {isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
    </button>
  );
}
