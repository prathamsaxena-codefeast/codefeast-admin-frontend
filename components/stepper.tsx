"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { WizardStep } from "@/types/candidate";

type StepperProps = {
  stepOrder: WizardStep[];
  currentStep: WizardStep;
  onStepChange: (step: WizardStep) => void;
};

export default function Stepper({ stepOrder, currentStep, onStepChange }: StepperProps) {
  const stepRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const stepsContainerRef = useRef<HTMLDivElement | null>(null);
  const [sliderLeft, setSliderLeft] = useState(0);
  const [sliderWidth, setSliderWidth] = useState(0);

  const currentIndex = useMemo(() => stepOrder.indexOf(currentStep), [stepOrder, currentStep]);

  // Position slider under active step using equal-width columns (static track)
  useEffect(() => {
    const update = () => {
      const container = stepsContainerRef.current;
      if (!container) return;
      const containerRect = container.getBoundingClientRect();
      const styles = window.getComputedStyle(container);
      const gapPx = parseFloat(styles.columnGap || (styles as any).gap || "0");
      const steps = stepOrder.length;
      const totalGaps = gapPx * (steps - 1);
      const contentWidth = containerRect.width - totalGaps;
      const colWidth = contentWidth / steps;
      const desiredWidth = Math.max(Math.min(colWidth * 0.95, 260), 180);
      const left = currentIndex * (colWidth + gapPx) + (colWidth - desiredWidth) / 2;
      setSliderLeft(left);
      setSliderWidth(desiredWidth);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [currentIndex, stepOrder.length]);

  return (
    <div className="flex flex-col gap-2">
      <div className="relative">
        <div ref={stepsContainerRef} className="grid grid-cols-6 gap-2 items-center text-sm w-full">
        {stepOrder.map((step, idx) => {
          const isActive = step === currentStep;
          const isDone = stepOrder.indexOf(step) < currentIndex;
          const labelMap: Record<WizardStep, string> = {
            personal: "Basic Info",
            contact: "Contact",
            resume: "Summary & Skills",
            experience: "Experience",
            projects: "Projects",
            review: "Review",
          };
          return (
            <button
              type="button"
              key={step}
              ref={(el) => {
                stepRefs.current[idx] = el;
              }}
              onClick={() => onStepChange(step)}
              className="flex items-center justify-start gap-2 cursor-pointer hover:opacity-90"
            >
              <div
                className={`h-6 min-w-6 rounded-full flex items-center justify-center text-xs px-2 ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : isDone
                    ? "bg-muted text-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {idx + 1}
              </div>
              <span
                className={`${
                  isActive ? "font-medium" : "text-muted-foreground"
                }`}
              >
                {labelMap[step]}
              </span>
            </button>
          );
        })}
        </div>
        <div className="relative mt-2 w-full rounded-full bg-muted overflow-hidden" style={{ height: 6 }}>
          <div className="absolute top-0 bg-primary rounded-full transition-transform duration-300"
               style={{ transform: `translateX(${sliderLeft}px)`, width: sliderWidth, height: 6 }}
          />
        </div>
      </div>
    </div>
  );
}


