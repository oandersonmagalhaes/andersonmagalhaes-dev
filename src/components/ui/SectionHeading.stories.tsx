import type { Meta, StoryObj } from "@storybook/nextjs";
import SectionHeading from "./SectionHeading";

const meta: Meta<typeof SectionHeading> = {
  title: "UI/SectionHeading",
  component: SectionHeading,
  parameters: {
    layout: "padded",
  },
  args: {
    title: "About Me",
  },
};

export default meta;
type Story = StoryObj<typeof SectionHeading>;

export const Default: Story = {};

export const Projects: Story = {
  args: { title: "Projects" },
};

export const Skills: Story = {
  args: { title: "Skills & Technologies" },
};
