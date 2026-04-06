import { cn } from "@/lib/utils";
import { Quote } from "lucide-react";

interface TestimonialBlockProps {
  name: string;
  content: string;
  className?: string;
}

/**
 * Client testimonial block — quote with attribution.
 * Clean typography with border-left accent and large quote icon.
 */
export function TestimonialBlock({ name, content, className }: TestimonialBlockProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border bg-gradient-to-br from-primary/3 via-background to-blue-50/30 dark:to-blue-950/10 p-8 md:p-10",
        className,
      )}
    >
      {/* Large quote icon */}
      <Quote
        className="absolute -right-4 -top-4 h-28 w-28 rotate-12 text-primary/5"
        strokeWidth={1}
      />

      <div className="relative">
        {/* Quote mark */}
        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
          <Quote className="h-5 w-5 text-primary" />
        </div>

        {/* Content */}
        <blockquote className="mb-6 text-base leading-relaxed text-foreground/90 italic md:text-lg">
          "{content}"
        </blockquote>

        {/* Attribution */}
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <cite className="not-italic text-sm font-semibold text-foreground/70">
            — {name}
          </cite>
        </div>
      </div>
    </div>
  );
}
