"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Props = {
  summary: string;
  skills: string[];
  onChangeSummary: (value: string) => void;
  onChangeSkill: (index: number, value: string) => void;
  onAddSkill: () => void;
  onRemoveSkill: (index: number) => void;
};

export default function ResumeSummarySkillsSection({
  summary,
  skills,
  onChangeSummary,
  onChangeSkill,
  onAddSkill,
  onRemoveSkill,
}: Props) {
  return (
    <div className="space-y-3">
      <div>
        <label className="text-sm font-medium">Professional summary</label>
        <textarea
          placeholder="Summarize experience and strengths in 2-3 sentences"
          value={summary}
          onChange={(e) => onChangeSummary(e.target.value)}
          className="h-20 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
        />
        <p className="text-xs text-muted-foreground mt-1">Optional</p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center">
          <label className="text-sm font-medium">Top skills</label>
        </div>
        <div className="mt-3">
          <Button type="button" variant="soft" size="sm" onClick={onAddSkill}>
            Add another
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {skills.map((skill, idx) => (
            <div key={`skill-${idx}`} className="flex items-center gap-2">
              <Input
                placeholder={`e.g., React, SQL, Leadership`}
                value={skill}
                onChange={(e) => onChangeSkill(idx, e.target.value)}
              />
              <Button
                type="button"
                variant="subtleDestructive"
                size="sm"
                onClick={() => onRemoveSkill(idx)}
              >
                Remove
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


