import type { Meta, StoryObj } from "@storybook/nextjs";
import Header from "./Header";

const meta: Meta<typeof Header> = {
  title: "Layout/Header",
  component: Header,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/en",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Header>;

export const OnHome: Story = {
  render: () => (
    <div className="min-h-[300px] bg-brand-black">
      <Header />
    </div>
  ),
};

export const OnToolPage: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/en/base64-translator",
      },
    },
  },
  render: () => (
    <div className="min-h-[300px] bg-brand-black">
      <Header />
    </div>
  ),
};

export const PortugueseLocale: Story = {
  globals: { locale: "br" },
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/br",
      },
    },
  },
  render: () => (
    <div className="min-h-[300px] bg-brand-black">
      <Header />
    </div>
  ),
};
