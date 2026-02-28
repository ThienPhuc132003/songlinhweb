import { useParams } from "react-router";
import { SEO } from "@/components/ui/seo";

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  return (
    <>
      <SEO title="Chi tiet san pham" url={"/san-pham/" + (slug || "")} />
      <section className="section-padding">
        <div className="container-custom max-w-4xl">
          <h1 className="text-primary mb-4 text-3xl font-bold">Chi tiet san pham</h1>
          <p className="text-muted-foreground">Slug: {slug}</p>
        </div>
      </section>
    </>
  );
}
