import { Link } from "react-router";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface SolutionHeroProps {
  title: string;
  subtitle: string;
  heroImage: string;
}

export function SolutionHero({ title, subtitle, heroImage }: SolutionHeroProps) {
  return (
    <section className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt={title}
          className="h-full w-full object-cover"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-slate-900/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
      </div>

      <div className="container-custom relative z-10 pb-16 pt-28 lg:pb-24 lg:pt-36">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-white/60">
          <Link to="/" className="transition-colors hover:text-white">Trang chủ</Link>
          <span>/</span>
          <Link to="/giai-phap" className="transition-colors hover:text-white">Giải pháp</Link>
          <span>/</span>
          <span className="text-white/90">{title}</span>
        </nav>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          <div className="mb-4 h-1 w-16 rounded bg-primary" />
          <h1 className="mb-4 text-3xl font-bold text-white drop-shadow-lg lg:text-4xl xl:text-5xl">
            {title}
          </h1>
          <p className="mb-8 text-lg leading-relaxed text-white/80 lg:text-xl">
            {subtitle}
          </p>
          <Button
            asChild
            size="lg"
            className="bg-primary text-white hover:bg-primary/90"
          >
            <Link to="/lien-he">
              Yêu cầu khảo sát kỹ thuật
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
