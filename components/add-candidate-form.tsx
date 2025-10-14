"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import api from "@/lib/api";
import { WizardStep, AddCandidateFormProps } from "@/types/candidate";
import Stepper from "@/components/stepper";
import { personalForm } from "@/constants/candidate-form-contants";
import { contactForm } from "@/constants/candidate-form-contants";
import { useCandidateForm } from "@/hooks/use-candidate-form";
import ResumeSummarySkillsSection from "@/components/candidate/resume-summary-skills";
import ExperienceEditorSection from "@/components/candidate/experience-editor";
import ProjectsEditorSection from "@/components/candidate/projects-editor";
import { EMAIL_REGEX } from "@/constants/candidate-form-contants";

export default function AddCandidateForm({ onSuccess }: AddCandidateFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<WizardStep>("personal");
  const [showErrors, setShowErrors] = useState(false);
  const { form, setForm, resetForm } = useCandidateForm();

  const emailRegex = EMAIL_REGEX;

  const stepOrder: WizardStep[] = [
    "personal",
    "contact",
    "resume",
    "experience",
    "projects",
    "review",
  ];
  const currentIndex = stepOrder.indexOf(currentStep);
  const canGoBack = currentIndex > 0;
  const canGoNext = currentIndex < stepOrder.length - 1;

  const personalValid = !!(
    form.firstName?.trim() &&
    form.lastName?.trim() &&
    form.age !== "" &&
    Number(form.age) >= 12 &&
    Number(form.age) <= 100
  );
  const contactValid = !!(
    emailRegex.test(form.email) &&
    form.phoneNumber?.trim() &&
    form.address?.trim() &&
    form.resumeLink?.trim()
  );
  const resumeValid = true; // optional summary and skills

  const canProceedFromStep = (step: WizardStep) => {
    if (step === "personal") return personalValid;
    if (step === "contact") return contactValid;
    if (step === "resume") return resumeValid;
    if (step === "experience") return true;
    if (step === "projects") return true;
    return true;
  };

  // Build request payload from current form state
  const buildCandidatePayload = () => {
    return {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim().toLowerCase(),
      phoneNumber: form.phoneNumber.trim(),
      address: form.address.trim(),
      resumeLink: form.resumeLink.trim(),
      age: Number(form.age),
      resume: {
        summary: form.resume.summary?.trim() || undefined,
        skills: (form.resume.skills || []).map((s) => s.trim()).filter(Boolean),
        experience: (form.resume.experience || [])
          .map((e) => ({
            title: e.title?.trim(),
            company: e.company?.trim(),
            location: e.location?.trim() || undefined,
            startDate: e.startDate ? new Date(e.startDate) : undefined,
            endDate: e.endDate ? new Date(e.endDate) : undefined,
            current: !!e.current,
            description: e.description?.trim() || undefined,
            highlights: (e.highlights || [])
              .map((h) => h.trim())
              .filter(Boolean),
          }))
          .filter((e) => e.title && e.company && e.startDate),
        projects: (form.resume.projects || [])
          .map((p) => ({
            name: p.name?.trim(),
            role: p.role?.trim() || undefined,
            description: p.description?.trim() || undefined,
            techStack: (p.techStack || []).map((t) => t.trim()).filter(Boolean),
            url: p.url?.trim() || undefined,
            startDate: p.startDate ? new Date(p.startDate) : undefined,
            endDate: p.endDate ? new Date(p.endDate) : undefined,
            highlights: (p.highlights || [])
              .map((h) => h.trim())
              .filter(Boolean),
          }))
          .filter((p) => p.name),
      },
    };
  };

  const goNext = () => {
    if (!canProceedFromStep(currentStep)) {
      setShowErrors(true);
      return;
    }
    if (canGoNext) {
      setCurrentStep(stepOrder[currentIndex + 1]);
      setShowErrors(false);
    }
  };

  const goBack = () => {
    if (canGoBack) {
      setCurrentStep(stepOrder[currentIndex - 1]);
      setShowErrors(false);
    }
  };

  // Keyboard shortcuts: Ctrl+Enter to continue, Alt+Left to go back
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "Enter") {
        e.preventDefault();
        if (canProceedFromStep(currentStep)) goNext();
      }
      if (e.altKey && (e.key === "ArrowLeft" || e.key === "Backspace")) {
        e.preventDefault();
        goBack();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [currentStep]);

  // Reset error visibility when step changes manually
  useEffect(() => {
    setShowErrors(false);
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
      setSubmitError("Please complete required steps before submitting.");
      setIsSubmitting(false);
      return;
    }

    try {
      await api.post("/candidate", buildCandidatePayload());
      resetForm();
      setCurrentStep("personal");
      if (onSuccess) onSuccess();
    } catch (e: any) {
      const message = e?.response?.data?.message || "Failed to add candidate";
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Stepper
        stepOrder={stepOrder}
        currentStep={currentStep}
        onStepChange={setCurrentStep}
      />

      {currentStep === "personal" && (
        <div className="space-y-3">
          {personalForm.map((cfg, idx) => (
            <div key={cfg.key}>
              <label className="text-sm font-medium">{cfg.label}</label>
              <Input
                placeholder={cfg.placeholder}
                type={cfg.type}
                value={
                  cfg.key === "age" ? (form.age as any) : (form as any)[cfg.key]
                }
                onChange={(e) => {
                  if (cfg.key === "age") {
                    setForm({ ...form, age: Number(e.target.value) });
                  } else {
                    setForm({ ...form, [cfg.key]: e.target.value } as any);
                  }
                }}
                ref={idx === 0 ? firstFieldRef : undefined}
              />
              {cfg.key === "firstName" &&
                !form.firstName?.trim() &&
                showErrors && (
                  <p className="text-xs text-muted-foreground mt-1">Required</p>
                )}
              {cfg.key === "lastName" &&
                !form.lastName?.trim() &&
                showErrors && (
                  <p className="text-xs text-muted-foreground mt-1">Required</p>
                )}
              {cfg.key === "age" &&
                showErrors &&
                !(
                  form.age !== "" &&
                  Number(form.age) >= 12 &&
                  Number(form.age) <= 100
                ) && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Enter age between 12 and 100
                  </p>
                )}
            </div>
          ))}
        </div>
      )}

      {currentStep === "contact" && (
        <div className="space-y-3">
          {contactForm.map((cfg, idx) => (
            <div key={cfg.key}>
              <label className="text-sm font-medium">{cfg.label}</label>
              <Input
                placeholder={cfg.placeholder}
                type={cfg.type}
                value={(form as any)[cfg.key]}
                onChange={(e) =>
                  setForm({ ...form, [cfg.key]: e.target.value } as any)
                }
                ref={idx === 0 ? firstFieldRef : undefined}
              />
              {cfg.key === "email" &&
                showErrors &&
                !emailRegex.test(form.email) && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Enter a valid email
                  </p>
                )}
              {cfg.key === "phoneNumber" &&
                !form.phoneNumber?.trim() &&
                showErrors && (
                  <p className="text-xs text-muted-foreground mt-1">Required</p>
                )}
              {cfg.key === "address" && !form.address?.trim() && showErrors && (
                <p className="text-xs text-muted-foreground mt-1">Required</p>
              )}
              {cfg.key === "resumeLink" &&
                !form.resumeLink?.trim() &&
                showErrors && (
                  <p className="text-xs text-muted-foreground mt-1">Required</p>
                )}
            </div>
          ))}
        </div>
      )}

      {currentStep === "resume" && (
        <ResumeSummarySkillsSection
          summary={form.resume.summary}
          skills={form.resume.skills}
          onChangeSummary={(value) =>
            setForm({ ...form, resume: { ...form.resume, summary: value } })
          }
          onChangeSkill={(index, value) => {
            const next = [...form.resume.skills];
            next[index] = value;
            setForm({ ...form, resume: { ...form.resume, skills: next } });
          }}
          onAddSkill={() =>
            setForm({
              ...form,
              resume: { ...form.resume, skills: [...form.resume.skills, ""] },
            })
          }
          onRemoveSkill={(index) => {
            const next = form.resume.skills.filter((_, i) => i !== index);
            setForm({
              ...form,
              resume: { ...form.resume, skills: next.length ? next : [""] },
            });
          }}
        />
      )}

      {currentStep === "experience" && (
        <ExperienceEditorSection
          experience={form.resume.experience}
          onAdd={() =>
            setForm({
              ...form,
              resume: {
                ...form.resume,
                experience: [
                  ...form.resume.experience,
                  {
                    title: "",
                    company: "",
                    location: "",
                    startDate: "",
                    endDate: "",
                    current: false,
                    description: "",
                    highlights: [""],
                  },
                ],
              },
            })
          }
          onRemove={(idx) => {
            const next = form.resume.experience.filter((_, i) => i !== idx);
            setForm({ ...form, resume: { ...form.resume, experience: next } });
          }}
          onChange={(idx, nextItem) => {
            const next = [...form.resume.experience];
            next[idx] = nextItem;
            setForm({ ...form, resume: { ...form.resume, experience: next } });
          }}
        />
      )}

      {currentStep === "projects" && (
        <ProjectsEditorSection
          projects={form.resume.projects}
          onAdd={() =>
            setForm({
              ...form,
              resume: {
                ...form.resume,
                projects: [
                  ...form.resume.projects,
                  {
                    name: "",
                    role: "",
                    description: "",
                    techStack: [""],
                    url: "",
                    startDate: "",
                    endDate: "",
                    highlights: [""],
                  },
                ],
              },
            })
          }
          onRemove={(idx) => {
            const next = form.resume.projects.filter((_, i) => i !== idx);
            setForm({ ...form, resume: { ...form.resume, projects: next } });
          }}
          onChange={(idx, nextItem) => {
            const next = [...form.resume.projects];
            next[idx] = nextItem;
            setForm({ ...form, resume: { ...form.resume, projects: next } });
          }}
        />
      )}

      {currentStep === "review" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Basics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-muted-foreground">Name</div>
                  <div className="font-medium">
                    {form.firstName} {form.lastName}
                  </div>
                  <div className="text-muted-foreground">Age</div>
                  <div className="font-medium">{String(form.age)}</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-muted-foreground">Email</div>
                  <div className="font-medium break-all whitespace-pre-wrap">
                    {form.email}
                  </div>
                  <div className="text-muted-foreground">Phone</div>
                  <div className="font-medium break-words whitespace-pre-wrap">
                    {form.phoneNumber}
                  </div>
                  <div className="text-muted-foreground">Address</div>
                  <div className="font-medium break-words whitespace-pre-wrap">
                    {form.address}
                  </div>
                  <div className="text-muted-foreground">Resume</div>
                  <div className="font-medium break-all whitespace-pre-wrap">
                    {form.resumeLink}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {(form.resume.summary?.trim() ||
            (form.resume.skills || []).filter(Boolean).length > 0) && (
            <Card>
              <CardHeader>
                <CardTitle>Summary & Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  {form.resume.summary?.trim() && (
                    <div className="leading-relaxed break-words whitespace-pre-wrap">
                      {form.resume.summary}
                    </div>
                  )}
                  {(form.resume.skills || []).filter(Boolean).length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {(form.resume.skills || [])
                        .filter(Boolean)
                        .map((s, i) => (
                          <span
                            key={`rev-skill-${i}`}
                            className="px-2 py-0.5 rounded bg-muted text-xs"
                          >
                            {s}
                          </span>
                        ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {(form.resume.experience || []).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Experience</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  {form.resume.experience.map((e, i) => (
                    <div key={`r-exp-${i}`} className="rounded-md border p-3">
                      <div className="font-medium">
                        {e.title} {e.company ? `at ${e.company}` : ""}
                      </div>
                      <div className="text-muted-foreground">
                        {e.startDate || "—"} -{" "}
                        {e.current ? "Present" : e.endDate || "—"}
                      </div>
                      {e.description?.trim() && (
                        <div className="mt-2 leading-relaxed break-words whitespace-pre-wrap">
                          {e.description}
                        </div>
                      )}
                      {(e.highlights || []).filter(Boolean).length > 0 && (
                        <ul className="mt-2 list-disc pl-5 space-y-1">
                          {(e.highlights || [])
                            .filter(Boolean)
                            .map((h, hIdx) => (
                              <li key={`r-exp-${i}-h-${hIdx}`}>{h}</li>
                            ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {(form.resume.projects || []).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  {form.resume.projects.map((p, i) => (
                    <div key={`r-proj-${i}`} className="rounded-md border p-3">
                      <div className="font-medium">{p.name}</div>
                      <div className="text-muted-foreground">
                        {p.startDate || "—"} - {p.endDate || "—"}
                      </div>
                      {p.description?.trim() && (
                        <div className="mt-2 leading-relaxed break-words whitespace-pre-wrap">
                          {p.description}
                        </div>
                      )}
                      {(p.techStack || []).filter(Boolean).length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {(p.techStack || [])
                            .filter(Boolean)
                            .map((t, tIdx) => (
                              <span
                                key={`r-proj-${i}-t-${tIdx}`}
                                className="px-2 py-0.5 rounded bg-muted text-xs"
                              >
                                {t}
                              </span>
                            ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {submitError && (
            <div className="text-destructive text-sm">{submitError}</div>
          )}

          <div className="flex justify-between">
            <Button variant="outline" onClick={goBack} disabled={isSubmitting}>
              Back
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </div>
      )}

      {currentStep !== "review" && (
        <div className="flex items-center justify-between pt-2">
          <div>
            <Button
              variant="outline"
              onClick={() => {
                resetForm();
                setSubmitError(null);
                setCurrentStep("personal");
                setShowErrors(false);
              }}
            >
              Clear all
            </Button>
          </div>
          <div>
            <Button variant="outline" onClick={goBack} disabled={!canGoBack}>
              Back
            </Button>
          </div>
          <div>
            <Button onClick={goNext}>Continue</Button>
          </div>
        </div>
      )}
    </div>
  );
}
