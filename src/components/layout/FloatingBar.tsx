import { useSiteConfig } from "@/hooks/useApi";
import LogoZalo from "@/assets/Image/LogoLienHe/LogoZalo.png";
import LogoFacebook from "@/assets/Image/LogoLienHe/LogoFaceBook.png";

export default function FloatingBar() {
  const { data: config } = useSiteConfig();

  const zaloUrl = config?.social_zalo || "https://zalo.me/0968811911";
  const facebookUrl = config?.social_facebook || "https://facebook.com";

  return (
    <div className="fixed right-4 bottom-4 z-50 flex flex-col gap-3">
      {/* Zalo */}
      <a
        href={zaloUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat Zalo"
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-lg ring-1 ring-black/5 transition-all duration-300 hover:scale-110 hover:shadow-xl"
      >
        <img
          src={LogoZalo}
          alt="Zalo"
          className="h-9 w-9 object-contain transition-transform duration-300 group-hover:scale-110"
        />
      </a>

      {/* Facebook */}
      <a
        href={facebookUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Facebook"
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-lg ring-1 ring-black/5 transition-all duration-300 hover:scale-110 hover:shadow-xl"
      >
        <img
          src={LogoFacebook}
          alt="Facebook"
          className="h-9 w-9 object-contain transition-transform duration-300 group-hover:scale-110"
        />
      </a>
    </div>
  );
}
