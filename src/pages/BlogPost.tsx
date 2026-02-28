import { useParams } from "react-router";
import { SEO } from "@/components/ui/seo";

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  return (
    <>
      <SEO title="Bai viet" url={"/tin-tuc/" + (slug || "")} />
      <section className="section-padding">
        <div className="container-custom max-w-4xl">
          <h1 className="text-primary mb-4 text-3xl font-bold">Bai viet</h1>
          <p className="text-muted-foreground">Slug: {slug}</p>
        </div>
      </section>
    </>
  );
}
