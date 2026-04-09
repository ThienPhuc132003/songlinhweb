import { Link } from "react-router";
import { motion } from "framer-motion";
import { MessageSquare, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTABox() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="mt-14 relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 border border-primary/20 p-8 md:p-10"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />

      <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <MessageSquare className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-lg font-bold text-foreground">
              Bạn cần tư vấn giải pháp kỹ thuật?
            </h3>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-lg">
            Đội ngũ kỹ sư của Song Linh Technologies sẵn sàng tư vấn và thiết kế
            giải pháp phù hợp cho dự án của bạn. Liên hệ ngay để được hỗ trợ miễn phí.
          </p>
        </div>
        <div className="flex gap-3 shrink-0">
          <Button asChild variant="outline" className="gap-2">
            <a href="tel:0968811911">
              <Phone className="h-4 w-4" />
              Gọi ngay
            </a>
          </Button>
          <Button asChild className="gap-2 shadow-lg shadow-primary/20">
            <Link to="/lien-he">
              <MessageSquare className="h-4 w-4" />
              Liên hệ chuyên gia
            </Link>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
