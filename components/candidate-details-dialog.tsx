'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Calendar, MapPin, Phone, Mail, User, Briefcase, Code, Award, FileText } from 'lucide-react';
import type { Candidate } from '@/types/candidate';

interface CandidateDetailsDialogProps {
  candidate: Candidate | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function CandidateDetailsDialog({ candidate, isOpen, onClose }: CandidateDetailsDialogProps) {
  if (!candidate) return null;

  const formatDate = (date: string | Date) => {
    try {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Invalid Date';
    }
  };

  const formatDateRange = (startDate: string | Date, endDate?: string | Date, isCurrent?: boolean) => {
    const start = formatDate(startDate);
    if (isCurrent) {
      return `${start} - Present`;
    }
    if (endDate) {
      const end = formatDate(endDate);
      return `${start} - ${end}`;
    }
    return start;
  };

  const safeArray = (arr: any[] | undefined) => Array.isArray(arr) ? arr : [];
  const safeString = (str: string | undefined) => str || 'Not provided';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-[95vw] h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0 pb-4 border-b">
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {candidate.firstName} {candidate.lastName}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto pr-2 min-h-0 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <User className="h-4 w-4" />
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Email:</span>
                </div>
                <p className="text-sm text-muted-foreground break-all">{candidate.email}</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Phone:</span>
                </div>
                <p className="text-sm text-muted-foreground">{safeString(candidate.phoneNumber)}</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Age:</span>
                </div>
                <p className="text-sm text-muted-foreground">{candidate.age || 'Not provided'}</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Address:</span>
                </div>
                <p className="text-sm text-muted-foreground">{safeString(candidate.address)}</p>
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <div className="flex items-center gap-2">
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Resume Link:</span>
                </div>
                {candidate.resumeLink ? (
                  <a 
                    href={candidate.resumeLink} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-primary underline text-sm break-all hover:text-primary/80"
                  >
                    {candidate.resumeLink}
                  </a>
                ) : (
                  <p className="text-sm text-muted-foreground">Not provided</p>
                )}
              </div>
            </div>
          </div>

          {/* Resume Summary */}
          {candidate.resume?.summary && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Professional Summary
              </h3>
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm leading-relaxed">{candidate.resume.summary}</p>
              </div>
            </div>
          )}

          {/* Skills */}
          {safeArray(candidate.resume?.skills).length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Award className="h-4 w-4" />
                Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {candidate.resume?.skills?.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Experience */}
          {safeArray(candidate.resume?.experience).length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Work Experience
              </h3>
              <div className="space-y-4">
                {candidate.resume?.experience?.map((exp, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-base">{exp.title}</h4>
                        <p className="text-sm text-muted-foreground">{exp.company}</p>
                        {exp.location && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                            <MapPin className="h-3 w-3" />
                            {exp.location}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                        </p>
                        {exp.current && (
                          <Badge variant="default" className="text-xs mt-1">Current</Badge>
                        )}
                      </div>
                    </div>
                    
                    {exp.description && (
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {exp.description}
                      </p>
                    )}
                    
                    {safeArray(exp.highlights).length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-2">Key Highlights:</p>
                        <ul className="list-disc list-inside space-y-1">
                          {exp.highlights?.map((highlight, hIndex) => (
                            <li key={hIndex} className="text-sm text-muted-foreground">
                              {highlight}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {safeArray(candidate.resume?.projects).length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Code className="h-4 w-4" />
                Projects
              </h3>
              <div className="space-y-4">
                {candidate.resume?.projects?.map((project, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-base">{project.name}</h4>
                        {project.role && (
                          <p className="text-sm text-muted-foreground">{project.role}</p>
                        )}
                      </div>
                      <div className="text-right">
                        {(project.startDate || project.endDate) && (
                          <p className="text-sm font-medium">
                            {formatDateRange(project.startDate || '', project.endDate)}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    {project.description && (
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {project.description}
                      </p>
                    )}
                    
                    {project.url && (
                      <div>
                        <a 
                          href={project.url} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-primary underline text-sm hover:text-primary/80 flex items-center gap-1"
                        >
                          <ExternalLink className="h-3 w-3" />
                          View Project
                        </a>
                      </div>
                    )}
                    
                    {safeArray(project.techStack).length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-2">Technologies Used:</p>
                        <div className="flex flex-wrap gap-1">
                          {project.techStack?.map((tech, tIndex) => (
                            <Badge key={tIndex} variant="outline" className="text-xs">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {safeArray(project.highlights).length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-2">Key Highlights:</p>
                        <ul className="list-disc list-inside space-y-1">
                          {project.highlights?.map((highlight, hIndex) => (
                            <li key={hIndex} className="text-sm text-muted-foreground">
                              {highlight}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Additional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Additional Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Created:</span>
                <p className="text-muted-foreground">{formatDate(candidate.createdAt)}</p>
              </div>
              <div>
                <span className="font-medium">Last Updated:</span>
                <p className="text-muted-foreground">{formatDate(candidate.updatedAt)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 flex-shrink-0 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
