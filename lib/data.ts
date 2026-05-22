import type { Category, Post, Trend } from './types';

export const categories: Category[] = [
  { slug: 'economy-policy', name: '경제/정책', description: '오늘의 정책, 경제 이슈를 쉽게 정리합니다.' },
  { slug: 'ai-tech', name: 'AI/테크', description: 'AI, 반도체, 플랫폼, 스타트업 흐름을 추적합니다.' },
  { slug: 'finance', name: '금융/투자', description: '시장과 투자 이슈를 과장 없이 분석합니다.' },
  { slug: 'society', name: '사회 이슈', description: '사회적 관심이 높은 이슈를 균형 있게 요약합니다.' },
];

export const trends: Trend[] = [
  {
    keyword: '국민성장펀드',
    score: 92,
    category: '경제/정책',
    velocity: '+320%',
    reason: '정책 발표 이후 관련 뉴스량과 검색 관심도가 동시에 상승했습니다.',
  },
  {
    keyword: 'AI 반도체 투자',
    score: 84,
    category: 'AI/테크',
    velocity: '+180%',
    reason: '정부 지원, 대기업 투자, 글로벌 경쟁 구도가 함께 언급되고 있습니다.',
  },
  {
    keyword: '금리 인하 기대감',
    score: 76,
    category: '금융/투자',
    velocity: '+95%',
    reason: '시장 금리와 환율 변동이 소비자 관심으로 이어지고 있습니다.',
  },
  {
    keyword: '부동산 공급 대책',
    score: 71,
    category: '경제/정책',
    velocity: '+88%',
    reason: '수도권 공급, 전세 시장, 정책 실효성 논의가 확산되고 있습니다.',
  },
];

export const posts: Post[] = [
  {
    slug: 'national-growth-fund-explained',
    title: '국민성장펀드란? 오늘 화제가 된 이유와 핵심 쟁점 정리',
    excerpt: '국민성장펀드는 미래 성장 산업에 자금을 공급하겠다는 정책형 투자 구상입니다. 오늘 왜 주목받았는지, 기대와 우려를 함께 정리했습니다.',
    category: '경제/정책',
    tags: ['국민성장펀드', '정책', '경제', '미래산업'],
    publishedAt: '2026-05-22',
    readingTime: '5분',
    featuredGradient: 'from-blue-50 via-sky-100 to-indigo-100',
    imagePrompt: 'Korean national growth fund concept, future industry investment, AI semiconductor, clean editorial illustration, blue and white palette, no text',
    sources: [
      { title: '정부 정책 발표 자료', publisher: '공식 자료', url: '#' },
      { title: '주요 언론 경제 기사 종합', publisher: '뉴스 요약', url: '#' },
      { title: '시장 전문가 코멘트', publisher: '분석 자료', url: '#' },
    ],
    content: `국민성장펀드는 국가 차원에서 미래 성장 산업에 장기 자금을 공급하겠다는 취지의 정책형 투자 구상입니다. 핵심은 단기적인 경기 부양보다 AI, 반도체, 첨단 제조, 바이오, 에너지 같은 분야에 자본을 집중해 산업 경쟁력을 키우는 데 있습니다.\n\n오늘 이 키워드가 주목받은 이유는 정책 발표와 함께 재원 규모, 민간 참여 방식, 투자 대상 산업에 대한 관심이 동시에 커졌기 때문입니다. 특히 국민 자산 형성, 기업 성장 자금, 국가 전략 산업 육성이라는 세 가지 메시지가 결합되면서 경제 뉴스의 주요 이슈로 떠올랐습니다.\n\n기대되는 부분은 분명합니다. 유망 기업이 긴 호흡의 자금을 확보하면 연구개발과 설비 투자에 속도를 낼 수 있습니다. 또한 개인과 기관 투자자가 성장 산업에 간접적으로 참여할 수 있는 구조가 마련된다면 자본시장 활성화 효과도 기대할 수 있습니다.\n\n반대로 살펴봐야 할 쟁점도 있습니다. 첫째, 투자 손실이 발생했을 때 책임 구조가 명확해야 합니다. 둘째, 정치적 판단이 투자 의사결정에 개입하지 않도록 독립성과 전문성을 확보해야 합니다. 셋째, 특정 기업이나 산업에 편중되지 않도록 투명한 기준이 필요합니다.\n\n정리하면 국민성장펀드는 단순한 펀드 상품이라기보다 국가 성장 전략과 자본시장 정책이 만나는 지점에 있는 이슈입니다. 앞으로는 구체적인 재원 조달 방식, 운용 주체, 투자 대상, 수익과 위험 배분 구조가 핵심 관전 포인트가 될 것입니다.`,
  },
  {
    slug: 'ai-semiconductor-investment-race',
    title: 'AI 반도체 투자 경쟁, 한국 기업들이 주목받는 이유',
    excerpt: 'AI 서비스 확산으로 반도체 투자가 다시 핵심 산업 이슈로 떠올랐습니다. 한국 기업의 기회와 리스크를 짚어봅니다.',
    category: 'AI/테크',
    tags: ['AI', '반도체', '투자', '테크'],
    publishedAt: '2026-05-21',
    readingTime: '4분',
    featuredGradient: 'from-slate-50 via-blue-50 to-cyan-100',
    imagePrompt: 'AI semiconductor chips, Korean technology industry, clean futuristic editorial illustration, no logos, no text',
    sources: [{ title: '산업 동향 자료', publisher: 'XPinger Research', url: '#' }],
    content: `AI 반도체는 생성형 AI 서비스의 확산과 함께 다시 핵심 산업으로 떠올랐습니다. 데이터센터, 클라우드, 온디바이스 AI가 동시에 성장하면서 고성능 칩과 메모리 수요가 확대되고 있습니다.\n\n한국 기업들이 주목받는 이유는 메모리 반도체 경쟁력과 첨단 패키징, 제조 역량을 이미 보유하고 있기 때문입니다. 다만 AI 가속기 설계와 소프트웨어 생태계에서는 글로벌 경쟁이 매우 치열합니다.\n\n앞으로의 관전 포인트는 정부 지원, 대기업 투자 속도, 스타트업 생태계, 글로벌 고객 확보 여부입니다.`,
  },
];

export function getPost(slug: string) {
  return posts.find((post) => post.slug === slug);
}

export function getCategory(slug: string) {
  return categories.find((category) => category.slug === slug);
}
