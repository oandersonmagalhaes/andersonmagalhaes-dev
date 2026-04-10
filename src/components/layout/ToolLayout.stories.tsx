import type { Meta, StoryObj } from "@storybook/nextjs";
import ToolLayout from "./ToolLayout";

const meta: Meta<typeof ToolLayout> = {
  title: "Layout/ToolLayout",
  component: ToolLayout,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/en/base64-translator",
      },
    },
  },
  args: {
    titleKey: "base64.title",
    descriptionKey: "base64.description",
  },
};

export default meta;
type Story = StoryObj<typeof ToolLayout>;

export const Base64: Story = {
  render: (args) => (
    <ToolLayout {...args}>
      <div
        style={{
          backgroundColor: "var(--color-card)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-lg)",
          padding: "1.5rem",
        }}
      >
        <p style={{ color: "var(--color-text-muted)", fontSize: "0.875rem" }}>
          Tool content goes here.
        </p>
      </div>
    </ToolLayout>
  ),
};

export const JwtValidator: Story = {
  args: {
    titleKey: "jwt.title",
    descriptionKey: "jwt.description",
  },
  render: (args) => (
    <ToolLayout {...args}>
      <div
        style={{
          backgroundColor: "var(--color-card)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-lg)",
          padding: "1.5rem",
        }}
      >
        <p style={{ color: "var(--color-text-muted)", fontSize: "0.875rem" }}>
          JWT decoder placeholder.
        </p>
      </div>
    </ToolLayout>
  ),
};
