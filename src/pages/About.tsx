import { SEO } from "@/components/ui/seo";
import { SITE, COMPANY_ACTIVITIES } from "@/lib/constants";

export default function About() {
  return (
    <>
      <SEO title="Gioi thieu" description="Tim hieu ve SLTECH" url="/gioi-thieu" />
      <section className="section-padding">
        <div className="container-custom max-w-4xl">
          <h1 className="text-primary mb-8 text-3xl font-bold">Gioi thieu ve {SITE.shortName}</h1>
          <div className="prose prose-lg max-w-none">
            <p><strong>{SITE.name}</strong> (SLTECH) hoat dong trong linh vuc cong nghe thong tin va he thong ky thuat.</p>
            <h2>Linh vuc hoat dong</h2>
            <ul>{COMPANY_ACTIVITIES.map((a) => <li key={a}>{a}</li>)}</ul>
          </div>
        </div>
      </section>
    </>
  );
}
