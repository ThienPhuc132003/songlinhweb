import { SEO } from "@/components/ui/seo";

export default function Blog() {
  return (
    <>
      <SEO title="Tin tuc" url="/tin-tuc" />
      <section className="section-padding">
        <div className="container-custom">
          <h1 className="text-primary mb-8 text-center text-3xl font-bold">Tin tuc</h1>
          <p className="text-muted-foreground text-center">Noi dung se duoc hoan thien.</p>
        </div>
      </section>
    </>
  );
}
