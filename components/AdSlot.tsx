import type { AdSlot as AdSlotType } from '@/lib/ads-store';

export function AdSlot({ ad }: { ad?: AdSlotType }) {
  if (!ad?.enabled) return null;

  return (
    <aside className="ad-slot" aria-label={ad.name}>
      <div className="ad-label">{ad.label}</div>
      {ad.html ? (
        <div className="ad-html" dangerouslySetInnerHTML={{ __html: ad.html }} />
      ) : (
        <p>{ad.body}</p>
      )}
    </aside>
  );
}
