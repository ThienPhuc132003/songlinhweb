import { motion } from "framer-motion";
import {
  Scale,
  Cog,
  Globe,
  Building2,
  ExternalLink,
  BookOpen,
} from "lucide-react";
import type { ReferenceItem } from './BlogCitations';

export const REF_TYPE_CONFIG = {
  law: {
    icon: Scale,
    label: 'Pháp lý',
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-950/30',
    border: 'border-amber-200 dark:border-amber-800',
  },
  standard: {
    icon: Cog,
    label: 'Tiêu chuẩn',
    color: 'text-primary dark:text-primary',
    bg: 'bg-primary/5 dark:bg-primary/10',
    border: 'border-primary/20 dark:border-primary/30',
  },
  news: {
    icon: Globe,
    label: 'Tin tức',
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-950/30',
    border: 'border-emerald-200 dark:border-emerald-800',
  },
  vendor: {
    icon: Building2,
    label: 'Nhà cung cấp',
    color: 'text-violet-600 dark:text-violet-400',
    bg: 'bg-violet-50 dark:bg-violet-950/30',
    border: 'border-violet-200 dark:border-violet-800',
  },
} as const;

export function ReferenceSection({ references }: { references: ReferenceItem[] }) {
  if (!references || references.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="mt-14 pt-10 border-t-2 border-border/60"
    >
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="h-10 w-10 rounded-sm bg-primary/10 flex items-center justify-center">
          <BookOpen className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-foreground tracking-tight">
            Tài liệu tham khảo & Căn cứ pháp lý
          </h3>
          <p className="text-xs text-muted-foreground">
            {references.length} nguồn tham khảo được sử dụng trong bài viết này
          </p>
        </div>
      </div>

      {/* Reference List */}
      <div className="space-y-3">
        {references.map((ref, idx) => {
          const config = REF_TYPE_CONFIG[ref.type] || REF_TYPE_CONFIG.standard;
          const IconComp = config.icon;
          return (
            <div
              key={idx}
              id={`ref-${idx + 1}`}
              className={`flex items-start gap-4 p-4 rounded-sm border ${config.border} ${config.bg} transition-all duration-200 hover:shadow-sm scroll-mt-24`}
            >
              {/* Number + Icon */}
              <div className="flex items-center gap-2.5 shrink-0 pt-0.5">
                <span className="text-xs font-bold text-muted-foreground w-6 text-center">
                  [{idx + 1}]
                </span>
                <div className={`h-8 w-8 rounded-sm flex items-center justify-center ${config.bg} border ${config.border}`}>
                  <IconComp className={`h-4 w-4 ${config.color}`} />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground leading-snug">
                      {ref.title}
                    </p>
                    <span className={`inline-flex items-center gap-1 mt-1 text-[10px] font-medium uppercase tracking-wider ${config.color}`}>
                      <IconComp className="h-2.5 w-2.5" />
                      {config.label}
                    </span>
                  </div>
                  {ref.url && (
                    <a
                      href={ref.url}
                      target="_blank"
                      rel="nofollow noopener noreferrer"
                      className="shrink-0 flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors rounded-sm px-3 py-1.5 bg-background border border-border hover:border-primary/30"
                    >
                      <ExternalLink className="h-3 w-3" />
                      <span className="hidden sm:inline">Xem nguồn</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
