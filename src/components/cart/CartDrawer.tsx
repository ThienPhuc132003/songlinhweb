import { useState } from "react";
import { Link } from "react-router";
import { Minus, Plus, Trash2, ShoppingCart, Package, Send } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { QuoteForm } from "./QuoteForm";

interface CartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CartDrawer({ open, onOpenChange }: CartDrawerProps) {
  const { items, itemCount, removeItem, updateQuantity, clearCart } = useCart();
  const [quoteOpen, setQuoteOpen] = useState(false);

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="flex w-full flex-col sm:max-w-md">
          <SheetHeader className="border-b pb-4">
            <SheetTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Giỏ yêu cầu báo giá
              {itemCount > 0 && (
                <span className="bg-primary text-primary-foreground rounded-sm px-2 py-0.5 text-xs font-bold">
                  {itemCount}
                </span>
              )}
            </SheetTitle>
          </SheetHeader>

          {items.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
              <div className="bg-muted rounded-full p-6">
                <Package className="text-muted-foreground h-10 w-10" />
              </div>
              <div>
                <p className="font-medium">Giỏ hàng trống</p>
                <p className="text-muted-foreground mt-1 text-sm">
                  Thêm sản phẩm từ{" "}
                  <Link
                    to="/san-pham"
                    className="text-primary underline"
                    onClick={() => onOpenChange(false)}
                  >
                    danh mục sản phẩm
                  </Link>{" "}
                  để bắt đầu.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Items list */}
              <div className="flex-1 space-y-3 overflow-y-auto py-4">
                {items.map((item) => (
                  <div
                    key={item.productId}
                    className="bg-card flex gap-3 rounded-sm border p-3"
                  >
                    {/* Thumbnail */}
                    <div className="bg-muted flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-sm">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="h-full w-full object-contain p-1"
                        />
                      ) : (
                        <Package className="text-muted-foreground/40 h-6 w-6" />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex min-w-0 flex-1 flex-col justify-between">
                      <div>
                        <Link
                          to={`/san-pham/${item.slug}`}
                          className="hover:text-primary line-clamp-1 text-sm font-medium transition-colors"
                          onClick={() => onOpenChange(false)}
                        >
                          {item.name}
                        </Link>
                        {item.categoryName && (
                          <p className="text-muted-foreground text-xs">
                            {item.categoryName}
                          </p>
                        )}
                      </div>

                      {/* Quantity controls */}
                      <div className="mt-1.5 flex items-center gap-2">
                        <div className="flex items-center rounded-sm border">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 rounded-r-none"
                            onClick={() =>
                              updateQuantity(item.productId, item.quantity - 1)
                            }
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="flex h-7 w-8 items-center justify-center text-xs font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 rounded-l-none"
                            onClick={() =>
                              updateQuantity(item.productId, item.quantity + 1)
                            }
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive h-7 w-7"
                          onClick={() => removeItem(item.productId)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 border-t pt-4">
                <div className="text-muted-foreground flex items-center justify-between text-sm">
                  <span>Tổng sản phẩm</span>
                  <span className="font-semibold">
                    {items.length} loại ({itemCount} SP)
                  </span>
                </div>
                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => {
                    setQuoteOpen(true);
                    onOpenChange(false);
                  }}
                >
                  <Send className="mr-2 h-4 w-4" />
                  Gửi yêu cầu nhanh
                </Button>
                <Link to="/gio-hang-bao-gia" onClick={() => onOpenChange(false)}>
                  <Button
                    variant="outline"
                    className="w-full"
                    size="sm"
                  >
                    <ShoppingCart className="mr-2 h-3.5 w-3.5" />
                    Xem chi tiết giỏ hàng
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  className="w-full text-red-500 hover:text-red-700"
                  size="sm"
                  onClick={clearCart}
                >
                  <Trash2 className="mr-2 h-3.5 w-3.5" />
                  Xóa giỏ hàng
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <QuoteForm open={quoteOpen} onOpenChange={setQuoteOpen} />
    </>
  );
}
