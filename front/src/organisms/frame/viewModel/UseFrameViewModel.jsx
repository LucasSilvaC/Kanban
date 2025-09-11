import { useEffect, useState } from "react";
import axios from "axios";

export default function useFrameViewModel() {
  const [tasks, setTasks] = useState({ todo: [], doing: [], done: [] });
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [users, setUsers] = useState([]);

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
    fetchUsers();
  }, []);

  const onDragEnd = async (result) => {
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

      try {
        const res = await axios.patch(`http://localhost:8000/api/tasks/${moved.id}/`, {
          status: destination.droppableId.toUpperCase(),
        });
        setTasks((prev) => {
          const updatedTask = res.data;
          return {
            ...prev,
            [destination.droppableId]: prev[destination.droppableId].map(t =>
              t.id === updatedTask.id ? updatedTask : t
            ),
          };
        });
      } catch (err) {
        console.error("Erro ao atualizar status:", err);
      }
    }
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    fetchTasks().finally(() => {
      setModalOpen(false);
      setSelectedTask(null);
    });
  };

  return {
    tasks,
    users,
    modalOpen,
    selectedTask,
    fetchTasks,
    onDragEnd,
    handleEditTask,
    handleCloseModal,
  };
}