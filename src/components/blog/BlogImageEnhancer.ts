// ═══════════════════════════════════════════════════════════════════════════════
// ─── IMAGE ENHANCEMENT
// Makes all images clickable for lightbox, adds zoom icon overlay
// ═══════════════════════════════════════════════════════════════════════════════

export function enhanceImages(html: string): string {
  let imgIndex = 0;
  return html.replace(
    /<img([^>]*)src="([^"]*)"([^>]*)>/gi,
    (_, before, src, after) => {
      const idx = imgIndex++;
      return `<figure class="article-image-figure my-8 cursor-pointer group" data-lightbox-idx="${idx}" data-lightbox-src="${src}">
        <div class="relative overflow-hidden rounded-2xl shadow-lg ring-1 ring-border/10">
          <img${before}src="${src}"${after} class="w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]" loading="lazy">
          <div class="absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-300 group-hover:bg-black/20">
            <span class="rounded-full bg-white/90 p-2.5 opacity-0 shadow-lg transition-all duration-300 group-hover:opacity-100 group-hover:scale-100 scale-75">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/><path d="M11 8v6"/><path d="M8 11h6"/></svg>
            </span>
          </div>
        </div>
      </figure>`;
    },
  );
}

/** Extract all image srcs from enhanced HTML */
export function extractImageSrcs(html: string): string[] {
  const srcs: string[] = [];
  const re = /data-lightbox-src="([^"]*)"/gi;
  let m;
  while ((m = re.exec(html)) !== null) srcs.push(m[1]);
  return srcs;
}
