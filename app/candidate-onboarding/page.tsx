'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import AddCandidateForm from '@/components/add-candidate-form';

export default function CandidateOnboardingPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Candidate Onboarding</h1>
          <p className="text-sm text-muted-foreground">View all candidates and their details.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => setIsDialogOpen(true)}>Add Candidate</Button>
        </div>
      </div>


      {isDialogOpen && (
        <div className="mt-6 rounded-md border p-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-medium">Add Candidate</h2>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Close</Button>
          </div>
          <AddCandidateForm onSuccess={() => { setIsDialogOpen(false); }} />
        </div>
      )}
    </div>
  );
}