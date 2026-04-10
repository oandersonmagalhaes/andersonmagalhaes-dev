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

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Badge variant="orange">orange</Badge>
      <Badge variant="emerald">emerald</Badge>
      <Badge variant="gray">gray</Badge>
    </div>
  ),
};

export const TechStack: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2 max-w-md">
      {["Next.js", "React", "TypeScript", "Tailwind", "Node.js", "PostgreSQL"].map(
        (tech) => (
          <Badge key={tech} variant="gray">
            {tech}
          </Badge>
        )
      )}
    </div>
  ),
};
