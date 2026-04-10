import type { Meta, StoryObj } from "@storybook/nextjs";
import Badge from "./Badge";

const meta: Meta<typeof Badge> = {
  title: "UI/Badge",
  component: Badge,
  argTypes: {
    variant: {
      control: { type: "inline-radio" },
      options: ["orange", "emerald", "gray"],
    },
  },
  args: {
    children: "TypeScript",
    variant: "gray",
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Gray: Story = {};

export const Orange: Story = {
  args: { variant: "orange" },
};

export const Emerald: Story = {
  args: { variant: "emerald" },
};

const wrapStyle: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: "0.5rem",
  maxWidth: "28rem",
};

export const AllVariants: Story = {
  render: () => (
    <div style={wrapStyle}>
      <Badge variant="orange">orange</Badge>
      <Badge variant="emerald">emerald</Badge>
      <Badge variant="gray">gray</Badge>
    </div>
  ),
};

export const TechStack: Story = {
  render: () => (
    <div style={wrapStyle}>
      {["Next.js", "React", "TypeScript", "Vanilla CSS", "Node.js", "PostgreSQL"].map(
        (tech) => (
          <Badge key={tech} variant="gray">
            {tech}
          </Badge>
        )
      )}
    </div>
  ),
};
