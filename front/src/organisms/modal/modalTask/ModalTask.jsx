import { useState, useEffect } from "react";
import axios from "axios";
import { AiOutlineClose } from "react-icons/ai";
import { z } from "zod";

const taskSchema = z.object({
  userId: z.string().min(1, "Selecione o usuário"),
  description: z.string().min(1, "Descrição é obrigatória"),
  sectorName: z.string().min(1, "Setor é obrigatório"),
  priority: z.string().refine((val) => ["LOW", "MED", "HIGH"].includes(val), {
    message: "Selecione a prioridade",
  }),
  status: z.string().refine((val) => ["TODO", "DOING", "DONE"].includes(val), {
    message: "Selecione o status",
  }),
});

export default function ModalTask({ onClose, users = [], task = null, refreshTasks }) {
  const [userId, setUserId] = useState("");
  const [description, setDescription] = useState("");
  const [sectorName, setSectorName] = useState("");
  const [priority, setPriority] = useState("");
  const [status, setStatus] = useState("TODO");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    if (task) {
      setUserId(task.user || "");
      setDescription(task.description || "");
      setSectorName(task.sector_name || "");
      setPriority(task.priority || "");
      setStatus(task.status || "TODO");
    }
  }, [task]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setErrors([]);

    const validation = taskSchema.safeParse({
      userId,
      description,
      sectorName,
      priority,
      status,
    });

    try {
      if (task) {
        await axios.patch(`http://localhost:8000/api/tasks/${task.id}/`, {
          user: userId,
          description,
          sector_name: sectorName,
          priority,
          status,
        });
        alert("Tarefa atualizada com sucesso!");
      } else {
        await axios.post("http://localhost:8000/api/tasks/", {
          user: userId,
          description,
          sector_name: sectorName,
          priority,
          status,
        });
        alert("Tarefa cadastrada com sucesso!");
      }

      refreshTasks?.();
      onClose();
    } catch (err) {
      console.error(err);
      setError("Erro ao salvar a tarefa.");
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
      refreshTasks?.();
      onClose();
    } catch (err) {
      console.error(err);
      setError("Erro ao excluir a tarefa.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
        <AiOutlineClose
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 cursor-pointer"
          size={24}
          onClick={onClose}
        />

        <h1 className="text-2xl font-bold mb-6" style={{ color: "var(--color-plura-blue-50)" }}>
          {task ? "Editar Tarefa" : "Cadastro de Tarefa"}
        </h1>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <select
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-[#5f679f]"
          >
            <option value="">Selecione o usuário</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} &lt;{user.email}&gt;
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Descrição da tarefa"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-[#5f679f]"
          />

          <input
            type="text"
            placeholder="Setor"
            value={sectorName}
            onChange={(e) => setSectorName(e.target.value)}
            className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-[#5f679f]"
          />

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-[#5f679f]"
          >
            <option value="">Selecione a prioridade</option>
            <option value="LOW">Baixa</option>
            <option value="MED">Média</option>
            <option value="HIGH">Alta</option>
          </select>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-[#5f679f]"
          >
            <option value="TODO">A fazer</option>
            <option value="DOING">Fazendo</option>
            <option value="DONE">Pronto</option>
          </select>

          {error && <span className="text-[#D85F5F] text-sm">{error}</span>}

          <div className="flex justify-between gap-2 mt-2">
            {task && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={loading}
                className="bg-[#D85F5F] hover:bg-[#C23333] text-white font-semibold rounded cursor-pointer p-2 flex-1 transition-colors disabled:opacity-50"
              >
                Excluir
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className="bg-[#5f679f] hover:bg-[#4a5585] text-white font-semibold rounded p-2 flex-1 transition-colors disabled:opacity-50"
            >
              {loading ? "Salvando..." : task ? "Atualizar" : "Cadastrar"}
            </button>
          </div>
          {errors.length > 0 && (
            <ul className="text-[#D85F5F] text-sm">
              {errors.map((msg, idx) => (
                <li key={idx}>{msg}</li>
              ))}
            </ul>
          )}
        </form>
      </div>
    </div>
  );
}