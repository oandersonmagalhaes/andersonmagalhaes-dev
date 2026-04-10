import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import Uuid4Client from "./client";

export const metadata: Metadata = {
  title: "UUID4 Generator",
  description: "Generate random UUID v4 identifiers.",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function Uuid4Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <Uuid4Client />;
}
