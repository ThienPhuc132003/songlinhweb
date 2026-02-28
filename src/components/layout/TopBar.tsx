import { Phone, Mail, Clock } from "lucide-react";
import { SITE } from "@/lib/constants";

export default function TopBar() {
  return (
    <div className="bg-primary text-primary-foreground hidden text-sm md:block">
      <div className="container-custom flex items-center justify-between py-2">
        <div className="flex items-center gap-6">
          <a
            href={`tel:${SITE.phoneRaw}`}
            className="flex items-center gap-1.5 transition-opacity hover:opacity-80"
          >
            <Phone className="h-3.5 w-3.5" />
            <span>Hotline: {SITE.phone}</span>
          </a>
          <a
            href={`mailto:${SITE.email}`}
            className="flex items-center gap-1.5 transition-opacity hover:opacity-80"
          >
            <Mail className="h-3.5 w-3.5" />
            <span>{SITE.email}</span>
          </a>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5" />
          <span>Thứ 2 – Thứ 7: {SITE.workingHours}</span>
        </div>
      </div>
    </div>
  );
}
