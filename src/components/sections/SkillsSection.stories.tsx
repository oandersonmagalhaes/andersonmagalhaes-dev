import type { Meta, StoryObj } from "@storybook/nextjs";
import SkillsSection from "./SkillsSection";

const meta: Meta<typeof SkillsSection> = {
  title: "Sections/SkillsSection",
  component: SkillsSection,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof SkillsSection>;

export const Default: Story = {};

export const Portuguese: Story = {
  globals: { locale: "br" },
};
