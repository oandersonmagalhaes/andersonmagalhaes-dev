import type { Meta, StoryObj } from "@storybook/nextjs";
import ProjectsSection from "./ProjectsSection";

const meta: Meta<typeof ProjectsSection> = {
  title: "Sections/ProjectsSection",
  component: ProjectsSection,
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
type Story = StoryObj<typeof ProjectsSection>;

export const Default: Story = {};

export const Portuguese: Story = {
  globals: { locale: "br" },
};
