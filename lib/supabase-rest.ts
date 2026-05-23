type RequestOptions = {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  search?: string;
  body?: unknown;
  prefer?: string;
};

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;

export function hasSupabase() {
  return Boolean(supabaseUrl && serviceKey);
}

export async function supabaseRequest<T>(table: string, options: RequestOptions = {}): Promise<T> {
  if (!supabaseUrl || !serviceKey) {
    throw new Error('Supabase is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
  }

  const url = new URL(`/rest/v1/${table}`, supabaseUrl);
  if (options.search) {
    const params = new URLSearchParams(options.search);
    params.forEach((value, key) => url.searchParams.set(key, value));
  }

  const response = await fetch(url, {
    method: options.method || 'GET',
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      'Content-Type': 'application/json',
      ...(options.prefer ? { Prefer: options.prefer } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
    cache: 'no-store',
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Supabase request failed: ${response.status} ${text}`);
  }

  if (response.status === 204) return null as T;
  return response.json() as Promise<T>;
}
