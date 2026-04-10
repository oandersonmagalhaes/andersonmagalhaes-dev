import type { Meta, StoryObj } from "@storybook/nextjs";
import Card from "./Card";
import Badge from "./Badge";

const meta: Meta<typeof Card> = {
  title: "UI/Card",
  component: Card,
  argTypes: {
    hover: { control: "boolean" },
  },
  args: {
    hover: true,
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: (args) => (
    <Card {...args} className="w-80">
      <h3 className="text-lg font-semibold text-gray-100 font-mono mb-2">
        Card Title
      </h3>
      <p className="text-gray-400 text-sm leading-relaxed">
        Cards are the base container for projects, experience entries, and tool
        panels across the site.
      </p>
    </Card>
  ),
};

export const NoHover: Story = {
  args: { hover: false },
  render: (args) => (
    <Card {...args} className="w-80">
      <p className="text-gray-400 text-sm">Hover effect disabled.</p>
    </Card>
  ),
};

export const ProjectCard: Story = {
  render: () => (
    <Card className="w-96 flex flex-col gap-3">
      <h3 className="text-lg font-semibold text-gray-100 font-mono">
        andersonmagalhaes.dev
      </h3>
      <p className="text-gray-400 text-sm leading-relaxed">
        Personal portfolio site with bilingual content and developer tools.
      </p>
      <div className="flex flex-wrap gap-2">
        <Badge variant="gray">Next.js</Badge>
        <Badge variant="gray">Tailwind</Badge>
        <Badge variant="gray">TypeScript</Badge>
      </div>
    </Card>
  ),
};
