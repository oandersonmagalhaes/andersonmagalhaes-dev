import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import UuidFromStringClient from "./client";

export const metadata: Metadata = {
  title: "UUID from String",
  description: "Generate deterministic UUID v5 from any string.",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function UuidFromStringPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <UuidFromStringClient />;
}
