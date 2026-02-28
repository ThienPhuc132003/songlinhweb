import { Link } from "react-router";
import { SEO } from "@/components/ui/seo";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <>
      <SEO title="404 - Không tìm thấy trang" />

      <section className="section-padding">
        <div className="container-custom flex flex-col items-center justify-center py-20 text-center">
          <h1 className="text-primary mb-2 text-8xl font-bold">404</h1>
          <h2 className="mb-4 text-2xl font-semibold">
            Trang không tồn tại
          </h2>
          <p className="text-muted-foreground mb-8 max-w-md">
            Trang bạn đang tìm kiếm có thể đã bị xóa, đổi tên hoặc tạm thời
            không khả dụng.
          </p>
          <Button asChild>
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              Về trang chủ
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
