import { useState } from "react";

export default function OrchidImage({
  url,
  name,
}: {
  url: string | null;
  name: string;
}) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const safeUrl = url && /^https?:\/\//i.test(url) ? url : null;
  return (
    <div className="orchid-image">
      <span className="image-fallback" aria-hidden="true">
        ✳
      </span>
      {safeUrl && safeUrl !== failedUrl && (
        <img
          src={safeUrl}
          alt={name}
          loading="lazy"
          onError={() => setFailedUrl(safeUrl)}
        />
      )}
    </div>
  );
}
