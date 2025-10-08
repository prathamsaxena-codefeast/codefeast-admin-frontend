'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import api from '@/lib/api';
import { Plus } from 'lucide-react';

interface AddCandidateFormProps {
  onSuccess?: () => void;
}

type WizardStep = 'personal' | 'contact' | 'resume' | 'experience' | 'projects' | 'review';

export default function AddCandidateForm({ onSuccess }: AddCandidateFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<WizardStep>('personal');
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

  const emailRegex = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/, []);

  const stepOrder: WizardStep[] = ['personal', 'contact', 'resume', 'experience', 'projects', 'review'];
  const currentIndex = stepOrder.indexOf(currentStep);
  const canGoBack = currentIndex > 0;
  const canGoNext = currentIndex < stepOrder.length - 1;

  const personalValid = !!(form.firstName?.trim() && form.lastName?.trim() && form.age !== '' && Number(form.age) >= 12 && Number(form.age) <= 100);
  const contactValid = !!(emailRegex.test(form.email) && form.phoneNumber?.trim() && form.address?.trim() && form.resumeLink?.trim());
  const resumeValid = true; // optional summary and skills

  const canProceedFromStep = (step: WizardStep) => {
    if (step === 'personal') return personalValid;
    if (step === 'contact') return contactValid;
    if (step === 'resume') return resumeValid;
    if (step === 'experience') return true;
    if (step === 'projects') return true;
    return true;
  };

  const goNext = () => {
    if (!canProceedFromStep(currentStep)) return;
    if (canGoNext) setCurrentStep(stepOrder[currentIndex + 1]);
  };

  const goBack = () => {
    if (canGoBack) setCurrentStep(stepOrder[currentIndex - 1]);
  };

  // Keyboard shortcuts: Ctrl+Enter to continue, Alt+Left to go back
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'Enter') {
        e.preventDefault();
        if (canProceedFromStep(currentStep)) goNext();
      }
      if (e.altKey && (e.key === 'ArrowLeft' || e.key === 'Backspace')) {
        e.preventDefault();
        goBack();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [currentStep]);

  // Autofocus first field per step
  const firstFieldRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    firstFieldRef.current?.focus();
  }, [currentStep]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    if (!personalValid || !contactValid) {
      setSubmitError('Please complete required steps before submitting.');
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
      setCurrentStep('personal');
      if (onSuccess) onSuccess();
    } catch (e: any) {
      const message = e?.response?.data?.message || 'Failed to add candidate';
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const Stepper = () => (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-6 gap-2 items-center text-sm w-full">
        {stepOrder.map((step, idx) => {
          const isActive = step === currentStep;
          const isDone = stepOrder.indexOf(step) < currentIndex;
          const labelMap: Record<WizardStep, string> = {
            personal: 'Basic Info',
            contact: 'Contact',
            resume: 'Summary & Skills',
            experience: 'Experience',
            projects: 'Projects',
            review: 'Review',
          };
          return (
            <div key={step} className="flex items-center justify-start gap-2">
              <div className={`h-6 min-w-6 rounded-full flex items-center justify-center text-xs px-2 ${isActive ? 'bg-primary text-primary-foreground' : isDone ? 'bg-muted text-foreground' : 'bg-muted text-muted-foreground'}`}>{idx + 1}</div>
              <span className={`${isActive ? 'font-medium' : 'text-muted-foreground'}`}>{labelMap[step]}</span>
            </div>
          );
        })}
      </div>
      <div className="relative h-1 w-full rounded bg-muted overflow-hidden">
        <div
          className="progress-fill h-full bg-primary transition-all duration-500"
          style={{ width: `${((currentIndex + 1) / stepOrder.length) * 100}%` }}
        />
        <div className="progress-sparkle pointer-events-none absolute inset-0" />
      </div>
      {/* Scoped styles for shimmer/sparkle */}
      <style jsx>{`
        .progress-fill { position: relative; }
        .progress-sparkle {
          background: repeating-linear-gradient(
            100deg,
            rgba(255,255,255,0.0) 0px,
            rgba(255,255,255,0.0) 8px,
            rgba(255,255,255,0.06) 9px,
            rgba(255,255,255,0.06) 14px
          );
          animation: shimmer 1.6s linear infinite;
          mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
        }
        @keyframes shimmer {
          0% { background-position: 0 0; }
          100% { background-position: 120px 0; }
        }
      `}</style>
    </div>
  );

  return (
    <div className="flex flex-col gap-4">
      <Stepper />

      {currentStep === 'personal' && (
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium">First name</label>
            <Input placeholder="e.g., Jane" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} ref={firstFieldRef} />
            {!form.firstName?.trim() && <p className="text-xs text-muted-foreground mt-1">Required</p>}
          </div>
          <div>
            <label className="text-sm font-medium">Last name</label>
            <Input placeholder="e.g., Doe" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
            {!form.lastName?.trim() && <p className="text-xs text-muted-foreground mt-1">Required</p>}
          </div>
          <div>
            <label className="text-sm font-medium">Age</label>
            <Input placeholder="e.g., 28" type="number" value={form.age as any} onChange={(e) => setForm({ ...form, age: Number(e.target.value) })} />
            {(!(form.age !== '' && Number(form.age) >= 12 && Number(form.age) <= 100)) && <p className="text-xs text-muted-foreground mt-1">Enter age between 12 and 100</p>}
          </div>
        </div>
      )}

      {currentStep === 'contact' && (
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium">Email</label>
            <Input placeholder="name@example.com" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} ref={firstFieldRef} />
            {!emailRegex.test(form.email) && <p className="text-xs text-muted-foreground mt-1">Enter a valid email</p>}
          </div>
          <div>
            <label className="text-sm font-medium">Phone number</label>
            <Input placeholder="e.g., +1 555 123 4567" value={form.phoneNumber} onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })} />
            {!form.phoneNumber?.trim() && <p className="text-xs text-muted-foreground mt-1">Required</p>}
          </div>
          <div>
            <label className="text-sm font-medium">Address</label>
            <Input placeholder="Street, City, Country" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            {!form.address?.trim() && <p className="text-xs text-muted-foreground mt-1">Required</p>}
          </div>
          <div>
            <label className="text-sm font-medium">Resume link</label>
            <Input placeholder="e.g., Google Drive or portfolio URL" value={form.resumeLink} onChange={(e) => setForm({ ...form, resumeLink: e.target.value })} />
            {!form.resumeLink?.trim() && <p className="text-xs text-muted-foreground mt-1">Required</p>}
          </div>
        </div>
      )}

      {currentStep === 'resume' && (
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium">Professional summary</label>
            <textarea
              placeholder="Summarize experience and strengths in 2-3 sentences"
              value={form.resume.summary}
              onChange={(e) => setForm({ ...form, resume: { ...form.resume, summary: e.target.value } })}
              className="h-20 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
            />
            <p className="text-xs text-muted-foreground mt-1">Optional</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center">
              <label className="text-sm font-medium">Top skills</label>
            </div>
            <div className="mt-3">
              <Button
                type="button"
                variant="soft"
                size="sm"
                onClick={() => setForm({ ...form, resume: { ...form.resume, skills: [...form.resume.skills, ''] } })}
              >
                Add another
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {form.resume.skills.map((skill, idx) => (
                <div key={`skill-${idx}`} className="flex items-center gap-2">
                  <Input
                    placeholder={`e.g., React, SQL, Leadership`}
                    value={skill}
                    onChange={(e) => {
                      const next = [...form.resume.skills];
                      next[idx] = e.target.value;
                      setForm({ ...form, resume: { ...form.resume, skills: next } });
                    }}
                  />
                  <Button
                    type="button"
                    variant="subtleDestructive"
                    size="sm"
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

          
        </div>
      )}

      {currentStep === 'experience' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Work experience</label>
          </div>
          <div className="mt-3">
            <Button
              type="button"
              variant="soft"
              size="sm"
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
              <Plus className="h-4 w-4 mr-1" /> Add role
            </Button>
          </div>
          <div className="space-y-3">
            {form.resume.experience.map((exp, idx) => (
              <div key={`exp-${idx}`} className="rounded-md border p-3 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <Input placeholder="Job title" value={exp.title} onChange={(e) => {
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
                  <Input placeholder="Location (optional)" value={exp.location} onChange={(e) => {
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
                  <label htmlFor={`exp-current-${idx}`} className="text-sm">I currently work here</label>
                </div>
                <div>
                  <textarea
                    placeholder="Briefly describe what you did in this role"
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
                  <div className="flex items-center">
                    <label className="text-sm">Highlights (optional)</label>
                  </div>
                  <div className="mt-3">
                    <Button
                      type="button"
                      variant="soft"
                      size="sm"
                      onClick={() => {
                        const next = [...form.resume.experience];
                        next[idx] = { ...next[idx], highlights: [...next[idx].highlights, ''] };
                        setForm({ ...form, resume: { ...form.resume, experience: next } });
                      }}
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
                            const next = [...form.resume.experience];
                            const hi = [...next[idx].highlights];
                            hi[hIdx] = e.target.value;
                            next[idx] = { ...next[idx], highlights: hi };
                            setForm({ ...form, resume: { ...form.resume, experience: next } });
                          }}
                        />
                      <Button
                        type="button"
                        variant="subtleDestructive"
                        size="sm"
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
                  variant="subtleDestructive"
                    onClick={() => {
                      const next = form.resume.experience.filter((_, i) => i !== idx);
                      setForm({ ...form, resume: { ...form.resume, experience: next } });
                    }}
                  >
                    Remove role
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {currentStep === 'projects' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Projects (optional)</label>
          </div>
          <div className="mt-3">
            <Button
              type="button"
              variant="soft"
              size="sm"
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
              <Plus className="h-4 w-4 mr-1" /> Add project
            </Button>
          </div>
          <div className="space-y-3">
            {form.resume.projects.map((p, idx) => (
              <div key={`proj-${idx}`} className="rounded-md border p-3 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <Input placeholder="Project name" value={p.name} onChange={(e) => {
                    const next = [...form.resume.projects];
                    next[idx] = { ...next[idx], name: e.target.value };
                    setForm({ ...form, resume: { ...form.resume, projects: next } });
                  }} />
                  <Input placeholder="Your role (optional)" value={p.role} onChange={(e) => {
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
                  <Input placeholder="URL (optional)" value={p.url} onChange={(e) => {
                    const next = [...form.resume.projects];
                    next[idx] = { ...next[idx], url: e.target.value };
                    setForm({ ...form, resume: { ...form.resume, projects: next } });
                  }} />
                </div>
                <div>
                  <textarea
                    placeholder="What was the project about?"
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
                  <div className="flex items-center">
                    <label className="text-sm">Tech stack</label>
                  </div>
                  <div className="mt-3">
                    <Button
                      type="button"
                      variant="soft"
                      size="sm"
                      onClick={() => {
                        const next = [...form.resume.projects];
                        next[idx] = { ...next[idx], techStack: [...next[idx].techStack, ''] };
                        setForm({ ...form, resume: { ...form.resume, projects: next } });
                      }}
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
                            const next = [...form.resume.projects];
                            const ts = [...next[idx].techStack];
                            ts[tIdx] = e.target.value;
                            next[idx] = { ...next[idx], techStack: ts };
                            setForm({ ...form, resume: { ...form.resume, projects: next } });
                          }}
                        />
                        <Button
                          type="button"
                          variant="subtleDestructive"
                          size="sm"
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
                  <div className="flex items-center">
                    <label className="text-sm">Highlights (optional)</label>
                  </div>
                  <div className="mt-3">
                    <Button
                      type="button"
                      variant="soft"
                      size="sm"
                      onClick={() => {
                        const next = [...form.resume.projects];
                        next[idx] = { ...next[idx], highlights: [...next[idx].highlights, ''] };
                        setForm({ ...form, resume: { ...form.resume, projects: next } });
                      }}
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
                            const next = [...form.resume.projects];
                            const hs = [...next[idx].highlights];
                            hs[hIdx] = e.target.value;
                            next[idx] = { ...next[idx], highlights: hs };
                            setForm({ ...form, resume: { ...form.resume, projects: next } });
                          }}
                        />
                        <Button
                          type="button"
                          variant="subtleDestructive"
                          size="sm"
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
                  variant="subtleDestructive"
                    onClick={() => {
                      const next = form.resume.projects.filter((_, i) => i !== idx);
                      setForm({ ...form, resume: { ...form.resume, projects: next } });
                    }}
                  >
                    Remove project
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {currentStep === 'review' && (
        <div className="space-y-4">
          <div className="rounded-md border p-3 space-y-1 text-sm">
            <div className="font-medium">Basics</div>
            <div>Name: {form.firstName} {form.lastName}</div>
            <div>Age: {String(form.age)}</div>
          </div>
          <div className="rounded-md border p-3 space-y-1 text-sm">
            <div className="font-medium">Contact</div>
            <div>Email: {form.email}</div>
            <div>Phone: {form.phoneNumber}</div>
            <div>Address: {form.address}</div>
            <div>Resume link: {form.resumeLink}</div>
          </div>
          {(form.resume.summary?.trim() || (form.resume.skills || []).filter(Boolean).length) ? (
            <div className="rounded-md border p-3 space-y-1 text-sm">
              <div className="font-medium">Summary & Skills</div>
              {form.resume.summary?.trim() && <div>Summary: {form.resume.summary}</div>}
              {(form.resume.skills || []).filter(Boolean).length > 0 && (
                <div>Skills: {(form.resume.skills || []).filter(Boolean).join(', ')}</div>
              )}
            </div>
          ) : null}
          {(form.resume.experience || []).length > 0 && (
            <div className="rounded-md border p-3 space-y-2 text-sm">
              <div className="font-medium">Experience</div>
              {form.resume.experience.map((e, i) => (
                <div key={`r-exp-${i}`}>{e.title} at {e.company}</div>
              ))}
            </div>
          )}
          {(form.resume.projects || []).length > 0 && (
            <div className="rounded-md border p-3 space-y-2 text-sm">
              <div className="font-medium">Projects</div>
              {form.resume.projects.map((p, i) => (
                <div key={`r-proj-${i}`}>{p.name}</div>
              ))}
            </div>
          )}

          {submitError && (
            <div className="text-destructive text-sm">{submitError}</div>
          )}

          <div className="flex justify-between">
            <Button variant="outline" onClick={goBack} disabled={isSubmitting}>Back</Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>{isSubmitting ? 'Submitting...' : 'Submit'}</Button>
          </div>
        </div>
      )}

      {currentStep !== 'review' && (
        <div className="flex items-center justify-between pt-2">
          {/* Left: Back */}
          <div>
            {canGoBack && <Button variant="outline" onClick={goBack}>Back</Button>}
          </div>
          {/* Center: Clear all */}
          <div>
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
            setCurrentStep('personal');
          }}>Clear all</Button>
          </div>
          {/* Right: Continue */}
          <div>
            <Button onClick={goNext} disabled={!canProceedFromStep(currentStep)}>Continue</Button>
          </div>
        </div>
      )}
    </div>
  );
}


