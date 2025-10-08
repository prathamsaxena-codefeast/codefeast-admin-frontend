'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChevronFirst, ChevronLast, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCandidates } from '@/hooks/use-candidates';
import type { Candidate } from '@/types/candidate';
import Loading from '@/components/loading';
import CandidateDetailsDialog from '@/components/candidate-details-dialog';

export default function CandidatesPage() {
  const { candidates, loading, error, refetch } = useCandidates();
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const candidatesArray = useMemo(() => {
    const base = Array.isArray(candidates) ? candidates : [];
    if (!search.trim()) return base;
    const q = search.toLowerCase();
    return base.filter((c) =>
      [c.firstName, c.lastName, c.email, c.phoneNumber, c.address]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q))
    );
  }, [candidates, search]);

  const totalPages = Math.ceil(candidatesArray.length / rowsPerPage) || 1;
  const paginatedCandidates = candidatesArray.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleRowClick = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedCandidate(null);
  };

  if (loading) return <Loading message="Loading candidates..." />;
  if (error) {
    return (
      <div className="p-6">
        <div className="mb-4 rounded-md border border-destructive/30 bg-destructive/5 p-4 text-destructive">
          {error}
        </div>
        <Button variant="outline" onClick={refetch}>Try again</Button>
      </div>
    );
  }
  if (!candidatesArray.length) return <div className="p-6">No candidates found.</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Candidates</h1>
          <p className="text-sm text-muted-foreground">All candidates details.</p>
        </div>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search candidates..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-64"
          />
          <Button variant="outline" onClick={() => setCurrentPage(1)}>Search</Button>
        </div>
      </div>

      <div className="mb-2 text-sm text-muted-foreground">
        Click on any row to view detailed candidate information
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="whitespace-nowrap">First Name</TableHead>
              <TableHead className="whitespace-nowrap">Last Name</TableHead>
              <TableHead className="whitespace-nowrap">Email</TableHead>
              <TableHead className="whitespace-nowrap">Phone</TableHead>
              <TableHead className="whitespace-nowrap">Age</TableHead>
              <TableHead className="whitespace-nowrap">Resume</TableHead>
              <TableHead className="whitespace-nowrap">Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedCandidates.map((candidate: Candidate) => (
              <TableRow 
                key={candidate._id}
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => handleRowClick(candidate)}
              >
                <TableCell>{candidate.firstName}</TableCell>
                <TableCell>{candidate.lastName}</TableCell>
                <TableCell className="break-all">{candidate.email}</TableCell>
                <TableCell>{candidate.phoneNumber}</TableCell>
                <TableCell>{candidate.age}</TableCell>
                <TableCell>
                  {candidate.resumeLink ? (
                    <a 
                      href={candidate.resumeLink} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="text-primary underline hover:text-primary/80"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Link
                    </a>
                  ) : (
                    '-'
                  )}
                </TableCell>
                <TableCell>{new Date(candidate.createdAt).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between px-2 py-4">
        <div className="text-sm text-muted-foreground">
          {paginatedCandidates.length} of {candidatesArray.length} candidate(s) displayed.
        </div>
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Rows per page</p>
            <label htmlFor="rowsPerPage" className="sr-only">Rows per page</label>
            <select
              id="rowsPerPage"
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="h-8 w-[70px] rounded-md border border-input bg-transparent px-3 py-1 text-sm"
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="30">30</option>
              <option value="40">40</option>
              <option value="50">50</option>
            </select>
          </div>

          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Page {currentPage} of {totalPages}
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            >
              <ChevronFirst className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
            >
              <ChevronLast className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <CandidateDetailsDialog
        candidate={selectedCandidate}
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
      />
    </div>
  );
}


