export type DraftInput = {
  keyword: string;
  category: string;
  sources?: Array<{ title: string; publisher: string; url: string; summary?: string }>;
};

export type DraftOutput = {
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
  imagePrompt: string;
  sources: Array<{ title: string; publisher: string; url: string }>;
};

function fallbackSources(keyword: string) {
  return [
    { title: `${keyword} 관련 공식 발표 확인 필요`, publisher: '공식 자료', url: '#' },
    { title: `${keyword} 주요 언론 보도 종합`, publisher: '뉴스 요약', url: '#' },
    { title: `${keyword} 전문가 해설 및 시장 반응`, publisher: '분석 자료', url: '#' },
  ];
}

export function createMockDraft({ keyword, category, sources }: DraftInput): DraftOutput {
  const safeSources = sources?.length ? sources.map(({ title, publisher, url }) => ({ title, publisher, url })) : fallbackSources(keyword);
  return {
    title: `${keyword} 핵심 정리: 오늘 왜 주목받고 있나`,
    excerpt: `${keyword} 이슈의 배경, 핵심 내용, 기대 효과와 주의할 쟁점을 한 번에 정리했습니다.`,
    content: `${keyword}는 오늘 ${category} 분야에서 가장 눈에 띄는 키워드 중 하나입니다. 검색 관심도와 관련 보도량이 함께 늘어나면서 일반 독자들도 이 이슈의 의미를 궁금해하고 있습니다.\n\n먼저 배경을 보면, 이 이슈는 단순한 단발성 뉴스라기보다 정책, 산업, 시장 심리가 맞물려 확산된 주제입니다. 따라서 제목만 보고 판단하기보다 실제로 무엇이 결정되었고, 아직 확정되지 않은 부분은 무엇인지 구분해서 보는 것이 중요합니다.\n\n핵심 포인트는 세 가지입니다. 첫째, 이 이슈가 어떤 문제를 해결하려는지입니다. 둘째, 누가 비용과 위험을 부담하는지입니다. 셋째, 실제 효과가 나타나기까지 어떤 조건이 필요한지입니다.\n\n기대 효과도 있습니다. 관련 정책이나 산업 흐름이 제대로 작동한다면 기업 투자, 시장 활성화, 미래 산업 경쟁력 강화로 이어질 수 있습니다. 반면 검증되지 않은 기대가 앞서거나 구체적인 실행 계획이 부족하면 실효성 논란이 커질 수 있습니다.\n\n정리하면 ${keyword}는 오늘의 관심 키워드이지만, 앞으로는 세부 실행안, 재원 구조, 이해관계자 반응, 실제 성과 지표를 함께 확인해야 합니다. XPinger는 관련 공식 자료와 주요 보도를 계속 추적해 업데이트할 예정입니다.`,
    tags: [keyword, category.replace('/', ''), '오늘의이슈', 'AI브리핑'],
    imagePrompt: `Clean Korean editorial blog thumbnail about ${keyword}, modern policy and economy concept, soft blue and white palette, minimal, premium, no text, no logos`,
    sources: safeSources,
  };
}

function extractJson(text: string) {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('AI 응답에서 JSON을 찾지 못했습니다.');
  return JSON.parse(match[0]);
}

export async function generateDraft(input: DraftInput): Promise<{ mode: 'openai' | 'mock'; draft: DraftOutput }> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return { mode: 'mock', draft: createMockDraft(input) };

  const prompt = `너는 한국어 경제/사회 이슈를 신뢰성 있게 정리하는 블로그 에디터다.\n\n키워드: ${input.keyword}\n카테고리: ${input.category}\n출처 후보: ${JSON.stringify(input.sources || [], null, 2)}\n\n규칙:\n- 확인되지 않은 내용은 단정하지 않는다.\n- 투자 조언처럼 쓰지 않는다.\n- 정치/정책 이슈는 찬반과 쟁점을 균형 있게 쓴다.\n- 기사 원문을 베끼지 않는다.\n- JSON만 출력한다.\n\nJSON 형식:\n{\n  "title": "...",\n  "excerpt": "...",\n  "content": "문단 구분은 \\n\\n 사용",\n  "tags": ["..."],\n  "imagePrompt": "English prompt, no text, no logos",\n  "sources": [{"title":"...","publisher":"...","url":"..."}]\n}`;

  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
      input: prompt,
      temperature: 0.4,
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`OpenAI 생성 실패: ${detail.slice(0, 300)}`);
  }

  const data = await response.json();
  const text = data.output_text || data.output?.flatMap((item: any) => item.content || []).map((content: any) => content.text || '').join('\n');
  const draft = extractJson(text) as DraftOutput;
  return { mode: 'openai', draft };
}
