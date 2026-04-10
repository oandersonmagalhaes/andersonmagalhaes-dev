import type { Meta, StoryObj } from "@storybook/nextjs";
import ContactSection from "./ContactSection";

const meta: Meta<typeof ContactSection> = {
  title: "Sections/ContactSection",
  component: ContactSection,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof ContactSection>;

export const Default: Story = {};

export const Portuguese: Story = {
  globals: { locale: "br" },
};
