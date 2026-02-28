import { SEO } from "@/components/ui/seo";

export default function Gallery() {
  return (
    <>
      <SEO title="Thu vien hinh anh" url="/thu-vien" />
      <section className="section-padding">
        <div className="container-custom">
          <h1 className="text-primary mb-8 text-center text-3xl font-bold">Thu vien hinh anh</h1>
          <p className="text-muted-foreground text-center">Noi dung se duoc hoan thien.</p>
        </div>
      </section>
    </>
  );
}
