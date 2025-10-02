import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import Frame from "../organisms/frame/Frame";
import useFrameViewModel from "../organisms/frame/view-model/UseFrameViewModel";

vi.mock("../organisms/frame/view-model/UseFrameViewModel");

describe("Frame Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renderiza as colunas quando modal fechado", () => {
    useFrameViewModel.mockReturnValue({
      tasks: {
        todo: [{ id: 1, description: "Tarefa 1", priority: "HIGH", sector_name: "TI" }],
        doing: [],
        done: [],
      },
      users: [{ id: 1, name: "Lucas" }],
      modalOpen: false,
      selectedTask: null,
      fetchTasks: vi.fn(),
      onDragEnd: vi.fn(),
      handleEditTask: vi.fn(),
      handleCloseModal: vi.fn(),
    });

    render(<Frame />);

    expect(screen.getByRole("main", { name: /Quadro Kanban de tarefas/i })).toBeInTheDocument();
    expect(screen.getByText("A Fazer")).toBeInTheDocument();
    expect(screen.getByText("Fazendo")).toBeInTheDocument();
    expect(screen.getByText("Pronto")).toBeInTheDocument();
    expect(screen.getByText("Tarefa 1")).toBeInTheDocument();
  });

  it("renderiza o modal quando modal aberto", () => {
    const fetchTasksMock = vi.fn();
    const handleCloseModalMock = vi.fn();
    const selectedTask = { id: 1, description: "Tarefa Modal" };

    useFrameViewModel.mockReturnValue({
      tasks: { todo: [], doing: [], done: [] },
      users: [{ id: 1, name: "Lucas" }],
      modalOpen: true,
      selectedTask,
      fetchTasks: fetchTasksMock,
      onDragEnd: vi.fn(),
      handleEditTask: vi.fn(),
      handleCloseModal: handleCloseModalMock,
    });

    render(<Frame />);

    expect(screen.getByRole("heading", { name: /Editar Tarefa/i })).toBeInTheDocument();

    expect(screen.getByDisplayValue("Tarefa Modal")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Fechar/i }));
    expect(handleCloseModalMock).toHaveBeenCalled();
  });
});