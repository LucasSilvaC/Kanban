import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import ModalRegister from "../organisms/modal/modalRegister/ModalRegister";
import useModalRegisterViewModel from "../organisms/modal/modalRegister/view-model/useModalRegisterViewModel";

vi.mock("../organisms/modal/modalRegister/view-model/useModalRegisterViewModel");

describe("ModalRegister Component", () => {
  const mockRefreshUsers = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renderiza a modal de cadastro corretamente", () => {
    useModalRegisterViewModel.mockReturnValue({
      modalRef: { current: null },
      name: "",
      setName: vi.fn(),
      email: "",
      setEmail: vi.fn(),
      loading: false,
      error: null,
      nameError: null,
      emailError: null,
      handleSubmit: vi.fn((e) => e.preventDefault()),
    });

    render(<ModalRegister refreshUsers={mockRefreshUsers} onClose={vi.fn()} />);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Cadastro de Usuário")).toBeInTheDocument();
    expect(screen.getByLabelText("Nome completo")).toBeInTheDocument();
    expect(screen.getByLabelText("Endereço de e-mail")).toBeInTheDocument();
    expect(screen.getByText("Cadastrar Usuário")).toBeInTheDocument();
  });

  it("exibe mensagens de erro e validação corretamente", () => {
    useModalRegisterViewModel.mockReturnValue({
      modalRef: { current: null },
      name: "",
      setName: vi.fn(),
      email: "",
      setEmail: vi.fn(),
      loading: false,
      error: "Erro ao salvar usuário",
      nameError: "Nome é obrigatório",
      emailError: "E-mail inválido",
      handleSubmit: vi.fn((e) => e.preventDefault()),
    });

    render(<ModalRegister refreshUsers={mockRefreshUsers} onClose={vi.fn()} />);

    expect(screen.getByText("Erro ao salvar usuário")).toBeInTheDocument();
    expect(screen.getByText("Nome é obrigatório")).toBeInTheDocument();
    expect(screen.getByText("E-mail inválido")).toBeInTheDocument();
  });

  it("desabilita botão quando loading é true", () => {
    useModalRegisterViewModel.mockReturnValue({
      modalRef: { current: null },
      name: "João Silva",
      setName: vi.fn(),
      email: "joao@test.com",
      setEmail: vi.fn(),
      loading: true,
      error: null,
      nameError: null,
      emailError: null,
      handleSubmit: vi.fn((e) => e.preventDefault()),
    });

    render(<ModalRegister refreshUsers={mockRefreshUsers} onClose={vi.fn()} />);

    expect(screen.getByRole("button", { name: "Cadastrando..." })).toBeDisabled();
  });

  it("chama onClose ao clicar no botão de fechar", () => {
    const onCloseMock = vi.fn();
    useModalRegisterViewModel.mockReturnValue({
      modalRef: { current: null },
      name: "",
      setName: vi.fn(),
      email: "",
      setEmail: vi.fn(),
      loading: false,
      error: null,
      nameError: null,
      emailError: null,
      handleSubmit: vi.fn((e) => e.preventDefault()),
    });

    render(<ModalRegister refreshUsers={mockRefreshUsers} onClose={onCloseMock} />);

    fireEvent.click(screen.getByRole("button", { name: /Fechar/i }));
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  it("chama onClose ao clicar fora da modal", () => {
    const onCloseMock = vi.fn();
    useModalRegisterViewModel.mockReturnValue({
      modalRef: { current: null },
      name: "",
      setName: vi.fn(),
      email: "",
      setEmail: vi.fn(),
      loading: false,
      error: null,
      nameError: null,
      emailError: null,
      handleSubmit: vi.fn((e) => e.preventDefault()),
    });

    render(<ModalRegister refreshUsers={mockRefreshUsers} onClose={onCloseMock} />);

    const backdrop = screen.getByRole("dialog");
    fireEvent.click(backdrop);
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  it("não chama onClose ao clicar dentro da modal", () => {
    const onCloseMock = vi.fn();
    useModalRegisterViewModel.mockReturnValue({
      modalRef: { current: null },
      name: "",
      setName: vi.fn(),
      email: "",
      setEmail: vi.fn(),
      loading: false,
      error: null,
      nameError: null,
      emailError: null,
      handleSubmit: vi.fn((e) => e.preventDefault()),
    });

    render(<ModalRegister refreshUsers={mockRefreshUsers} onClose={onCloseMock} />);

    const modalContent = screen.getByRole("document");
    fireEvent.click(modalContent);
    expect(onCloseMock).not.toHaveBeenCalled();
  });

  it("exibe spinner de carregamento quando loading é true", () => {
    useModalRegisterViewModel.mockReturnValue({
      modalRef: { current: null },
      name: "João Silva",
      setName: vi.fn(),
      email: "joao@test.com",
      setEmail: vi.fn(),
      loading: true,
      error: null,
      nameError: null,
      emailError: null,
      handleSubmit: vi.fn((e) => e.preventDefault()),
    });

    render(<ModalRegister refreshUsers={mockRefreshUsers} onClose={vi.fn()} />);

    expect(screen.getByText("Cadastrando...")).toBeInTheDocument();
    const button = screen.getByRole("button", { name: "Cadastrando..." });
    const spinner = button.querySelector("svg.animate-spin");
    expect(spinner).toBeInTheDocument();
  });

  it("exibe ícone de usuário no modo de cadastro", () => {
    useModalRegisterViewModel.mockReturnValue({
      modalRef: { current: null },
      name: "",
      setName: vi.fn(),
      email: "",
      setEmail: vi.fn(),
      loading: false,
      error: null,
      nameError: null,
      emailError: null,
      handleSubmit: vi.fn((e) => e.preventDefault()),
    });

    render(<ModalRegister refreshUsers={mockRefreshUsers} onClose={vi.fn()} />);

    const userIcon = screen.getByText("Cadastro de Usuário").previousElementSibling;
    expect(userIcon).toBeInTheDocument();
    expect(userIcon).toHaveClass("bg-green-500");
  });

  it("exibe descrição auxiliar na modal", () => {
    useModalRegisterViewModel.mockReturnValue({
      modalRef: { current: null },
      name: "",
      setName: vi.fn(),
      email: "",
      setEmail: vi.fn(),
      loading: false,
      error: null,
      nameError: null,
      emailError: null,
      handleSubmit: vi.fn((e) => e.preventDefault()),
    });

    render(<ModalRegister refreshUsers={mockRefreshUsers} onClose={vi.fn()} />);

    expect(screen.getByText("Preencha os campos abaixo para criar uma nova conta")).toBeInTheDocument();
  });

  it("exibe botão de cancelar no rodapé", () => {
    useModalRegisterViewModel.mockReturnValue({
      modalRef: { current: null },
      name: "",
      setName: vi.fn(),
      email: "",
      setEmail: vi.fn(),
      loading: false,
      error: null,
      nameError: null,
      emailError: null,
      handleSubmit: vi.fn((e) => e.preventDefault()),
    });

    render(<ModalRegister refreshUsers={mockRefreshUsers} onClose={vi.fn()} />);

    expect(screen.getByText("Cancelar")).toBeInTheDocument();
  });
});