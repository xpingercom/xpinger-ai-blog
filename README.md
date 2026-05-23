# XPinger AI Trend Blog

XPinger는 한국의 오늘 이슈를 감지하고 AI가 블로그 초안과 이미지 프롬프트를 생성하는 트렌드 블로그 MVP입니다.

## 현재 포함 기능

- Next.js App Router 기반 공개 사이트
- clobe.ai 느낌의 미니멀 카드형 UI
- 메인 페이지, 카테고리 페이지, 글 상세 페이지
- 관리자 페이지 `/admin`
- OpenAI 기반 초안 생성 API `/api/generate-draft`
- 초안 저장 API `/api/posts`
- 발행 API `/api/posts/[slug]/publish`
- 광고 관리 API `/api/ads`
- 광고 슬롯 2곳
  - 메인 상단 배너
  - 글 본문 중간 광고
- mock 트렌드 API `/api/trends`
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
OPENAI_MODEL=gpt-4.1-mini

SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=
DATABASE_URL=

NAVER_CLIENT_ID=
NAVER_CLIENT_SECRET=
NEXT_PUBLIC_SITE_URL=https://xpinger.com
CRON_SECRET=change-me
ADMIN_USER=admin
ADMIN_PASSWORD=change-this-password
```

### Supabase 저장/발행

관리자에서 초안을 저장하고 발행하려면 Supabase가 필요합니다.

1. Supabase 프로젝트 생성
2. SQL Editor에서 `supabase/schema.sql` 실행
3. Vercel Production 환경변수에 추가
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. 재배포

`DATABASE_URL`만으로는 현재 앱의 저장 기능이 동작하지 않습니다. 런타임 저장은 Supabase REST API를 사용하므로 `SUPABASE_URL`과 `SUPABASE_SERVICE_ROLE_KEY`가 필요합니다.

## 광고 관리

관리자 페이지의 “광고 관리” 탭에서 2개 광고를 조정합니다.

- 상단 광고: 메인 Hero 아래
- 본문 중간 광고: 글 상세 본문 중간

HTML 코드 입력란에 AdSense/제휴 배너 코드를 넣으면 기본 문구 대신 표시됩니다. 광고 HTML은 관리자만 수정할 수 있게 운영 환경에서는 반드시 `ADMIN_PASSWORD`를 설정하세요.

## 배포 메모

Vercel에 연결한 뒤 도메인 `xpinger.com`을 추가합니다. Hostinger DNS에는 Vercel이 안내하는 값을 입력합니다. 일반적인 설정은 아래와 비슷하지만, 실제 값은 Vercel 화면 기준으로 확인해야 합니다.

```txt
A Record: @ -> 76.76.21.21
CNAME: www -> cname.vercel-dns.com
```

## 운영 철학

정치, 경제, 금융, 사회 이슈는 자동 생성만으로 바로 발행하지 않고 관리자 검토를 거치도록 설계합니다. 특히 투자 조언, 특정 인물/기관 비판, 확정되지 않은 정책 내용은 출처 검증이 필요합니다.

## 관리자 페이지 보호

`/admin`, `/api/posts/*`, `/api/ads`는 Basic Auth로 보호할 수 있습니다. Vercel 환경변수에 아래 값을 추가하세요.

```txt
ADMIN_USER=admin
ADMIN_PASSWORD=강력한비밀번호
```

`ADMIN_PASSWORD`가 없으면 개발 편의를 위해 보호가 비활성화됩니다. 운영 배포에서는 반드시 설정하세요.
