import type { Meta, StoryObj } from "@storybook/nextjs";
import AboutSection from "./AboutSection";

const meta: Meta<typeof AboutSection> = {
  title: "Sections/AboutSection",
  component: AboutSection,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof AboutSection>;

export const Default: Story = {};

export const Portuguese: Story = {
  globals: { locale: "br" },
};
