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

const cardWrap: React.CSSProperties = { width: "20rem" };
const projectWrap: React.CSSProperties = {
  width: "24rem",
  display: "flex",
  flexDirection: "column",
  gap: "0.75rem",
};
const titleStyle: React.CSSProperties = {
  fontSize: "1.125rem",
  fontWeight: 600,
  fontFamily: "var(--font-mono)",
  color: "var(--color-text-strong)",
  marginBottom: "0.5rem",
};
const bodyStyle: React.CSSProperties = {
  color: "var(--color-text-muted)",
  fontSize: "0.875rem",
  lineHeight: 1.625,
};
const tagsStyle: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "0.5rem",
};

export const Default: Story = {
  render: (args) => (
    <div style={cardWrap}>
      <Card {...args}>
        <h3 style={titleStyle}>Card Title</h3>
        <p style={bodyStyle}>
          Cards are the base container for projects, experience entries, and
          tool panels across the site.
        </p>
      </Card>
    </div>
  ),
};

export const NoHover: Story = {
  args: { hover: false },
  render: (args) => (
    <div style={cardWrap}>
      <Card {...args}>
        <p style={bodyStyle}>Hover effect disabled.</p>
      </Card>
    </div>
  ),
};

export const ProjectCard: Story = {
  render: () => (
    <div style={projectWrap}>
      <Card>
        <h3 style={{ ...titleStyle, marginBottom: "0.75rem" }}>
          andersonmagalhaes.dev
        </h3>
        <p style={{ ...bodyStyle, marginBottom: "0.75rem" }}>
          Personal portfolio site with bilingual content and developer tools.
        </p>
        <div style={tagsStyle}>
          <Badge variant="gray">Next.js</Badge>
          <Badge variant="gray">Vanilla CSS</Badge>
          <Badge variant="gray">TypeScript</Badge>
        </div>
      </Card>
    </div>
  ),
};
