import { render } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Iconify from "@/components/shared/iconify";

// Mock the Icon component from @iconify/react as it might not render exactly in jsdom
vi.mock("@iconify/react", () => ({
  Icon: ({ icon, width, height, ...props }) => (
    <div
      data-testid="iconify-icon"
      data-icon={icon}
      data-width={width}
      {...props}
    />
  ),
}));

describe("Iconify Component", () => {
  it("renders correctly with given icon and width", () => {
    const { getByTestId } = render(
      <Iconify icon="solar:user-bold" width={24} />,
    );
    const iconElement = getByTestId("iconify-icon");

    expect(iconElement).toBeInTheDocument();
    expect(iconElement).toHaveAttribute("data-icon", "solar:user-bold");
    expect(iconElement).toHaveAttribute("data-width", "24");
  });

  it("applies custom className", () => {
    const { getByTestId } = render(
      <Iconify icon="solar:user-bold" className="custom-class" />,
    );
    const iconElement = getByTestId("iconify-icon");

    expect(iconElement).toHaveClass("custom-class");
    expect(iconElement).toHaveClass("component-iconify");
  });
});
