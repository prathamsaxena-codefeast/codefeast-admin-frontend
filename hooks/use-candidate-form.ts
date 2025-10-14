import { useState } from "react";

export type CandidateExperience = {
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  highlights: string[];
};

export type CandidateProject = {
  name: string;
  role: string;
  description: string;
  techStack: string[];
  url: string;
  startDate: string;
  endDate: string;
  highlights: string[];
};

export type CandidateFormState = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  resumeLink: string;
  age: number | "";
  resume: {
    summary: string;
    skills: string[];
    experience: CandidateExperience[];
    projects: CandidateProject[];
  };
};

const createInitialForm = (): CandidateFormState => ({
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  address: "",
  resumeLink: "",
  age: "",
  resume: {
    summary: "",
    skills: [""],
    experience: [],
    projects: [],
  },
});

export function useCandidateForm() {
  const [form, setForm] = useState<CandidateFormState>(createInitialForm());
  const resetForm = () => setForm(createInitialForm());
  return { form, setForm, resetForm };
}


