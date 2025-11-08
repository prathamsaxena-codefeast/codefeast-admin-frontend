"use client";

import React, { useState, useMemo } from "react";
import { Plus, X } from "lucide-react";
import {
  DialogTrigger,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  jobTypes,
  jobCategories,
  experienceLevels,
} from "@/constants/job-management.json";
import { CreateJobModalProps, JobCreationType as InitState } from "@/types/job";
import api from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const initialFormData: InitState = {
  title: "",
  location: { city: "", state: "", country: "", remote: false },
  type: "",
  category: "",
  description: "",
  requirements: [],
  salary: { min: "", max: "", currency: "USD" },
  experienceLevel: "",
  deadline: "",
};

export const CreateJobModal: React.FC<CreateJobModalProps> = ({
  isOpen,
  setIsOpen,
  onUserCreated,
}) => {
  const [formData, setFormData] = useState<InitState>(initialFormData);
  const { toast } = useToast();
  const [currentRequirement, setCurrentRequirement] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type, checked } = e.target as any;
    if (name.startsWith("location.")) {
      const prop = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        location: { ...prev.location, [prop]: value },
      }));
      return;
    }
    if (name.startsWith("salary.")) {
      const prop = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        salary: { ...prev.salary, [prop]: value },
      }));
      return;
    }
    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        location: { ...prev.location, remote: checked },
      }));
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value } as any));
  };

  const addRequirement = () => {
    if (currentRequirement.trim()) {
      setFormData((prev) => ({
        ...prev,
        requirements: [...prev.requirements, currentRequirement.trim()],
      }));
      setCurrentRequirement("");
    }
  };

  const removeRequirement = (indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== indexToRemove),
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = "Job title is required.";
    if (!formData.type) newErrors.type = "Job type is required.";
    if (!formData.category) newErrors.category = "Job category is required.";
    if (!formData.experienceLevel)
      newErrors.experienceLevel = "Experience level is required.";
    if (!formData.description.trim())
      newErrors.description = "Job description is required.";

    if (!formData.location.remote) {
      if (!formData.location.city.trim()) newErrors.city = "City is required.";
      if (!formData.location.state.trim())
        newErrors.state = "State is required.";
      if (!formData.location.country.trim())
        newErrors.country = "Country is required.";
    }

    if (formData.salary.min && formData.salary.max) {
      if (Number(formData.salary.min) > Number(formData.salary.max)) {
        newErrors.salary =
          "Max salary must be greater than or equal to min salary.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);

    const newJob = {
      ...formData,
      salary: {
        ...formData.salary,
        min: formData.salary.min ? Number(formData.salary.min) : null,
        max: formData.salary.max ? Number(formData.salary.max) : null,
      },
    };

    try {
      const response = await api.post("/job", newJob);
      toast.success("Job created successfully", {
        description: response.data.message,
      });
      setIsLoading(false);
      setIsOpen(false);
      setFormData(initialFormData);
      setErrors({});
      onUserCreated();
    } catch (err: any) {
      toast.error("Error creating Job", {
        description: err.response?.data?.message || err.message,
      });
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg shadow-sm">
          <Plus className="w-4 h-4" />
          Create Job
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl bg-card text-card-foreground p-6 rounded-lg shadow-xl border border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            Create New Job Post
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Fill in the details below to post a new job opening.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4 max-h-[65vh] hide-scrollbar overflow-y-auto px-1">
            <div>
              <label htmlFor="title" className="block font-medium">
                Job Title
              </label>
              <input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Senior Software Engineer"
                className="w-full bg-input border border-border rounded-md px-3 py-2 mt-1"
              />
              {errors.title && (
                <p className="text-sm text-destructive mt-1">{errors.title}</p>
              )}
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block font-medium">Job Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full mt-1 bg-input border border-border rounded-md px-3 py-2"
                >
                  <option value="">Select a type</option>
                  {jobTypes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                {errors.type && (
                  <p className="text-sm text-destructive mt-1">{errors.type}</p>
                )}
              </div>

              <div>
                <label className="block font-medium">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full mt-1 bg-input border border-border rounded-md px-3 py-2"
                >
                  <option value="">Select a category</option>
                  {jobCategories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.category}
                  </p>
                )}
              </div>

              <div>
                <label className="block font-medium">Experience Level</label>
                <select
                  name="experienceLevel"
                  value={formData.experienceLevel}
                  onChange={handleChange}
                  className="w-full mt-1 bg-input border border-border rounded-md px-3 py-2"
                >
                  <option value="">Select a level</option>
                  {experienceLevels.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
                {errors.experienceLevel && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.experienceLevel}
                  </p>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block font-medium">Location</label>
                <input
                  name="location.city"
                  value={formData.location.city}
                  onChange={handleChange}
                  disabled={formData.location.remote}
                  placeholder="City"
                  className="w-full mt-1 bg-input border border-border rounded-md px-3 py-2"
                />
                {errors.city && (
                  <p className="text-sm text-destructive mt-1">{errors.city}</p>
                )}
              </div>

              <div>
                <input
                  name="location.state"
                  value={formData.location.state}
                  onChange={handleChange}
                  disabled={formData.location.remote}
                  placeholder="State"
                  className="w-full mt-6 bg-input border border-border rounded-md px-3 py-2"
                />
                {errors.state && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.state}
                  </p>
                )}
              </div>

              <div>
                <input
                  name="location.country"
                  value={formData.location.country}
                  onChange={handleChange}
                  disabled={formData.location.remote}
                  placeholder="Country"
                  className="w-full mt-6 bg-input border border-border rounded-md px-3 py-2"
                />
                {errors.country && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.country}
                  </p>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block font-medium">Min Salary</label>
                <input
                  name="salary.min"
                  value={formData.salary.min}
                  onChange={handleChange}
                  type="number"
                  placeholder="e.g., 80000"
                  className="w-full mt-1 bg-input border border-border rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block font-medium">Max Salary</label>
                <input
                  name="salary.max"
                  value={formData.salary.max}
                  onChange={handleChange}
                  type="number"
                  placeholder="e.g., 120000"
                  className="w-full mt-1 bg-input border border-border rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block font-medium">Currency</label>
                <input
                  name="salary.currency"
                  value={formData.salary.currency}
                  onChange={handleChange}
                  placeholder="USD"
                  className="w-full mt-1 bg-input border border-border rounded-md px-3 py-2"
                />
              </div>
              {errors.salary && (
                <p className="text-sm text-destructive mt-1 col-span-3">
                  {errors.salary}
                </p>
              )}
            </div>

            <div>
              <label className="block font-medium">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the role, responsibilities, and benefits..."
                className="w-full mt-1 bg-input border border-border rounded-md px-3 py-2 min-h-[120px]"
              />
              {errors.description && (
                <p className="text-sm text-destructive mt-1">
                  {errors.description}
                </p>
              )}
            </div>

            <div>
              <label className="block font-medium">Requirements</label>
              <div className="flex gap-2 mt-2">
                <input
                  value={currentRequirement}
                  onChange={(e) => setCurrentRequirement(e.target.value)}
                  placeholder="e.g., 3+ years of React"
                  className="flex-1 bg-input border border-border rounded-md px-3 py-2"
                />
                <Button type="button" onClick={addRequirement} className="px-4">
                  Add
                </Button>
              </div>
              <div className="flex gap-2 mt-2 flex-wrap">
                {formData.requirements.map((req, idx) => (
                  <div
                    key={idx}
                    className="bg-secondary text-secondary-foreground rounded-full px-3 py-1 flex items-center gap-2"
                  >
                    <span>{req}</span>
                    <button
                      type="button"
                      onClick={() => removeRequirement(idx)}
                      className="inline-flex items-center justify-center w-6 h-6 rounded-full"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-medium">
                Application Deadline (Optional)
              </label>
              <input
                name="deadline"
                type="date"
                value={formData.deadline}
                onChange={handleChange}
                className="w-full mt-1 bg-input border border-border rounded-md px-3 py-2"
              />
            </div>

            {errors.form && (
              <p className="text-sm text-destructive mt-1 text-center">
                {errors.form}
              </p>
            )}
          </div>

          <DialogFooter className="mt-6 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="mr-2"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Job"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
