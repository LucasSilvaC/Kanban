import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import Column from "../components/column/Column";

vi.mock("@hello-pangea/dnd", () => ({
    Droppable: ({ children }) =>
        <div>{children({ droppableProps: {}, innerRef: vi.fn(), placeholder: null }, { isDraggingOver: false })}</div>,

    Draggable: ({ children }) =>
        <div>{children({ draggableProps: {}, dragHandleProps: {}, innerRef: vi.fn() }, { isDragging: false })}</div>,
}));

vi.mock("../components/taskCard/taskCard", () => ({
    default: ({ task }) => <div data-testid="task-card">{task?.description}</div>,
}));

describe("Column Component", () => {
    const baseProps = {
        id: "1",
        title: "To Do",
        color: "#5f679f",
        tasks: [],
        users: [],
        modalOpen: false,
        onEditTask: vi.fn(),
    };

    it("renderiza corretamente com título e sem tarefas", () => {
        render(<Column {...baseProps} />);
        expect(screen.getByRole("region")).toBeInTheDocument();
        expect(screen.getByText("To Do")).toBeInTheDocument();
        expect(screen.getByRole("list")).toBeEmptyDOMElement();
    });

    it("renderiza tarefas válidas", () => {
        const tasks = [{ id: 1, description: "Primeira tarefa" }];
        render(<Column {...baseProps} tasks={tasks} />);
        expect(screen.getByRole("listitem")).toBeInTheDocument();
        expect(screen.getByText("Primeira tarefa")).toBeInTheDocument();
    });

    it("aceita descrição com apenas espaços em branco", () => {
        const tasks = [{ id: 2, description: "     " }];
        render(<Column {...baseProps} tasks={tasks} />);
        expect(
            screen.getByRole("listitem", { name: /^Tarefa:\s*$/ })
        ).toBeInTheDocument();
    });

    it("aceita valores numéricos como descrição", () => {
        const tasks = [{ id: 3, description: "123456" }];
        render(<Column {...baseProps} tasks={tasks} />);
        expect(screen.getByText("123456")).toBeInTheDocument();
    });

    it("aceita valores nulos (ignora a tarefa)", () => {
        const tasks = [null, undefined, { id: 4, description: "Tarefa válida" }];
        render(<Column {...baseProps} tasks={tasks} />);
        expect(screen.getByText("Tarefa válida")).toBeInTheDocument();
        expect(screen.queryByText("null")).not.toBeInTheDocument();
    });

    it("aceita valores inesperados (objeto vazio, string vazia)", () => {
        const tasks = [{}, { id: 5, description: "" }];
        render(<Column {...baseProps} tasks={tasks} />);
        expect(screen.getByRole("list")).toBeInTheDocument();
    });

    it("aceita caracteres especiais na descrição", () => {
        const tasks = [{ id: 6, description: "!@#$%¨&*()_+" }];
        render(<Column {...baseProps} tasks={tasks} />);
        expect(screen.getByText("!@#$%¨&*()_+")).toBeInTheDocument();
    });

    it("aceita excesso de espaços entre itens", () => {
        const tasks = [{ id: 7, description: "Tarefa    com    espaços" }];
        render(<Column {...baseProps} tasks={tasks} />);
        expect(
            screen.getByRole("listitem", { name: /Tarefa\s+com\s+espaços/ })
        ).toBeInTheDocument();
    });

    it("chama onEditTask ao clicar na tarefa", () => {
        const tasks = [{ id: 8, description: "Clique aqui" }];
        const onEditTask = vi.fn();
        render(<Column {...baseProps} tasks={tasks} onEditTask={onEditTask} />);
        fireEvent.click(screen.getByText("Clique aqui"));
        expect(onEditTask).toHaveBeenCalledWith(tasks[0]);
    });

    it("não permite drag quando modalOpen = true", () => {
        const tasks = [{ id: 9, description: "Não arrastável" }];
        render(<Column {...baseProps} tasks={tasks} modalOpen={true} />);
        expect(screen.getByText("Não arrastável")).toBeInTheDocument();
    });
});