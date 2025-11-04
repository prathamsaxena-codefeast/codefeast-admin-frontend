export type JobLocation = {
  city: string;
  state: string;
  country: string;
  remote: boolean;
};

export type Salary = {
  min: string;
  max: string;
  currency: string;
};

export type Job = {
  _id: string;
  title: string;
  location: JobLocation;
  type: string;
  category: string;
  description: string;
  requirements: string[];
  salary: Salary;
  experienceLevel: string;
  deadline?: string;
  isActive?: boolean;
};

export type JobCreationType = {
  title: string;
  location: JobLocation;
  type: string;
  category: string;
  description: string;
  requirements: string[];
  salary: Salary;
  experienceLevel: string;
  deadline?: string;
};

export type CreateJobModalProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onUserCreated: () => void;
};
