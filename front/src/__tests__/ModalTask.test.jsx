import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import ModalTask from "../organisms/modalTask/ModalTask";
import useModalTaskViewModel from "../organisms/modal/modalTask/ModalTask";

vi.mock("../organisms/modal/modalTask/view-model/useModalTaskViewModel");

describe("ModalTask Component", () => {
  const mockUsers = [
    { id: 1, name: "Lucas", email: "lucas@test.com" },
    { id: 2, name: "Ana", email: "ana@test.com" },
  ];

  const onCloseMock = vi.fn();
  const refreshTasksMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renderiza o modal de criação corretamente", () => {
    useModalTaskViewModel.mockReturnValue({
      modalRef: { current: null },
      userId: "",
      setUserId: vi.fn(),
      description: "",
      setDescription: vi.fn(),
      sectorName: "",
      setSectorName: vi.fn(),
      priority: "",
      setPriority: vi.fn(),
      loading: false,
      error: null,
      errors: [],
      handleSubmit: vi.fn((e) => e.preventDefault()),
      handleDelete: vi.fn(),
    });

    render(
      <ModalTask onClose={onCloseMock} users={mockUsers} task={null} refreshTasks={refreshTasksMock} />
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Cadastro de Tarefa")).toBeInTheDocument();
    expect(screen.getByLabelText("Selecionar usuário")).toBeInTheDocument();
    expect(screen.getByLabelText("Descrição da tarefa")).toBeInTheDocument();
    expect(screen.getByLabelText("Setor")).toBeInTheDocument();
    expect(screen.getByLabelText("Prioridade")).toBeInTheDocument();
    expect(screen.getByText("Cadastrar")).toBeInTheDocument();
  });

  it("renderiza o modal de edição com botão excluir", () => {
    useModalTaskViewModel.mockReturnValue({
      modalRef: { current: null },
      userId: "1",
      setUserId: vi.fn(),
      description: "Tarefa Teste",
      setDescription: vi.fn(),
      sectorName: "TI",
      setSectorName: vi.fn(),
      priority: "HIGH",
      setPriority: vi.fn(),
      loading: false,
      error: null,
      errors: [],
      handleSubmit: vi.fn((e) => e.preventDefault()),
      handleDelete: vi.fn(),
    });

    render(
      <ModalTask onClose={onCloseMock} users={mockUsers} task={{ id: 1 }} refreshTasks={refreshTasksMock} />
    );

    expect(screen.getByText("Editar Tarefa")).toBeInTheDocument();
    expect(screen.getByText("Atualizar")).toBeInTheDocument();
    expect(screen.getByText("Excluir")).toBeInTheDocument();
  });

  it("chama onClose ao clicar no botão de fechar", () => {
    useModalTaskViewModel.mockReturnValue({
      modalRef: { current: null },
      userId: "",
      setUserId: vi.fn(),
      description: "",
      setDescription: vi.fn(),
      sectorName: "",
      setSectorName: vi.fn(),
      priority: "",
      setPriority: vi.fn(),
      loading: false,
      error: null,
      errors: [],
      handleSubmit: vi.fn((e) => e.preventDefault()),
      handleDelete: vi.fn(),
    });

    render(<ModalTask onClose={onCloseMock} users={mockUsers} task={null} refreshTasks={refreshTasksMock} />);

    fireEvent.click(screen.getByRole("button", { name: /Fechar/i }));
    expect(onCloseMock).toHaveBeenCalled();
  });

  it("exibe mensagens de erro e validação corretamente", () => {
    useModalTaskViewModel.mockReturnValue({
      modalRef: { current: null },
      userId: "",
      setUserId: vi.fn(),
      description: "",
      setDescription: vi.fn(),
      sectorName: "",
      setSectorName: vi.fn(),
      priority: "",
      setPriority: vi.fn(),
      loading: false,
      error: "Erro ao salvar",
      errors: ["Campo usuário obrigatório", "Campo descrição obrigatório"],
      handleSubmit: vi.fn((e) => e.preventDefault()),
      handleDelete: vi.fn(),
    });

    render(<ModalTask onClose={onCloseMock} users={mockUsers} task={null} refreshTasks={refreshTasksMock} />);

    expect(screen.getByText("Erro ao salvar")).toBeInTheDocument();
    expect(screen.getByText("Campo usuário obrigatório")).toBeInTheDocument();
    expect(screen.getByText("Campo descrição obrigatório")).toBeInTheDocument();
  });

  it("desabilita botões quando loading é true", () => {
    useModalTaskViewModel.mockReturnValue({
      modalRef: { current: null },
      userId: "",
      setUserId: vi.fn(),
      description: "",
      setDescription: vi.fn(),
      sectorName: "",
      setSectorName: vi.fn(),
      priority: "",
      setPriority: vi.fn(),
      loading: true,
      error: null,
      errors: [],
      handleSubmit: vi.fn((e) => e.preventDefault()),
      handleDelete: vi.fn(),
    });

    render(<ModalTask onClose={onCloseMock} users={mockUsers} task={{ id: 1 }} refreshTasks={refreshTasksMock} />);

    expect(screen.getByText("Salvando...")).toBeDisabled();
    expect(screen.getByText("Excluir")).toBeDisabled();
  });
});