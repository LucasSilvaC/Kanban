import { DragDropContext } from "@hello-pangea/dnd";
import Column from "../../components/column/Column";
import ModalTask from "../modal/modalTask/ModalTask";
import { IoDocumentTextOutline } from "react-icons/io5";
import { PiGearBold } from "react-icons/pi";
import { IoCheckmarkDoneSharp } from "react-icons/io5";
import useFrameViewModel from "./view-model/UseFrameViewModel";

const COLUMNS = [
  { id: "todo", title: "A Fazer", icon: IoDocumentTextOutline, color: "border-red-400" },
  { id: "doing", title: "Fazendo", icon: PiGearBold, color: "border-yellow-400" },
  { id: "done", title: "Pronto", icon: IoCheckmarkDoneSharp, color: "border-green-400" },
];

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
            aria-describedby="kanban-description"
          >
            <div id="kanban-description" className="sr-only">
              Quadro Kanban com três colunas: A Fazer, Fazendo e Pronto.
              Você pode arrastar as tarefas entre as colunas para atualizar o status.
            </div>
            
            {COLUMNS.map((column) => (
              <Column
                key={column.id}
                id={column.id}
                title={column.title}
                icon={column.icon}
                color={column.color}
                tasks={tasks[column.id] || []}
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