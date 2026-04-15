import { List } from "lucide-react";

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

export function extractToc(html: string): TocItem[] {
  const regex = /<h([2-3])[^>]*id="([^"]*)"[^>]*>(.*?)<\/h[2-3]>/gi;
  const items: TocItem[] = [];
  let match;
  while ((match = regex.exec(html)) !== null) {
    items.push({
      level: parseInt(match[1]),
      id: match[2],
      text: match[3].replace(/<[^>]+>/g, ""),
    });
  }
  if (items.length === 0) {
    const regex2 = /<h([2-3])[^>]*>(.*?)<\/h[2-3]>/gi;
    let idx = 0;
    while ((match = regex2.exec(html)) !== null) {
      const text = match[2].replace(/<[^>]+>/g, "");
      const id = `heading-${idx++}`;
      items.push({ level: parseInt(match[1]), id, text });
    }
  }
  return items;
}

export function TableOfContents({
  items,
  activeId,
}: {
  items: TocItem[];
  activeId: string;
}) {
  if (items.length === 0) return null;

  return (
    <div className="rounded-sm border bg-card/80 backdrop-blur-sm p-5 shadow-sm">
      <nav>
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
          <div className="h-7 w-7 rounded-sm bg-primary/10 flex items-center justify-center">
            <List className="h-3.5 w-3.5 text-primary" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-foreground/70">
            Mục lục
          </span>
        </div>
        <div className="space-y-0.5">
          {items.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(item.id)?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }}
              className={`block py-2 px-3 text-[13px] leading-snug transition-all duration-200 rounded-sm ${
                item.level === 3 ? "ml-4" : ""
              } ${
                activeId === item.id
                  ? "text-primary font-semibold bg-primary/8 border-l-2 border-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60 border-l-2 border-transparent"
              }`}
            >
              {item.text}
            </a>
          ))}
        </div>
      </nav>
    </div>
  );
}
