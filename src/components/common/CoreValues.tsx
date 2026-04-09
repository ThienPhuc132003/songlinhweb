import { useMemo } from "react";
import { motion } from "framer-motion";
import { useSiteConfig } from "@/hooks/useApi";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Shield, Users, Award, Heart, Star, Zap, type LucideIcon } from "lucide-react";

// ─── Icon mapping ─────────────────────────────────────────────────────────────

const ICON_MAP: Record<string, LucideIcon> = {
  Shield,
  Users,
  Award,
  Heart,
  Star,
  Zap,
};

function getIcon(name?: string): LucideIcon {
  if (!name) return Shield;
  return ICON_MAP[name] ?? Shield;
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface ValueItem {
  title: string;
  description: string;
  icon?: string;
}

// ─── Default fallback ─────────────────────────────────────────────────────────

const DEFAULT_VALUES: ValueItem[] = [
  {
    title: "Chất lượng",
    description: "Cam kết sử dụng thiết bị chính hãng, thi công đạt chuẩn quốc tế",
    icon: "Shield",
  },
  {
    title: "Khách hàng",
    description: "Đặt nhu cầu khách hàng làm trung tâm, tư vấn giải pháp phù hợp nhất",
    icon: "Users",
  },
  {
    title: "Uy tín",
    description: "Hơn 10 năm xây dựng uy tín với 500+ dự án và 50+ đối tác chiến lược",
    icon: "Award",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

interface CoreValuesProps {
  className?: string;
}

export function CoreValues({ className }: CoreValuesProps) {
  const { data: config } = useSiteConfig();

  const values: ValueItem[] = useMemo(() => {
    if (config?.core_values) {
      try {
        const parsed = JSON.parse(config.core_values) as ValueItem[];
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch { /* fall through */ }
    }
    return DEFAULT_VALUES;
  }, [config]);

  return (
    <section className={cn("section-padding bg-muted/30", className)}>
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center"
        >
          <h2 className="text-2xl font-bold md:text-3xl">Giá trị cốt lõi</h2>
          <p className="text-muted-foreground mt-2">
            Nền tảng xây dựng mọi dự án của chúng tôi
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-3">
          {values.map((v, i) => {
            const Icon = getIcon(v.icon);
            return (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <Card className="h-full text-center">
                  <CardContent className="p-6">
                    <div className="bg-primary/10 mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full">
                      <Icon className="text-primary h-6 w-6" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold">{v.title}</h3>
                    <p className="text-muted-foreground text-sm">{v.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
