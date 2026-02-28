import { SEO } from "@/components/ui/seo";

export default function Home() {
  return (
    <>
      <SEO title="" description="SLTECH - Giai phap toi uu, Chat luong vuot troi." url="/" />
      <section className="bg-primary/5 section-padding">
        <div className="container-custom text-center">
          <h1 className="text-primary mb-4 text-3xl font-bold md:text-5xl">Giai phap toi uu - Chat luong vuot troi</h1>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg">Chuyen tu van thiet ke, cung cap va thi cong lap dat cac he thong cong nghe thong tin.</p>
        </div>
      </section>
      <section className="section-padding">
        <div className="container-custom">
          <h2 className="mb-8 text-center text-2xl font-bold">Giai phap cua chung toi</h2>
          <p className="text-muted-foreground text-center">Noi dung se duoc cap nhat o Phase 3.</p>
        </div>
      </section>
    </>
  );
}
