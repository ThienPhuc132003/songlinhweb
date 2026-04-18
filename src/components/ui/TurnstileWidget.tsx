import { Turnstile } from "@marsidev/react-turnstile";

const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined;

interface TurnstileWidgetProps {
  onSuccess: (token: string) => void;
  onExpire?: () => void;
}

/**
 * Cloudflare Turnstile CAPTCHA widget.
 *
 * **Opt-in pattern:** Only renders when `VITE_TURNSTILE_SITE_KEY` is set.
 * In local dev (no key), the widget is hidden and forms work without verification.
 */
export function TurnstileWidget({ onSuccess, onExpire }: TurnstileWidgetProps) {
  if (!SITE_KEY) return null;

  return (
    <div className="flex justify-center py-2">
      <Turnstile
        siteKey={SITE_KEY}
        onSuccess={onSuccess}
        onExpire={onExpire}
        options={{
          theme: "auto",
          size: "normal",
        }}
      />
    </div>
  );
}

/**
 * Returns true if Turnstile is configured (site key is set).
 * Used by forms to decide whether to require a token before submission.
 */
export function isTurnstileEnabled(): boolean {
  return Boolean(SITE_KEY);
}
