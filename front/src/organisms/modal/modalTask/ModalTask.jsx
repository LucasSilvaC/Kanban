import { createPortal } from "react-dom";
import { AiOutlineClose } from "react-icons/ai";
import useModalTaskViewModel from "./viewmodels/useModalTaskViewModel";

export default function ModalTask({ onClose, users = [], task = null, refreshTasks }) {
  const {
    modalRef,
    userId, setUserId,
    description, setDescription,
    sectorName, setSectorName,
    priority, setPriority,
    loading,
    error,
    errors,
    handleSubmit,
    handleDelete,
  } = useModalTaskViewModel({ task, users, refreshTasks, onClose });

  const modalContent = (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 z-[9999]"
      aria-modal="true"
      role="dialog"
      aria-label={task ? "Editar Tarefa" : "Cadastro de Tarefa"}
      style={{ touchAction: "none" }}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative"
        role="document"
        style={{ touchAction: "auto" }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          tabIndex={0}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5f679f] rounded"
        >
          <AiOutlineClose size={24} />
        </button>

        <h1 className="text-2xl font-bold mb-6" style={{ color: "var(--color-plura-blue-50)" }}>
          {task ? "Editar Tarefa" : "Cadastro de Tarefa"}
        </h1>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <label className="text-xl">Usuário</label>
          <select
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-[#5f679f]"
            aria-label="Selecionar usuário"
          >
            <option value="">Selecione o usuário</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} &lt;{user.email}&gt;
              </option>
            ))}
          </select>

          <label className="text-xl">Descrição</label>
          <input
            type="text"
            placeholder="Descrição da tarefa"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-[#5f679f]"
            aria-label="Descrição da tarefa"
          />

          <label className="text-xl">Setor</label>
          <input
            type="text"
            placeholder="Digite o seu setor"
            value={sectorName}
            onChange={(e) => setSectorName(e.target.value)}
            className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-[#5f679f]"
            aria-label="Setor"
          />

          <label className="text-xl">Prioridade</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-[#5f679f]"
            aria-label="Prioridade"
          >
            <option value="">Selecione a prioridade</option>
            <option value="LOW">Baixa</option>
            <option value="MED">Média</option>
            <option value="HIGH">Alta</option>
          </select>

          {error && <span className="text-red-500 text-sm">{error}</span>}

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
            <ul className="text-[#D85F5F] text-sm list-disc pl-5">
              {errors.map((msg, idx) => (
                <li key={idx}>{msg}</li>
              ))}
            </ul>
          )}
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}