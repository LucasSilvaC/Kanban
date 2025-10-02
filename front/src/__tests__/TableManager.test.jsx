import { render, screen, fireEvent, within } from "@testing-library/react";
import { vi } from "vitest";
import TableManager from "../organisms/tableManager/TableManager";
import useTableManagerViewModel from "../organisms/tableManager/view-model/useTableManagerViewModel";

vi.mock("../organisms/tableManager/view-model/useTableManagerViewModel");

describe("TableManager Component", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renderiza usuários e tarefas quando não está carregando", () => {
        useTableManagerViewModel.mockReturnValue({
            users: [{ id: 1, name: "Lucas", email: "lucas@test.com" }],
            tasks: [
                {
                    id: 1,
                    user_name: "Lucas",
                    description: "Tarefa 1",
                    sector_name: "TI",
                    priority: "HIGH",
                    status: "TODO",
                    created_at: "2025-10-01T12:00:00Z",
                },
            ],
            loading: { users: false, tasks: false },
            error: null,
            showModal: false,
            currentTask: null,
            handleEditTask: vi.fn(),
            handleNewTask: vi.fn(),
            handleDeleteTask: vi.fn(),
            handleDeleteUser: vi.fn(),
            closeModal: vi.fn(),
            fetchTasks: vi.fn(),
        });

        render(<TableManager />);

        const usersTable = screen.getByRole("table", { name: /Tabela de usuários/i });
        const tasksTable = screen.getByRole("table", { name: /Tabela de tarefas/i });

        expect(usersTable).toBeInTheDocument();
        expect(tasksTable).toBeInTheDocument();

        expect(within(usersTable).getByText("Lucas")).toBeInTheDocument();
        expect(within(tasksTable).getByText("Lucas")).toBeInTheDocument();

        expect(within(tasksTable).getByText("Tarefa 1")).toBeInTheDocument();
        expect(within(tasksTable).getByText("TI")).toBeInTheDocument();
    });

    it("mostra carregando usuários e tarefas", () => {
        useTableManagerViewModel.mockReturnValue({
            users: [],
            tasks: [],
            loading: { users: true, tasks: true },
            error: null,
            showModal: false,
            currentTask: null,
            handleEditTask: vi.fn(),
            handleNewTask: vi.fn(),
            handleDeleteTask: vi.fn(),
            handleDeleteUser: vi.fn(),
            closeModal: vi.fn(),
            fetchTasks: vi.fn(),
        });

        render(<TableManager />);

        expect(screen.getByText("Carregando usuários...")).toBeInTheDocument();
        expect(screen.getByText("Carregando tarefas...")).toBeInTheDocument();
    });

    it("renderiza erro quando existe", () => {
        useTableManagerViewModel.mockReturnValue({
            users: [],
            tasks: [],
            loading: { users: false, tasks: false },
            error: "Falha ao carregar dados",
            showModal: false,
            currentTask: null,
            handleEditTask: vi.fn(),
            handleNewTask: vi.fn(),
            handleDeleteTask: vi.fn(),
            handleDeleteUser: vi.fn(),
            closeModal: vi.fn(),
            fetchTasks: vi.fn(),
        });

        render(<TableManager />);
        expect(screen.getByRole("alert")).toHaveTextContent("Falha ao carregar dados");
    });

    it("abre modal quando showModal true", () => {
        const closeModalMock = vi.fn();
        useTableManagerViewModel.mockReturnValue({
            users: [],
            tasks: [],
            loading: { users: false, tasks: false },
            error: null,
            showModal: true,
            currentTask: { id: 1, description: "Tarefa Modal" },
            handleEditTask: vi.fn(),
            handleNewTask: vi.fn(),
            handleDeleteTask: vi.fn(),
            handleDeleteUser: vi.fn(),
            closeModal: closeModalMock,
            fetchTasks: vi.fn(),
        });

        render(<TableManager />);
        expect(screen.getByDisplayValue("Tarefa Modal")).toBeInTheDocument();

        fireEvent.click(screen.getByRole("button", { name: /Fechar/i }));
        expect(closeModalMock).toHaveBeenCalled();
    });
});