import { useState } from "react";
import ModalTask from "../../organisms/modal/modalTask/ModalTask";

export default function TaskCard({ task, color, users, refreshTasks }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const prioridadeColorMap = {
    LOW: "bg-green-500",
    MEDIUM: "bg-yellow-500",
    HIGH: "bg-red-500",
  };

  const abrirModal = (task = null) => {
    setSelectedTask(task);
    setModalOpen(true);
  };

  return (
    <>
      <div
        className={`p-5 bg-white border-l-4 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between ${color}`}
      >
        <p className="text-gray-800 font-semibold text-lg mb-3 line-clamp-2">
          {task.description}
        </p>

        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center gap-3">
            <span
              className={`w-4 h-4 rounded-full ${
                prioridadeColorMap[task.priority] || "bg-gray-400"
              }`}
            ></span>

            <span className="text-sm text-gray-500">{task.sector_name}</span>
          </div>

          <button
            className="text-sm text-[#5f679f] hover:text-[#4a5585] font-medium transition-colors"
            onClick={() => abrirModal(task)} 
          >
            Editar
          </button>
        </div>
      </div>

      {modalOpen && (
        <ModalTask
          task={selectedTask} 
          users={users}
          onClose={() => setModalOpen(false)}
          refreshTasks={refreshTasks}
        />
      )}
    </>
  );
}