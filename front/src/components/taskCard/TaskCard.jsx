import { useState } from "react";
import ModalTask from "../../organisms/modal/modalTask/ModalTask";

const PRIORITY_COLOR_MAP = {
  LOW: "bg-green-500",
  MEDIUM: "bg-yellow-500",
  HIGH: "bg-red-500",
};

const PRIORITY_LABEL_MAP = {
  LOW: "Baixa prioridade",
  MEDIUM: "Média prioridade",
  HIGH: "Alta prioridade",
};

export default function TaskCard({ task, color, users, refreshTasks }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const handleOpenModal = (taskToEdit = null) => {
    setSelectedTask(taskToEdit);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedTask(null);
  };

  const getPriorityColor = (priority) => {
    return PRIORITY_COLOR_MAP[priority] || "bg-gray-400";
  };

  const getPriorityLabel = (priority) => {
    return PRIORITY_LABEL_MAP[priority] || "Prioridade indefinida";
  };

  return (
    <>
      <article
        tabIndex={0}
        aria-labelledby={`task-title-${task.id}`}
        role="group"
        className={`p-5 bg-white border-l-4 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between ${color}`}
        aria-label={`Cartão de tarefa: ${task.description}`}
      >
        <p
          id={`task-title-${task.id}`}
          className="text-gray-800 font-semibold text-lg mb-3 line-clamp-2"
        >
          {task.description}
        </p>

        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center gap-3">
            <span
              role="status"
              aria-label={getPriorityLabel(task.priority)}
              className={`w-4 h-4 rounded-full ${getPriorityColor(task.priority)}`}
            ></span>

            <span
              className="text-sm text-gray-500"
              aria-label={`Setor: ${task.sector_name}`}
            >
              {task.sector_name}
            </span>
          </div>

          <button
            type="button"
            aria-label={`Editar tarefa: ${task.description}`}
            className="text-sm text-[#5f679f] hover:text-[#4a5585] font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#5f679f] rounded px-2 py-1"
            onClick={() => handleOpenModal(task)}
          >
            Editar
          </button>
        </div>
      </article>

      {modalOpen && (
        <ModalTask
          task={selectedTask}
          users={users}
          onClose={handleCloseModal}
          refreshTasks={refreshTasks}
        />
      )}
    </>
  );
}