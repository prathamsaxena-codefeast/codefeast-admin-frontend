"use client";

import { Spinner } from "@/components/ui/spinner";

interface LoadingProps {
  message?: string;
}

export default function Loading({ message = "Loading..." }: LoadingProps) {
  return (
    <div className="w-full flex items-center justify-center py-12">
      <div className="flex items-center gap-3 text-muted-foreground">
        <Spinner size="md" />
        <span className="text-sm">{message}</span>
      </div>
    </div>
  );
}


