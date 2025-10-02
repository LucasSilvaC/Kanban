import { render, screen, cleanup } from "@testing-library/react";
import { vi } from "vitest";
import TaskCard from "../components/taskCard/TaskCard";

vi.mock("../organisms/modal/modalTask/ModalTask", () => ({
  default: ({ onClose }) => null,
}));

const mockTask = {
  id: 1,
  description: "Testar TaskCard",
  priority: "HIGH",
  sector_name: "TI",
};

const mockUsers = [
  { id: 1, name: "Lucas" },
  { id: 2, name: "Maria" },
];

describe("TaskCard Component", () => {
  afterEach(() => cleanup());

  test.each([
    ["LOW", "Baixa prioridade", "bg-green-500"],
    ["MEDIUM", "Média prioridade", "bg-yellow-500"],
    ["HIGH", "Alta prioridade", "bg-red-500"],
    ["UNKNOWN", "Prioridade indefinida", "bg-gray-400"],
  ])("aplica a cor %s corretamente", (priority, label, color) => {
    render(<TaskCard task={{ ...mockTask, priority }} users={mockUsers} />);

    const status = screen.getByLabelText(label);
    expect(status).toHaveClass(color);
  });
});