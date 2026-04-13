import { Phone, Mail, Clock } from "lucide-react";
import { SITE } from "@/lib/constants";

export default function TopBar() {
  return (
    <div className="hidden bg-[#1E3A6E] text-sm text-white/90 md:block">
      <div className="container-custom flex items-center justify-between py-2">
        <div className="flex items-center gap-6">
          <a
            href={`mailto:${SITE.email}`}
            className="flex items-center gap-1.5 transition-colors duration-200 hover:text-[#3C5DAA]"
          >
            <Mail className="h-3.5 w-3.5" />
            <span>{SITE.email}</span>
          </a>
        </div>
        <div className="flex items-center gap-1.5 text-white/60">
          <Clock className="h-3.5 w-3.5" />
          <span>Thứ 2 – Thứ 7: {SITE.workingHours}</span>
        </div>
      </div>
    </div>
  );
}
