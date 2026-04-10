import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import PasswordGeneratorClient from "./client";

export const metadata: Metadata = {
  title: "Password Generator",
  description: "Generate secure random passwords with custom rules.",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function PasswordGeneratorPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <PasswordGeneratorClient />;
}
