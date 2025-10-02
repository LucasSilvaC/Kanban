import { render, screen } from "@testing-library/react";
import HomeKanban from "../pages/home/Home"; 
import Header from "../components/header/header";
import Frame from "../organisms/frame/Frame";

vi.mock("../components/header/header", () => ({
  default: () => <div data-testid="header-mock" />,
}));

vi.mock("../organisms/frame/Frame", () => ({
  default: () => <div data-testid="frame-mock" />,
}));

describe("HomeKanban", () => {
  it("renderiza corretamente o container principal", () => {
    render(<HomeKanban />);
    expect(screen.getByRole("application")).toBeInTheDocument();
  });

  it("contém o Header", () => {
    render(<HomeKanban />);
    expect(screen.getByTestId("header-mock")).toBeInTheDocument();
  });

  it("contém o Frame", () => {
    render(<HomeKanban />);
    expect(screen.getByTestId("frame-mock")).toBeInTheDocument();
  });

  it("main possui aria-describedby correto", () => {
    render(<HomeKanban />);
    const main = screen.getByRole("main");
    expect(main).toHaveAttribute("aria-describedby", "home-description");
    expect(screen.getByText(/Página principal do aplicativo Kanban/)).toBeInTheDocument();
  });
});