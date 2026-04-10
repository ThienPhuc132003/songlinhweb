import { useState } from "react";
import { Link, useSearchParams } from "react-router";
import { ChevronDown, ChevronRight, Folder, FolderOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { useProductCategories } from "@/hooks/useApi";
import { Skeleton } from "@/components/ui/skeleton";

interface CategoryNode {
  id: number;
  slug: string;
  name: string;
  product_count?: number;
  children: CategoryNode[];
}

/** Build tree from flat list using parent_id */
function buildTree(
  items: Array<{
    id: number;
    slug: string;
    name: string;
    parent_id?: number | null;
    product_count?: number;
  }>,
): CategoryNode[] {
  const map = new Map<number, CategoryNode>();
  const roots: CategoryNode[] = [];

  // Create nodes
  for (const item of items) {
    map.set(item.id, { ...item, children: [] });
  }

  // Build tree
  for (const item of items) {
    const node = map.get(item.id)!;
    if (item.parent_id && map.has(item.parent_id)) {
      map.get(item.parent_id)!.children.push(node);
    } else {
      roots.push(node);
    }
  }

  return roots;
}

interface CategorySidebarProps {
  className?: string;
  hideTitle?: boolean;
}

export function CategorySidebar({ className, hideTitle }: CategorySidebarProps) {
  const { data: categories, isLoading } = useProductCategories();
  const [searchParams] = useSearchParams();
  const activeCategory = searchParams.get("category") ?? "";

  if (isLoading) {
    return (
      <div className={cn("space-y-2", className)}>
        <Skeleton className="h-6 w-2/3" />
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-full" />
        ))}
      </div>
    );
  }

  const tree = buildTree(
    (categories ?? []).map((c) => ({
      id: c.id,
      slug: c.slug,
      name: c.name,
      parent_id: c.parent_id,
      product_count: c.product_count,
    })),
  );

  return (
    <div className={cn("space-y-1", className)}>
      {!hideTitle && (
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Danh mục sản phẩm
        </h3>
      )}

      {/* All products link */}
      <Link
        to="/san-pham"
        className={cn(
          "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent",
          !activeCategory && "bg-primary/10 text-primary",
        )}
      >
        <Folder className="h-4 w-4" />
        Tất cả sản phẩm
      </Link>

      {/* Category tree */}
      {tree.map((node) => (
        <CategoryItem
          key={node.slug}
          node={node}
          activeCategory={activeCategory}
          depth={0}
        />
      ))}
    </div>
  );
}

function CategoryItem({
  node,
  activeCategory,
  depth,
}: {
  node: CategoryNode;
  activeCategory: string;
  depth: number;
}) {
  const isActive = activeCategory === node.slug;
  const hasChildren = node.children.length > 0;
  const [expanded, setExpanded] = useState(
    isActive ||
      node.children.some(
        (c) =>
          c.slug === activeCategory ||
          c.children.some((gc) => gc.slug === activeCategory),
      ),
  );

  return (
    <div>
      <div className="flex items-center">
        {hasChildren && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mr-1 rounded p-0.5 hover:bg-accent"
          >
            {expanded ? (
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
            )}
          </button>
        )}
        <Link
          to={`/san-pham?category=${node.slug}`}
          className={cn(
            "flex flex-1 items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent",
            isActive && "bg-primary/10 text-primary font-medium",
            !hasChildren && "ml-5",
          )}
          style={{ paddingLeft: `${depth * 12 + 12}px` }}
        >
          {isActive ? (
            <FolderOpen className="h-4 w-4 shrink-0" />
          ) : (
            <Folder className="h-4 w-4 shrink-0" />
          )}
          <span className="flex-1 truncate">{node.name}</span>
          {node.product_count != null && (
            <span className="text-xs text-muted-foreground">
              {node.product_count}
            </span>
          )}
        </Link>
      </div>

      {/* Children */}
      {hasChildren && expanded && (
        <div className="ml-2 border-l pl-1">
          {node.children.map((child) => (
            <CategoryItem
              key={child.slug}
              node={child}
              activeCategory={activeCategory}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
