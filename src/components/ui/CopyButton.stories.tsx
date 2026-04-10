import type { Meta, StoryObj } from "@storybook/nextjs";
import CopyButton from "./CopyButton";

const meta: Meta<typeof CopyButton> = {
  title: "UI/CopyButton",
  component: CopyButton,
  args: {
    text: "Hello from Storybook!",
  },
};

export default meta;
type Story = StoryObj<typeof CopyButton>;

export const Default: Story = {};

export const LongPayload: Story = {
  args: {
    text: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9FYR8Eu1cwUM8",
  },
};
