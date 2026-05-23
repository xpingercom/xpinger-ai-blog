import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    hasOpenAIKey: Boolean(process.env.OPENAI_API_KEY),
    openAIModel: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
    hasAdminPassword: Boolean(process.env.ADMIN_PASSWORD),
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || null,
    vercelEnv: process.env.VERCEL_ENV || null,
    vercelGitCommitSha: process.env.VERCEL_GIT_COMMIT_SHA || null,
  });
}
