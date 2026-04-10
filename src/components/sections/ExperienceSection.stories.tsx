import type { Meta, StoryObj } from "@storybook/nextjs";
import ExperienceSection from "./ExperienceSection";

const meta: Meta<typeof ExperienceSection> = {
  title: "Sections/ExperienceSection",
  component: ExperienceSection,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof ExperienceSection>;

export const Default: Story = {};

export const Portuguese: Story = {
  globals: { locale: "br" },
};
