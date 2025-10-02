import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { z } from "zod";

const taskSchema = z.object({
  userId: z.string().min(1, "Selecione o usuário"),
  description: z.string().min(5, "Descrição deve ter no mínimo 5 caracteres"),
  sectorName: z
    .string()
    .min(1, "Setor é obrigatório")
    .regex(/^[\p{L}\s-]+$/u, "Setor deve conter apenas letras, espaços e hífens"),
  priority: z.enum(["LOW", "MED", "HIGH"], { message: "Selecione a prioridade" }),
  status: z.enum(["TODO", "DOING", "DONE"], { message: "Selecione o status" }),
});

export default function useModalTaskViewModel({ task = null, users = [], refreshTasks, onClose }) {
  const [userId, setUserId] = useState("");
  const [description, setDescription] = useState("");
  const [sectorName, setSectorName] = useState("");
  const [priority, setPriority] = useState("");
  const [status, setStatus] = useState("TODO");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState([]);

  const modalRef = useRef(null);

  useEffect(() => {
    if (task) {
      setUserId(task.user ? String(task.user) : "");
      setDescription(task.description || "");
      setSectorName(task.sector_name || "");
      setPriority(task.priority || "");
      setStatus(task.status || "TODO");
    } else {
      setUserId("");
      setDescription("");
      setSectorName("");
      setPriority("");
      setStatus("TODO");
    }
  }, [task]);


  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    const blockEvent = (e) => {
      if (modalRef.current && modalRef.current.contains(e.target)) return;
      if (typeof e.stopImmediatePropagation === "function") e.stopImmediatePropagation();
      else e.stopPropagation();
      if (typeof e.preventDefault === "function") e.preventDefault();
      return false;
    };

    const opts = { capture: true, passive: false };

    const events = ["pointerdown", "pointermove", "mousedown", "mousemove", "touchstart", "dragstart"];
    events.forEach(ev => document.addEventListener(ev, blockEvent, opts));
    return () => events.forEach(ev => document.removeEventListener(ev, blockEvent, opts));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setErrors([]);

    const validation = taskSchema.safeParse({
      userId: String(userId),
      description,
      sectorName,
      priority,
      status: "TODO",
    });

    if (!validation.success) {
      const msgs = validation.error?.issues.map((it) => it.message) || ["Dados inválidos"];
      setErrors(msgs);
      setLoading(false);
      return;
    }

    try {
      const taskData = {
        user: userId,
        description,
        sector_name: sectorName,
        priority,
        status: "TODO",
      };

      if (task) {
        await axios.patch(`http://localhost:8000/api/tasks/${task.id}/`, taskData);
        alert("Tarefa atualizada com sucesso!");
      } else {
        await axios.post("http://localhost:8000/api/tasks/", taskData);
        alert("Tarefa cadastrada com sucesso!");
      }

      if (task) {
        await axios.patch(`http://localhost:8000/api/tasks/${task.id}/`, taskData);
        alert("Tarefa atualizada com sucesso!");
      } else {
        await axios.post("http://localhost:8000/api/tasks/", taskData);
        alert("Tarefa cadastrada com sucesso!");
      }

      if (refreshTasks) {
        refreshTasks();
      }
      onClose();
    } catch (err) {
      console.error(err);
      if (err.response) {
        setError("Erro ao salvar a tarefa: " + (err.response.data.message || "Erro desconhecido."));
      } else if (err.request) {
        setError("Erro de rede: Não foi possível se conectar ao servidor.");
      } else {
        setError("Erro ao salvar a tarefa. Verifique os dados e tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!task) return;
    const confirmDelete = window.confirm("Deseja realmente excluir esta tarefa?");
    if (!confirmDelete) return;

    try {
      setLoading(true);
      await axios.delete(`http://localhost:8000/api/tasks/${task.id}/`);
      alert("Tarefa excluída com sucesso!");
      if (refreshTasks) {
        refreshTasks();
      }
      onClose();
    } catch (err) {
      console.error(err);
      setError("Erro ao excluir a tarefa.");
    } finally {
      setLoading(false);
    }
  };


  return {
    modalRef,
    userId, setUserId,
    description, setDescription,
    sectorName, setSectorName,
    priority, setPriority,
    status, setStatus,
    loading,
    error,
    errors,
    handleSubmit,
    handleDelete,
  };
}