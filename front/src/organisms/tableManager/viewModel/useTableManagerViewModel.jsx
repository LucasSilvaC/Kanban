import { useEffect, useState } from "react";
import axios from "axios";

export default function useTableManagerViewModel() {
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState({ users: false, tasks: false });
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);

  const fetchUsers = async () => {
    setLoading((prev) => ({ ...prev, users: true }));
    try {
      const res = await axios.get("http://localhost:8000/api/usuarios/");
      setUsers(res.data);
      setError("");
    } catch (err) {
      console.error("Erro ao buscar usuários:", err);
      setError("Erro ao buscar usuários");
    } finally {
      setLoading((prev) => ({ ...prev, users: false }));
    }
  };

  const fetchTasks = async () => {
    setLoading((prev) => ({ ...prev, tasks: true }));
    try {
      const res = await axios.get("http://localhost:8000/api/tasks/");
      setTasks(res.data);
      setError("");
    } catch (err) {
      console.error("Erro ao buscar tarefas:", err);
      setError("Erro ao buscar tarefas");
    } finally {
      setLoading((prev) => ({ ...prev, tasks: false }));
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchTasks();
  }, []);

  const handleEditTask = (task) => {
    setCurrentTask(task);
    setShowModal(true);
  };

  const handleNewTask = () => {
    setCurrentTask(null);
    setShowModal(true);
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Deseja realmente excluir esta tarefa?")) return;
    try {
      await axios.delete(`http://localhost:8000/api/tasks/${taskId}/`);
      fetchTasks();
    } catch (err) {
      console.error("Erro ao excluir a tarefa:", err);
      setError("Erro ao excluir a tarefa");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Deseja realmente excluir este usuário?")) return;
    try {
      await axios.delete(`http://localhost:8000/api/usuarios/${userId}/`);
      fetchUsers();
    } catch (err) {
      console.error("Erro ao excluir o usuário:", err);
      setError("Erro ao excluir o usuário");
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentTask(null);
    fetchTasks();
  };

  return {
    users,
    tasks,
    loading,
    error,
    showModal,
    currentTask,
    fetchUsers,
    fetchTasks,
    handleEditTask,
    handleNewTask,
    handleDeleteTask,
    handleDeleteUser,
    closeModal,
  };
}