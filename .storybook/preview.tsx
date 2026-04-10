import type { Preview } from "@storybook/nextjs";
import React from "react";
import { NextIntlClientProvider } from "next-intl";
import enMessages from "../src/i18n/messages/en.json";
import brMessages from "../src/i18n/messages/br.json";
import "../src/app/globals.css";

const messagesByLocale: Record<string, Record<string, unknown>> = {
  en: enMessages,
  br: brMessages,
};

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: "brand-black",
      values: [
        { name: "brand-black", value: "#0A0A0A" },
        { name: "brand-card", value: "#141414" },
        { name: "white", value: "#ffffff" },
      ],
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: "centered",
  },
  globalTypes: {
    locale: {
      description: "Active locale",
      defaultValue: "en",
      toolbar: {
        title: "Locale",
        icon: "globe",
        items: [
          { value: "en", title: "English" },
          { value: "br", title: "Português (BR)" },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const locale = (context.globals.locale as string) ?? "en";
      const messages = messagesByLocale[locale] ?? enMessages;
      return (
        <NextIntlClientProvider locale={locale} messages={messages} timeZone="UTC">
          <div className="font-sans text-gray-100">
            <Story />
          </div>
        </NextIntlClientProvider>
      );
    },
  ],
};

export default preview;
