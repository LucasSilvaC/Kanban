import { DragDropContext } from "@hello-pangea/dnd";
import Column from "../../components/column/Column";
import ModalTask from "../modal/modalTask/ModalTask";
import { IoDocumentTextOutline } from "react-icons/io5";
import { PiGearBold } from "react-icons/pi";
import { IoCheckmarkDoneSharp } from "react-icons/io5";
import useFrameViewModel from "./viewModel/UseFrameViewModel";

export default function Frame() {
  const {
    tasks,
    users,
    modalOpen,
    selectedTask,
    fetchTasks,
    onDragEnd,
    handleEditTask,
    handleCloseModal,
  } = useFrameViewModel();

  const columns = [
    { id: "todo", title: "A Fazer", icon: IoDocumentTextOutline, color: "border-red-400" },
    { id: "doing", title: "Fazendo", icon: PiGearBold, color: "border-yellow-400" },
    { id: "done", title: "Pronto", icon: IoCheckmarkDoneSharp, color: "border-green-400" },
  ];

  return (
    <>
      {!modalOpen && (
        <DragDropContext
          onDragEnd={onDragEnd}
          aria-roledescription="Arrastar e soltar tarefas entre colunas"
        >
          <main
            className="flex-1 p-6 grid grid-cols-1 md:grid-cols-3 gap-6"
            role="main"
            aria-label="Quadro Kanban de tarefas"
            tabIndex={0}
          >
            {columns.map((col) => (
              <Column
                key={col.id}
                id={col.id}
                title={col.title}
                icon={col.icon}
                color={col.color}
                tasks={tasks[col.id] || []}
                users={users}
                onEditTask={handleEditTask}
                modalOpen={modalOpen}
              />
            ))}
          </main>
        </DragDropContext>
      )}

      {modalOpen && (
        <ModalTask
          onClose={handleCloseModal}
          users={users}
          task={selectedTask}
          refreshTasks={fetchTasks}
        />
      )}
    </>
  );
}