import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import JwtValidatorClient from "./client";

export const metadata: Metadata = {
  title: "JWT Validator",
  description: "Decode and inspect JSON Web Tokens.",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function JwtValidatorPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <JwtValidatorClient />;
}
