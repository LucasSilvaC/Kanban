import { AiOutlineEdit, AiOutlineDelete, AiOutlinePlus } from "react-icons/ai";
import ModalTask from "../modal/modalTask/ModalTask";
import useTableManagerViewModel from "./viewModel/useTableManagerViewModel";

export default function TableManager() {
  const {
    users,
    tasks,
    loading,
    error,
    showModal,
    currentTask,
    handleEditTask,
    handleNewTask,
    handleDeleteTask,
    handleDeleteUser,
    closeModal,
    fetchTasks,
  } = useTableManagerViewModel();

  return (
    <div className="p-6 space-y-10 max-w-[1200px] mx-auto">
      {error && <p className="text-red-500">{error}</p>}

      <section className="bg-white shadow-lg rounded-lg p-4">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Usuários</h2>
        {loading.users ? (
          <p>Carregando usuários...</p>
        ) : (
          <table className="min-w-full table-auto border-collapse text-left">
            <thead>
              <tr className="bg-gray-100 text-sm">
                <th className="py-2 px-4 border-b">Ações</th>
                <th className="py-2 px-4 border-b">ID</th>
                <th className="py-2 px-4 border-b">Nome</th>
                <th className="py-2 px-4 border-b">E-mail</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-2 px-4 border-b flex gap-3">
                    <button title="Editar Usuário">
                      <AiOutlineEdit size={20} />
                    </button>
                    <button title="Excluir Usuário" onClick={() => handleDeleteUser(user.id)}>
                      <AiOutlineDelete size={20} />
                    </button>
                  </td>
                  <td className="py-2 px-4 border-b">{user.id}</td>
                  <td className="py-2 px-4 border-b">{user.name}</td>
                  <td className="py-2 px-4 border-b">{user.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section className="bg-white shadow-lg rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-700">Tarefas</h2>
          <button
            onClick={handleNewTask}
            className="flex items-center gap-2 px-3 py-1 bg-[#5f679f] text-white rounded-md hover:bg-[#4a5585] transition"
          >
            <AiOutlinePlus /> Nova Tarefa
          </button>
        </div>

        {loading.tasks ? (
          <p>Carregando tarefas...</p>
        ) : (
          <table className="min-w-full table-auto border-collapse text-left">
            <thead>
              <tr className="bg-gray-100 text-sm">
                <th className="py-2 px-4 border-b">Ações</th>
                <th className="py-2 px-4 border-b">ID</th>
                <th className="py-2 px-4 border-b">Usuário</th>
                <th className="py-2 px-4 border-b">Descrição</th>
                <th className="py-2 px-4 border-b">Setor</th>
                <th className="py-2 px-4 border-b">Prioridade</th>
                <th className="py-2 px-4 border-b">Status</th>
                <th className="py-2 px-4 border-b">Data</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-2 px-4 border-b flex gap-3">
                    <button title="Editar Tarefa" onClick={() => handleEditTask(task)}>
                      <AiOutlineEdit size={20} />
                    </button>
                    <button title="Excluir Tarefa" onClick={() => handleDeleteTask(task.id)}>
                      <AiOutlineDelete size={20} />
                    </button>
                  </td>
                  <td className="py-2 px-4 border-b">{task.id}</td>
                  <td className="py-2 px-4 border-b">{task.user_name || task.user}</td>
                  <td className="py-2 px-4 border-b">{task.description}</td>
                  <td className="py-2 px-4 border-b">{task.sector_name}</td>
                  <td className="py-2 px-4 border-b">{task.priority}</td>
                  <td className="py-2 px-4 border-b">{task.status}</td>
                  <td className="py-2 px-4 border-b">
                    {new Date(task.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {showModal && (
        <ModalTask
          onClose={closeModal}
          users={users}
          task={currentTask}
          refreshTasks={fetchTasks}
        />
      )}
    </div>
  );
}