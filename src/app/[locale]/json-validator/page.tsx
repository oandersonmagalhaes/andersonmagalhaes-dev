import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import JsonValidatorClient from "./client";

export const metadata: Metadata = {
  title: "JSON Validator",
  description: "Validate, format, and minify JSON data.",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function JsonValidatorPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <JsonValidatorClient />;
}
