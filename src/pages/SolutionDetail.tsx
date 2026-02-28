import { useParams } from "react-router";
import { SEO } from "@/components/ui/seo";

export default function SolutionDetail() {
  const { slug } = useParams<{ slug: string }>();
  return (
    <>
      <SEO title="Chi tiet giai phap" url={"/giai-phap/" + (slug || "")} />
      <section className="section-padding">
        <div className="container-custom max-w-4xl">
          <h1 className="text-primary mb-4 text-3xl font-bold">Chi tiet giai phap</h1>
          <p className="text-muted-foreground">Slug: {slug}</p>
        </div>
      </section>
    </>
  );
}
