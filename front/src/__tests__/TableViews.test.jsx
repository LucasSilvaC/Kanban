import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import TableViews from "../pages/tableViews/TableViews";

vi.mock("../components/header/Header", () => ({
    default: () => <div data-testid="header-mock" />
}));
vi.mock("../organisms/tableManager/TableManager", () => ({
    default: () => <div data-testid="tablemanager-mock" />
}));

describe("TableViews Component", () => {
    it("renderiza Header e TableManager", () => {
        render(<TableViews />);
        expect(screen.getByTestId("header-mock")).toBeInTheDocument();
        expect(screen.getByTestId("tablemanager-mock")).toBeInTheDocument();
    });
});