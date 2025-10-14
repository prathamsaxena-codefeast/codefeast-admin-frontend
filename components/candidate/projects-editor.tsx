"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

export type ProjectItem = {
  name: string;
  role: string;
  description: string;
  techStack: string[];
  url: string;
  startDate: string;
  endDate: string;
  highlights: string[];
};

type Props = {
  projects: ProjectItem[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onChange: (index: number, next: ProjectItem) => void;
};

export default function ProjectsEditorSection({ projects, onAdd, onRemove, onChange }: Props) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Projects (optional)</label>
      </div>
      <div className="mt-3">
        <Button type="button" variant="soft" size="sm" onClick={onAdd}>
          <Plus className="h-4 w-4 mr-1" /> Add project
        </Button>
      </div>
      <div className="space-y-3">
        {projects.map((p, idx) => (
          <div key={`proj-${idx}`} className="rounded-md border p-3 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <Input
                placeholder="Project name"
                value={p.name}
                onChange={(e) => onChange(idx, { ...p, name: e.target.value })}
              />
              <Input
                placeholder="Your role (optional)"
                value={p.role}
                onChange={(e) => onChange(idx, { ...p, role: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <Input
                type="date"
                value={p.startDate}
                onChange={(e) => onChange(idx, { ...p, startDate: e.target.value })}
              />
              <Input
                type="date"
                value={p.endDate}
                onChange={(e) => onChange(idx, { ...p, endDate: e.target.value })}
              />
              <Input
                placeholder="URL (optional)"
                value={p.url}
                onChange={(e) => onChange(idx, { ...p, url: e.target.value })}
              />
            </div>
            <div>
              <textarea
                placeholder="What was the project about?"
                value={p.description}
                onChange={(e) => onChange(idx, { ...p, description: e.target.value })}
                className="h-20 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center">
                <label className="text-sm">Tech stack</label>
              </div>
              <div className="mt-3">
                <Button
                  type="button"
                  variant="soft"
                  size="sm"
                  onClick={() => onChange(idx, { ...p, techStack: [...p.techStack, ""] })}
                >
                  <Plus className="h-4 w-4 mr-1" /> Add tech
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {p.techStack.map((t, tIdx) => (
                  <div key={`proj-${idx}-t-${tIdx}`} className="flex items-center gap-2">
                    <Input
                      placeholder={`e.g., Next.js, PostgreSQL`}
                      value={t}
                      onChange={(e) => {
                        const ts = [...p.techStack];
                        ts[tIdx] = e.target.value;
                        onChange(idx, { ...p, techStack: ts });
                      }}
                    />
                    <Button
                      type="button"
                      variant="subtleDestructive"
                      size="sm"
                      onClick={() => {
                        const ts = p.techStack.filter((_, i) => i !== tIdx);
                        onChange(idx, { ...p, techStack: ts.length ? ts : [""] });
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center">
                <label className="text-sm">Highlights (optional)</label>
              </div>
              <div className="mt-3">
                <Button
                  type="button"
                  variant="soft"
                  size="sm"
                  onClick={() => onChange(idx, { ...p, highlights: [...p.highlights, ""] })}
                >
                  <Plus className="h-4 w-4 mr-1" /> Add highlight
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {p.highlights.map((h, hIdx) => (
                  <div key={`proj-${idx}-h-${hIdx}`} className="flex items-center gap-2">
                    <Input
                      placeholder={`e.g., Reached 10k MAU`}
                      value={h}
                      onChange={(e) => {
                        const hs = [...p.highlights];
                        hs[hIdx] = e.target.value;
                        onChange(idx, { ...p, highlights: hs });
                      }}
                    />
                    <Button
                      type="button"
                      variant="subtleDestructive"
                      size="sm"
                      onClick={() => {
                        const hs = p.highlights.filter((_, i) => i !== hIdx);
                        onChange(idx, { ...p, highlights: hs.length ? hs : [""] });
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="button" variant="subtleDestructive" onClick={() => onRemove(idx)}>
                Remove project
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


