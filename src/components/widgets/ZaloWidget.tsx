/**
 * Zalo Chat Widget — loads the official Zalo OA chat plugin.
 * To use: set VITE_ZALO_OA_ID in .env with your Zalo Official Account ID.
 */
import { useEffect } from "react";

const ZALO_OA_ID = import.meta.env.VITE_ZALO_OA_ID ?? "";

export function ZaloWidget() {
  useEffect(() => {
    if (!ZALO_OA_ID) return;

    // Create the Zalo chat widget div
    const widget = document.createElement("div");
    widget.className = "zalo-chat-widget";
    widget.setAttribute("data-oaid", ZALO_OA_ID);
    widget.setAttribute("data-welcome-message", "Xin chào! SLTECH có thể hỗ trợ gì cho bạn?");
    widget.setAttribute("data-autopopup", "0");
    widget.setAttribute("data-width", "350");
    widget.setAttribute("data-height", "420");
    document.body.appendChild(widget);

    // Load Zalo SDK script
    const script = document.createElement("script");
    script.src = "https://sp.zalo.me/plugins/sdk.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      widget.remove();
      script.remove();
    };
  }, []);

  return null;
}
