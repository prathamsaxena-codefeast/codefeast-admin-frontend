export interface Experience {
  title: string;
  company: string;
  location?: string;
  startDate: Date;
  endDate?: Date;
  current: boolean;
  description?: string;
  highlights?: string[];
}

export interface Project {
  name: string;
  role?: string;
  description?: string;
  techStack?: string[];
  url?: string;
  startDate?: Date;
  endDate?: Date;
  highlights?: string[];
}

export interface Resume {
  summary?: string;
  skills?: string[];
  experience?: Experience[];
  projects?: Project[];
}

export type Candidate = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  resumeLink: string;
  age: number;
  resume?: Resume;
  createdAt: string;
  updatedAt: string;
};


