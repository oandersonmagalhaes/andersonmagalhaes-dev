import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import Base64TranslatorClient from "./client";

export const metadata: Metadata = {
  title: "Base64 Translator",
  description: "Encode and decode Base64 strings with UTF-8 support.",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function Base64TranslatorPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <Base64TranslatorClient />;
}
