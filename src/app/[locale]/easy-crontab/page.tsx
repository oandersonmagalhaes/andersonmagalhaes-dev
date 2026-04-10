import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import EasyCrontabClient from "./client";

export const metadata: Metadata = {
  title: "Easy Crontab",
  description: "Build and validate cron expressions with a visual editor.",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function EasyCrontabPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <EasyCrontabClient />;
}
