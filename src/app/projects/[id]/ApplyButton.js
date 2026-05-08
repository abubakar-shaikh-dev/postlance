'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ProposalForm } from '@/components/proposals/ProposalForm';
import { Send, CheckCircle2 } from 'lucide-react';

export function ApplyButton({ projectId, hasApplied }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {hasApplied ? (
        <button 
          disabled
          className="bg-[#eeebea] text-[#181717] rounded-2xl h-12 flex items-center justify-center w-full md:w-auto px-6 text-[15px] cursor-not-allowed opacity-80"
        >
          <CheckCircle2 className="mr-2 h-5 w-5" />
          Applied
        </button>
      ) : (
        <button 
          onClick={() => setOpen(true)}
          className="btn-filled-2 h-12 flex items-center justify-center w-full md:w-auto px-6 text-[15px]"
        >
          <Send className="mr-2 h-5 w-5" />
          Apply Now
        </button>
      )}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Submit Your Proposal</DialogTitle>
            <DialogDescription>
              Tell the client why you're the right fit for this project.
            </DialogDescription>
          </DialogHeader>
          <ProposalForm projectId={projectId} onClose={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
}
