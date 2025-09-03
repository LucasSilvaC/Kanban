import { useEffect, useState } from "react";
import axios from "axios";
import { DragDropContext } from "@hello-pangea/dnd";
import Column from "../../components/column/Column";
import ModalTask from "../modal/modalTask/ModalTask";
import { IoDocumentTextOutline } from "react-icons/io5";
import { PiGearBold } from "react-icons/pi";
import { IoCheckmarkDoneSharp } from "react-icons/io5";

export default function Frame() {
  const [tasks, setTasks] = useState({ todo: [], doing: [], done: [] });
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [users, setUsers] = useState([]);
  const [reloadFlag, setReloadFlag] = useState(false); 

  const fetchTasks = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/tasks/");
      const allTasks = res.data;

      setTasks({
        todo: allTasks.filter((t) => t.status === "TODO"),
        doing: allTasks.filter((t) => t.status === "DOING"),
        done: allTasks.filter((t) => t.status === "DONE"),
      });
    } catch (error) {
      console.error("Erro ao buscar tarefas:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/usuarios/");
      setUsers(res.data);
    } catch (err) {
      console.error("Erro ao buscar usuários:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [reloadFlag]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceCol = Array.from(tasks[source.droppableId]);
    const destCol = Array.from(tasks[destination.droppableId]);
    const [moved] = sourceCol.splice(source.index, 1);

    if (source.droppableId === destination.droppableId) {
      sourceCol.splice(destination.index, 0, moved);
      setTasks((prev) => ({ ...prev, [source.droppableId]: sourceCol }));
    } else {
      destCol.splice(destination.index, 0, moved);
      setTasks((prev) => ({
        ...prev,
        [source.droppableId]: sourceCol,
        [destination.droppableId]: destCol,
      }));

      axios
        .patch(`http://localhost:8000/api/tasks/${moved.id}/`, {
          status: destination.droppableId.toUpperCase(),
        })
        .then(() => setReloadFlag((prev) => !prev)) 
        .catch((err) => console.error("Erro ao atualizar status:", err));
    }
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedTask(null);
    setReloadFlag((prev) => !prev); 
  };

  const columns = [
    { id: "todo", title: "A Fazer", icon: IoDocumentTextOutline, color: "border-yellow-500" },
    { id: "doing", title: "Fazendo", icon: PiGearBold, color: "border-blue-500" },
    { id: "done", title: "Pronto", icon: IoCheckmarkDoneSharp, color: "border-green-500" },
  ];

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <main className="flex-1 p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
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
            />
          ))}
        </main>
      </DragDropContext>

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