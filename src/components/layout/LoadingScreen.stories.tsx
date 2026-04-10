import type { Meta, StoryObj } from "@storybook/nextjs";
import { useEffect } from "react";
import LoadingScreen from "./LoadingScreen";

const meta: Meta<typeof LoadingScreen> = {
  title: "Layout/LoadingScreen",
  component: LoadingScreen,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof LoadingScreen>;

const ResetSessionWrapper = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.sessionStorage.removeItem("am-loader-seen");
    }
  }, []);
  return <>{children}</>;
};

export const Default: Story = {
  render: () => (
    <ResetSessionWrapper>
      <div className="relative w-screen h-screen">
        <LoadingScreen />
      </div>
    </ResetSessionWrapper>
  ),
};
