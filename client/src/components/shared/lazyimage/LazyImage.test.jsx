import { render } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import LazyImage from "./LazyImage";

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    img: ({ children, onLoad, ...props }) => <img {...props} onLoad={onLoad} />,
  },
}));

describe("LazyImage Component", () => {
  it("renders with src and alt attributes", () => {
    const { getByAltText } = render(
      <LazyImage src="/test-image.jpg" alt="Test Image" />,
    );
    const img = getByAltText("Test Image");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "/test-image.jpg");
  });

  it("applies custom className", () => {
    const { getByAltText } = render(
      <LazyImage src="/test.jpg" alt="Test" className="custom-class" />,
    );
    expect(getByAltText("Test")).toHaveClass("custom-class");
  });

  it("shows placeholder before image loads", () => {
    const { container } = render(<LazyImage src="/test.jpg" alt="Test" />);
    // Placeholder div should exist initially
    const placeholder = container.querySelector(".bg-gray-100");
    expect(placeholder).toBeInTheDocument();
  });
});
