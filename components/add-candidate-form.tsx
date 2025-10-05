'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import api from '@/lib/api';

interface AddCandidateFormProps {
  onSuccess?: () => void;
}

export default function AddCandidateForm({ onSuccess }: AddCandidateFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: '',
    resumeLink: '',
    age: '' as unknown as number | '',
    resume: {
      summary: '',
      skills: [''],
      experience: [] as Array<{
        title: string;
        company: string;
        location: string;
        startDate: string;
        endDate: string;
        current: boolean;
        description: string;
        highlights: string[];
      }>,
      projects: [] as Array<{
        name: string;
        role: string;
        description: string;
        techStack: string[];
        url: string;
        startDate: string;
        endDate: string;
        highlights: string[];
      }>,
    }
  });

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    if (!form.firstName?.trim() || !form.lastName?.trim() || !form.email?.trim() || 
        !form.phoneNumber?.trim() || !form.address?.trim() || !form.resumeLink?.trim() || 
        form.age === '' || form.age === ('' as unknown as number) || form.age < 12 || form.age > 100) {
      setSubmitError('Please fill in all required fields. Age must be between 12 and 100.');
      setIsSubmitting(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setSubmitError('Please enter a valid email address.');
      setIsSubmitting(false);
      return;
    }

    try {
      await api.post('/candidate', {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim().toLowerCase(),
        phoneNumber: form.phoneNumber.trim(),
        address: form.address.trim(),
        resumeLink: form.resumeLink.trim(),
        age: Number(form.age),
        resume: {
          summary: form.resume.summary?.trim() || undefined,
          skills: (form.resume.skills || []).map(s => s.trim()).filter(Boolean),
          experience: (form.resume.experience || []).map(e => ({
            title: e.title?.trim(),
            company: e.company?.trim(),
            location: e.location?.trim() || undefined,
            startDate: e.startDate ? new Date(e.startDate) : undefined,
            endDate: e.endDate ? new Date(e.endDate) : undefined,
            current: !!e.current,
            description: e.description?.trim() || undefined,
            highlights: (e.highlights || []).map(h => h.trim()).filter(Boolean),
          })).filter(e => e.title && e.company && e.startDate),
          projects: (form.resume.projects || []).map(p => ({
            name: p.name?.trim(),
            role: p.role?.trim() || undefined,
            description: p.description?.trim() || undefined,
            techStack: (p.techStack || []).map(t => t.trim()).filter(Boolean),
            url: p.url?.trim() || undefined,
            startDate: p.startDate ? new Date(p.startDate) : undefined,
            endDate: p.endDate ? new Date(p.endDate) : undefined,
            highlights: (p.highlights || []).map(h => h.trim()).filter(Boolean),
          })).filter(p => p.name),
        }
      });

      setForm({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        address: '',
        resumeLink: '',
        age: '' as unknown as number | '',
        resume: { summary: '', skills: [''], experience: [], projects: [] }
      });
      if (onSuccess) onSuccess();
    } catch (e: any) {
      const message = e?.response?.data?.message || 'Failed to add candidate';
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3 mb-2">
        <Input placeholder="First Name" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
        <Input placeholder="Last Name" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
        <Input placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <Input placeholder="Phone Number" value={form.phoneNumber} onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })} />
        <Input placeholder="Age" type="number" value={form.age as any} onChange={(e) => setForm({ ...form, age: Number(e.target.value) })} />
        <Input placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="col-span-2" />
        <Input placeholder="Resume Link" value={form.resumeLink} onChange={(e) => setForm({ ...form, resumeLink: e.target.value })} className="col-span-2" />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Resume Summary</label>
        <textarea
          placeholder="Brief professional summary"
          value={form.resume.summary}
          onChange={(e) => setForm({ ...form, resume: { ...form.resume, summary: e.target.value } })}
          className="h-20 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Skills</label>
          <Button
            type="button"
            variant="outline"
            onClick={() => setForm({ ...form, resume: { ...form.resume, skills: [...form.resume.skills, ''] } })}
          >
            Add Skill
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {form.resume.skills.map((skill, idx) => (
            <div key={`skill-${idx}`} className="flex items-center gap-2">
              <Input
                placeholder={`Skill #${idx + 1}`}
                value={skill}
                onChange={(e) => {
                  const next = [...form.resume.skills];
                  next[idx] = e.target.value;
                  setForm({ ...form, resume: { ...form.resume, skills: next } });
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  const next = form.resume.skills.filter((_, i) => i !== idx);
                  setForm({ ...form, resume: { ...form.resume, skills: next.length ? next : [''] } });
                }}
              >
                Remove
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Experience</label>
          <Button
            type="button"
            onClick={() => setForm({
              ...form,
              resume: {
                ...form.resume,
                experience: [
                  ...form.resume.experience,
                  { title: '', company: '', location: '', startDate: '', endDate: '', current: false, description: '', highlights: [''] }
                ]
              }
            })}
          >
            Add Experience
          </Button>
        </div>
        <div className="space-y-3">
          {form.resume.experience.map((exp, idx) => (
            <div key={`exp-${idx}`} className="rounded-md border p-3 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <Input placeholder="Title" value={exp.title} onChange={(e) => {
                  const next = [...form.resume.experience];
                  next[idx] = { ...next[idx], title: e.target.value };
                  setForm({ ...form, resume: { ...form.resume, experience: next } });
                }} />
                <Input placeholder="Company" value={exp.company} onChange={(e) => {
                  const next = [...form.resume.experience];
                  next[idx] = { ...next[idx], company: e.target.value };
                  setForm({ ...form, resume: { ...form.resume, experience: next } });
                }} />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <Input placeholder="Location" value={exp.location} onChange={(e) => {
                  const next = [...form.resume.experience];
                  next[idx] = { ...next[idx], location: e.target.value };
                  setForm({ ...form, resume: { ...form.resume, experience: next } });
                }} />
                <Input type="date" value={exp.startDate} onChange={(e) => {
                  const next = [...form.resume.experience];
                  next[idx] = { ...next[idx], startDate: e.target.value };
                  setForm({ ...form, resume: { ...form.resume, experience: next } });
                }} />
                <Input type="date" value={exp.endDate} onChange={(e) => {
                  const next = [...form.resume.experience];
                  next[idx] = { ...next[idx], endDate: e.target.value };
                  setForm({ ...form, resume: { ...form.resume, experience: next } });
                }} />
              </div>
              <div className="flex items-center gap-2">
                <input
                  id={`exp-current-${idx}`}
                  type="checkbox"
                  checked={exp.current}
                  onChange={(e) => {
                    const next = [...form.resume.experience];
                    next[idx] = { ...next[idx], current: e.target.checked };
                    setForm({ ...form, resume: { ...form.resume, experience: next } });
                  }}
                />
                <label htmlFor={`exp-current-${idx}`} className="text-sm">Currently working here</label>
              </div>
              <div>
                <textarea
                  placeholder="Description"
                  value={exp.description}
                  onChange={(e) => {
                    const next = [...form.resume.experience];
                    next[idx] = { ...next[idx], description: e.target.value };
                    setForm({ ...form, resume: { ...form.resume, experience: next } });
                  }}
                  className="h-20 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm">Highlights</label>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      const next = [...form.resume.experience];
                      next[idx] = { ...next[idx], highlights: [...next[idx].highlights, ''] };
                      setForm({ ...form, resume: { ...form.resume, experience: next } });
                    }}
                  >
                    Add Highlight
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {exp.highlights.map((h, hIdx) => (
                    <div key={`exp-${idx}-h-${hIdx}`} className="flex items-center gap-2">
                      <Input
                        placeholder={`Highlight #${hIdx + 1}`}
                        value={h}
                        onChange={(e) => {
                          const next = [...form.resume.experience];
                          const hi = [...next[idx].highlights];
                          hi[hIdx] = e.target.value;
                          next[idx] = { ...next[idx], highlights: hi };
                          setForm({ ...form, resume: { ...form.resume, experience: next } });
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          const next = [...form.resume.experience];
                          const hi = next[idx].highlights.filter((_, i) => i !== hIdx);
                          next[idx] = { ...next[idx], highlights: hi.length ? hi : [''] };
                          setForm({ ...form, resume: { ...form.resume, experience: next } });
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const next = form.resume.experience.filter((_, i) => i !== idx);
                    setForm({ ...form, resume: { ...form.resume, experience: next } });
                  }}
                >
                  Remove Experience
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Projects</label>
          <Button
            type="button"
            onClick={() => setForm({
              ...form,
              resume: {
                ...form.resume,
                projects: [
                  ...form.resume.projects,
                  { name: '', role: '', description: '', techStack: [''], url: '', startDate: '', endDate: '', highlights: [''] }
                ]
              }
            })}
          >
            Add Project
          </Button>
        </div>
        <div className="space-y-3">
          {form.resume.projects.map((p, idx) => (
            <div key={`proj-${idx}`} className="rounded-md border p-3 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <Input placeholder="Name" value={p.name} onChange={(e) => {
                  const next = [...form.resume.projects];
                  next[idx] = { ...next[idx], name: e.target.value };
                  setForm({ ...form, resume: { ...form.resume, projects: next } });
                }} />
                <Input placeholder="Role" value={p.role} onChange={(e) => {
                  const next = [...form.resume.projects];
                  next[idx] = { ...next[idx], role: e.target.value };
                  setForm({ ...form, resume: { ...form.resume, projects: next } });
                }} />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <Input type="date" value={p.startDate} onChange={(e) => {
                  const next = [...form.resume.projects];
                  next[idx] = { ...next[idx], startDate: e.target.value };
                  setForm({ ...form, resume: { ...form.resume, projects: next } });
                }} />
                <Input type="date" value={p.endDate} onChange={(e) => {
                  const next = [...form.resume.projects];
                  next[idx] = { ...next[idx], endDate: e.target.value };
                  setForm({ ...form, resume: { ...form.resume, projects: next } });
                }} />
                <Input placeholder="URL" value={p.url} onChange={(e) => {
                  const next = [...form.resume.projects];
                  next[idx] = { ...next[idx], url: e.target.value };
                  setForm({ ...form, resume: { ...form.resume, projects: next } });
                }} />
              </div>
              <div>
                <textarea
                  placeholder="Description"
                  value={p.description}
                  onChange={(e) => {
                    const next = [...form.resume.projects];
                    next[idx] = { ...next[idx], description: e.target.value };
                    setForm({ ...form, resume: { ...form.resume, projects: next } });
                  }}
                  className="h-20 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm">Tech Stack</label>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      const next = [...form.resume.projects];
                      next[idx] = { ...next[idx], techStack: [...next[idx].techStack, ''] };
                      setForm({ ...form, resume: { ...form.resume, projects: next } });
                    }}
                  >
                    Add Tech
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {p.techStack.map((t, tIdx) => (
                    <div key={`proj-${idx}-t-${tIdx}`} className="flex items-center gap-2">
                      <Input
                        placeholder={`Tech #${tIdx + 1}`}
                        value={t}
                        onChange={(e) => {
                          const next = [...form.resume.projects];
                          const ts = [...next[idx].techStack];
                          ts[tIdx] = e.target.value;
                          next[idx] = { ...next[idx], techStack: ts };
                          setForm({ ...form, resume: { ...form.resume, projects: next } });
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          const next = [...form.resume.projects];
                          const ts = next[idx].techStack.filter((_, i) => i !== tIdx);
                          next[idx] = { ...next[idx], techStack: ts.length ? ts : [''] };
                          setForm({ ...form, resume: { ...form.resume, projects: next } });
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm">Highlights</label>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      const next = [...form.resume.projects];
                      next[idx] = { ...next[idx], highlights: [...next[idx].highlights, ''] };
                      setForm({ ...form, resume: { ...form.resume, projects: next } });
                    }}
                  >
                    Add Highlight
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {p.highlights.map((h, hIdx) => (
                    <div key={`proj-${idx}-h-${hIdx}`} className="flex items-center gap-2">
                      <Input
                        placeholder={`Highlight #${hIdx + 1}`}
                        value={h}
                        onChange={(e) => {
                          const next = [...form.resume.projects];
                          const hs = [...next[idx].highlights];
                          hs[hIdx] = e.target.value;
                          next[idx] = { ...next[idx], highlights: hs };
                          setForm({ ...form, resume: { ...form.resume, projects: next } });
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          const next = [...form.resume.projects];
                          const hs = next[idx].highlights.filter((_, i) => i !== hIdx);
                          next[idx] = { ...next[idx], highlights: hs.length ? hs : [''] };
                          setForm({ ...form, resume: { ...form.resume, projects: next } });
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const next = form.resume.projects.filter((_, i) => i !== idx);
                    setForm({ ...form, resume: { ...form.resume, projects: next } });
                  }}
                >
                  Remove Project
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {submitError && (
        <div className="text-destructive text-sm">
          {submitError}
        </div>
      )}

      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" onClick={() => {
          setForm({
            firstName: '',
            lastName: '',
            email: '',
            phoneNumber: '',
            address: '',
            resumeLink: '',
            age: '' as unknown as number | '',
            resume: { summary: '', skills: [''], experience: [], projects: [] }
          })
          setSubmitError(null);
        }}>Clear</Button>
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? 'Adding...' : 'Add Candidate'}
        </Button>
      </div>
    </div>
  );
}


