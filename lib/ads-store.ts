import { hasSupabase, supabaseRequest } from './supabase-rest';

export type AdSlotId = 'top-banner' | 'in-article';

export type AdSlot = {
  id: AdSlotId;
  name: string;
  enabled: boolean;
  label: string;
  body: string;
  html?: string;
  updatedAt?: string;
};

export const defaultAds: AdSlot[] = [
  {
    id: 'top-banner',
    name: '상단 광고',
    enabled: true,
    label: 'ADVERTISEMENT',
    body: 'XPinger 광고 영역 — 상단 배너',
  },
  {
    id: 'in-article',
    name: '본문 중간 광고',
    enabled: true,
    label: 'SPONSORED',
    body: 'XPinger 광고 영역 — 글 본문 중간',
  },
];

type AdRow = {
  slot: AdSlotId;
  name: string | null;
  enabled: boolean;
  label: string | null;
  body: string | null;
  html: string | null;
  updated_at: string | null;
};

function toAd(row: AdRow): AdSlot {
  const fallback = defaultAds.find((ad) => ad.id === row.slot)!;
  return {
    id: row.slot,
    name: row.name || fallback.name,
    enabled: row.enabled,
    label: row.label || fallback.label,
    body: row.body || fallback.body,
    html: row.html || undefined,
    updatedAt: row.updated_at || undefined,
  };
}

export async function listAds(): Promise<AdSlot[]> {
  if (!hasSupabase()) return defaultAds;

  const rows = await supabaseRequest<AdRow[]>('ad_slots', {
    search: new URLSearchParams({ select: '*', order: 'slot.asc' }).toString(),
  });

  const merged = defaultAds.map((fallback) => {
    const row = rows.find((item) => item.slot === fallback.id);
    return row ? toAd(row) : fallback;
  });

  return merged;
}

export async function updateAds(slots: AdSlot[]) {
  if (!hasSupabase()) {
    throw new Error('DB_NOT_CONFIGURED');
  }

  const now = new Date().toISOString();
  const payload = slots.map((slot) => ({
    slot: slot.id,
    name: slot.name,
    enabled: slot.enabled,
    label: slot.label,
    body: slot.body,
    html: slot.html || null,
    updated_at: now,
  }));

  const rows = await supabaseRequest<AdRow[]>('ad_slots', {
    method: 'POST',
    search: 'on_conflict=slot',
    body: payload,
    prefer: 'resolution=merge-duplicates,return=representation',
  });

  return rows.map(toAd);
}
