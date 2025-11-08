"use client";

import React, { useState, useMemo } from "react";
import { JobCreationType } from "@/types/job";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  Filter,
  MoreHorizontal,
  ChevronFirst,
  ChevronLeft,
  ChevronRight,
  ChevronLast,
  X,
} from "lucide-react";
import {
  DialogTrigger,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useJobs } from "@/hooks/use-jobs";
import { CreateJobModal } from "@/components/job-management/CreateJob";

export default function () {
  const { jobs, refetch } = useJobs();
  const [isModalOpen, setIsModalOpen] = useState(false);

  let jobsArray = useMemo(() => {
    return Array.isArray(jobs) ? jobs : [];
  }, [jobs]);

  const [filter, setFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const filteredJobs = useMemo(() => {
    return jobsArray.filter(
      (job) =>
        job.title.toLowerCase().includes(filter.toLowerCase()) ||
        job.category.toLowerCase().includes(filter.toLowerCase())
    );
  }, [jobs, filter]);

  const paginatedJobs = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return filteredJobs.slice(startIndex, endIndex);
  }, [filteredJobs, currentPage, rowsPerPage]);

  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / rowsPerPage));

  const formatLocation = (location: any) => {
    if (location.remote) return "Remote";
    return `${location.city}, ${location.state}, ${location.country}`;
  };

  return (
    <div className="p-6 md:p-10 bg-background text-foreground min-h-screen font-sans">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Job Management</h1>
          <p className="text-lg text-muted-foreground">
            Create, view, and manage job postings.
          </p>
        </div>
        <CreateJobModal
          isOpen={isModalOpen}
          setIsOpen={setIsModalOpen}
          onUserCreated={refetch}
        />
      </div>

      <div className="flex items-center py-4 gap-2">
        <input
          placeholder="Filter jobs by title..."
          className="min-w-sm bg-input border border-border rounded-md px-3 py-2"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" /> Filter
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Title</DropdownMenuItem>
            <DropdownMenuItem>Category</DropdownMenuItem>
            <DropdownMenuItem>Status</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-lg border border-border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Job Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Experience</TableHead>
              <TableHead>Deadline</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedJobs.length > 0 ? (
              paginatedJobs.map((job) => (
                <TableRow key={job._id}>
                  <TableCell className="font-medium">{job.title}</TableCell>
                  <TableCell>
                    <Badge
                      className={`${
                        job.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      } px-2 py-0.5 rounded-full text-xs font-medium`}
                    >
                      {job.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>{job.type}</TableCell>
                  <TableCell>{formatLocation(job.location)}</TableCell>
                  <TableCell>{job.category}</TableCell>
                  <TableCell>{job.experienceLevel}</TableCell>
                  <TableCell>
                    {job.deadline
                      ? new Date(job.deadline).toLocaleDateString()
                      : "-"}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center h-24 text-muted-foreground"
                >
                  No jobs found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between px-2 py-4">
        <div className="text-sm text-muted-foreground">
          {paginatedJobs.length} of {filteredJobs.length} job(s) displayed.
        </div>
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Rows per page</p>
            <select
              id="rowsPerPage"
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="h-8 w-[70px] rounded-md border border-input bg-transparent px-3 py-1 text-sm"
            >
              {[10, 20, 30, 40, 50].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
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
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
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
    </div>
  );
}
