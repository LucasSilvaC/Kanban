import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import Header from "../components/header/header";
import { MemoryRouter } from "react-router-dom";

const navigateMock = vi.fn();

vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return {
        ...actual,
        useNavigate: () => navigateMock,
    };
});

describe("Header Component", () => {
    beforeEach(() => {
        navigateMock.mockClear();
    });

    it("abre modal de cadastro de usuário ao clicar no botão", () => {
        render(
            <MemoryRouter>
                <Header />
            </MemoryRouter>
        );

        fireEvent.click(
            screen.getByRole("menuitem", { name: /abrir cadastro de usuário/i })
        );

        expect(
            screen.getByRole("heading", { name: /cadastro de usuário/i })
        ).toBeInTheDocument();
    });

    it("navega para /table-views ao clicar em Gerenciar tarefas", () => {
        render(
            <MemoryRouter>
                <Header />
            </MemoryRouter>
        );

        fireEvent.click(
            screen.getByRole("menuitem", { name: /ir para gerenciamento de tarefas/i })
        );

        expect(navigateMock).toHaveBeenCalledWith("/table-views");
    });
});