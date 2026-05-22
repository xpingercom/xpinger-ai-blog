# XPinger AI Trend Blog

XPinger는 한국의 오늘 이슈를 감지하고 AI가 블로그 초안과 이미지 프롬프트를 생성하는 트렌드 블로그 MVP입니다.

## 현재 포함 기능

- Next.js App Router 기반 공개 사이트
- clobe.ai 느낌의 미니멀 카드형 UI
- 메인 페이지, 카테고리 페이지, 글 상세 페이지
- 관리자 페이지 `/admin`
- mock 트렌드 API `/api/trends`
- mock 초안 생성 API `/api/generate-draft`
- SEO 메타데이터, sitemap, robots

## 실행

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:3000` 접속.

## 환경변수

`.env.example`을 `.env.local`로 복사 후 필요한 키를 입력합니다.

```bash
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
NAVER_CLIENT_ID=
NAVER_CLIENT_SECRET=
DATABASE_URL=
NEXT_PUBLIC_SITE_URL=https://xpinger.com
```

## 다음 단계

1. OpenAI/Claude 실제 글 생성 연결
2. Supabase DB 연결
3. 이미지 생성 API 연결
4. Vercel 배포
5. Hostinger DNS에서 xpinger.com 연결

## 배포 메모

Vercel에 연결한 뒤 도메인 `xpinger.com`을 추가합니다. Hostinger DNS에는 Vercel이 안내하는 값을 입력합니다. 일반적인 설정은 아래와 비슷하지만, 실제 값은 Vercel 화면 기준으로 확인해야 합니다.

```txt
A Record: @ -> 76.76.21.21
CNAME: www -> cname.vercel-dns.com
```

## 운영 철학

정치, 경제, 금융, 사회 이슈는 자동 생성만으로 바로 발행하지 않고 관리자 검토를 거치도록 설계합니다. 특히 투자 조언, 특정 인물/기관 비판, 확정되지 않은 정책 내용은 출처 검증이 필요합니다.
