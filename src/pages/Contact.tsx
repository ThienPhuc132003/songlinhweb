import { SEO } from "@/components/ui/seo";
import { SITE } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

export default function Contact() {
  return (
    <>
      <SEO title="Lien he" description="Lien he voi SLTECH." url="/lien-he" />
      <section className="section-padding">
        <div className="container-custom">
          <h1 className="text-primary mb-8 text-center text-3xl font-bold">Lien he</h1>
          <div className="grid gap-10 lg:grid-cols-2">
            <Card>
              <CardHeader><CardTitle>Gui yeu cau tu van</CardTitle></CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="space-y-2"><Label htmlFor="company">Ten cong ty *</Label><Input id="company" placeholder="Nhap ten cong ty" /></div>
                  <div className="space-y-2"><Label htmlFor="email">Email *</Label><Input id="email" type="email" placeholder="email@example.com" /></div>
                  <div className="space-y-2"><Label htmlFor="phone">So dien thoai *</Label><Input id="phone" placeholder="0xxx xxx xxx" /></div>
                  <div className="space-y-2"><Label htmlFor="message">Noi dung *</Label><Textarea id="message" placeholder="Mo ta yeu cau..." rows={4} /></div>
                  <Button type="submit" className="w-full">Gui yeu cau</Button>
                </form>
              </CardContent>
            </Card>
            <div className="space-y-6">
              <Card>
                <CardHeader><CardTitle>Thong tin lien he</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3"><Phone className="text-primary h-5 w-5" /><div><p className="text-sm font-medium">Hotline</p><a href={"tel:" + SITE.phoneRaw} className="text-primary hover:underline">{SITE.phone}</a></div></div>
                  <div className="flex items-center gap-3"><Mail className="text-primary h-5 w-5" /><div><p className="text-sm font-medium">Email</p><a href={"mailto:" + SITE.email} className="text-primary hover:underline">{SITE.email}</a></div></div>
                  <div className="flex items-start gap-3"><MapPin className="text-primary mt-0.5 h-5 w-5" /><div><p className="text-sm font-medium">Dia chi</p><p className="text-muted-foreground">{SITE.address}</p></div></div>
                  <div className="flex items-center gap-3"><Clock className="text-primary h-5 w-5" /><div><p className="text-sm font-medium">Gio lam viec</p><p className="text-muted-foreground">Thu 2 - Thu 7: {SITE.workingHours}</p></div></div>
                </CardContent>
              </Card>
              <div className="aspect-video overflow-hidden rounded-lg"><iframe src={SITE.mapEmbedUrl} width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="SLTECH map" /></div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
