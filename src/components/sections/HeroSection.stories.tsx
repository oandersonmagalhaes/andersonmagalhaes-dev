import type { Meta, StoryObj } from "@storybook/nextjs";
import HeroSection from "./HeroSection";

const meta: Meta<typeof HeroSection> = {
  title: "Sections/HeroSection",
  component: HeroSection,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof HeroSection>;

export const Default: Story = {};

export const Portuguese: Story = {
  globals: { locale: "br" },
};
