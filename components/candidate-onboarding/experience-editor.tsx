"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

export type ExperienceItem = {
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  highlights: string[];
};

type Props = {
  experience: ExperienceItem[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onChange: (index: number, next: ExperienceItem) => void;
};

export default function ExperienceEditorSection({ experience, onAdd, onRemove, onChange }: Props) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Work experience</label>
      </div>
      <div className="mt-3">
        <Button type="button" variant="soft" size="sm" onClick={onAdd}>
          <Plus className="h-4 w-4 mr-1" /> Add role
        </Button>
      </div>
      <div className="space-y-3">
        {experience.map((exp, idx) => (
          <div key={`exp-${idx}`} className="rounded-md border p-3 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <Input
                placeholder="Job title"
                value={exp.title}
                onChange={(e) => onChange(idx, { ...exp, title: e.target.value })}
              />
              <Input
                placeholder="Company"
                value={exp.company}
                onChange={(e) => onChange(idx, { ...exp, company: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <Input
                placeholder="Location (optional)"
                value={exp.location}
                onChange={(e) => onChange(idx, { ...exp, location: e.target.value })}
              />
              <Input
                type="date"
                value={exp.startDate}
                onChange={(e) => onChange(idx, { ...exp, startDate: e.target.value })}
              />
              <Input
                type="date"
                disabled={exp.current}
                value={exp.endDate}
                onChange={(e) => onChange(idx, { ...exp, endDate: e.target.value })}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                id={`exp-current-${idx}`}
                type="checkbox"
                checked={exp.current}
                onChange={(e) =>
                  onChange(idx, {
                    ...exp,
                    current: e.target.checked,
                    endDate: e.target.checked ? "" : exp.endDate,
                  })
                }
              />
              <label htmlFor={`exp-current-${idx}`} className="text-sm">
                I currently work here
              </label>
            </div>
            <div>
              <textarea
                placeholder="Briefly describe what you did in this role"
                value={exp.description}
                onChange={(e) => onChange(idx, { ...exp, description: e.target.value })}
                className="h-20 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
              />
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
                  onClick={() =>
                    onChange(idx, { ...exp, highlights: [...exp.highlights, ""] })
                  }
                >
                  <Plus className="h-4 w-4 mr-1" /> Add highlight
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {exp.highlights.map((h, hIdx) => (
                  <div key={`exp-${idx}-h-${hIdx}`} className="flex items-center gap-2">
                    <Input
                      placeholder={`e.g., Reduced costs by 20%`}
                      value={h}
                      onChange={(e) => {
                        const nextHighlights = [...exp.highlights];
                        nextHighlights[hIdx] = e.target.value;
                        onChange(idx, { ...exp, highlights: nextHighlights });
                      }}
                    />
                    <Button
                      type="button"
                      variant="subtleDestructive"
                      size="sm"
                      onClick={() => {
                        const filtered = exp.highlights.filter((_, i) => i !== hIdx);
                        onChange(idx, { ...exp, highlights: filtered.length ? filtered : [""] });
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
                Remove role
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


