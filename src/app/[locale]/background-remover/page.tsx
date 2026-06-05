import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import BackgroundRemoverClient from "./client";

export const metadata: Metadata = {
  title: "Background Remover",
  description:
    "Remove a solid background color from an image and export a transparent PNG, entirely in your browser.",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function BackgroundRemoverPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <BackgroundRemoverClient />;
}
