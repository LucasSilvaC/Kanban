import { AiOutlineEdit, AiOutlineDelete, AiOutlinePlus } from "react-icons/ai";
import ModalTask from "../modal/modalTask/ModalTask";
import useTableManagerViewModel from "./viewModel/useTableManagerViewModel";

const TABLE_HEADERS = {
  users: ["Ações", "ID", "Nome", "E-mail"],
  tasks: ["Ações", "ID", "Usuário", "Descrição", "Setor", "Prioridade", "Status", "Data"]
};

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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const renderTableActions = (onEdit, onDelete, type) => (
    <td className="py-2 px-4 border-b flex gap-3">
      <button
        type="button"
        aria-label={`Editar ${type}`}
        title={`Editar ${type}`}
        onClick={onEdit}
        className="p-1 hover:bg-gray-100 rounded transition-colors"
      >
        <AiOutlineEdit size={20} className="text-blue-600" />
      </button>
      <button
        type="button"
        aria-label={`Excluir ${type}`}
        title={`Excluir ${type}`}
        onClick={onDelete}
        className="p-1 hover:bg-gray-100 rounded transition-colors"
      >
        <AiOutlineDelete size={20} className="text-red-600" />
      </button>
    </td>
  );

  return (
    <div className="p-6 space-y-10 max-w-[1200px] mx-auto" role="main">
      {error && (
        <div
          role="alert"
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4"
        >
          {error}
        </div>
      )}

      <section
        className="bg-white shadow-lg rounded-lg p-4"
        aria-labelledby="users-section-title"
      >
        <h2
          id="users-section-title"
          className="text-2xl font-semibold mb-4 text-gray-700"
        >
          Usuários
        </h2>
        
        {loading.users ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Carregando usuários...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table
              className="min-w-full table-auto border-collapse text-left"
              aria-label="Tabela de usuários"
            >
              <thead>
                <tr className="bg-gray-100 text-sm">
                  {TABLE_HEADERS.users.map((header, index) => (
                    <th
                      key={index}
                      className="py-2 px-4 border-b font-semibold text-gray-700"
                      scope="col"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50 transition-colors border-b"
                  >
                    {renderTableActions(
                      () => handleDeleteUser(user.id),
                      null,
                      "usuário"
                    )}
                    <td className="py-2 px-4 border-b">{user.id}</td>
                    <td className="py-2 px-4 border-b">{user.name}</td>
                    <td className="py-2 px-4 border-b">{user.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section
        className="bg-white shadow-lg rounded-lg p-4"
        aria-labelledby="tasks-section-title"
      >
        <div className="flex justify-between items-center mb-4">
          <h2
            id="tasks-section-title"
            className="text-2xl font-semibold text-gray-700"
          >
            Tarefas
          </h2>
          <button
            type="button"
            onClick={handleNewTask}
            className="flex items-center gap-2 px-3 py-1 bg-[#5f679f] text-white rounded-md hover:bg-[#4a5585] transition-colors focus:outline-none focus:ring-2 focus:ring-[#5f679f] focus:ring-offset-2"
            aria-label="Criar nova tarefa"
          >
            <AiOutlinePlus /> Nova Tarefa
          </button>
        </div>

        {loading.tasks ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Carregando tarefas...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table
              className="min-w-full table-auto border-collapse text-left"
              aria-label="Tabela de tarefas"
            >
              <thead>
                <tr className="bg-gray-100 text-sm">
                  {TABLE_HEADERS.tasks.map((header, index) => (
                    <th
                      key={index}
                      className="py-2 px-4 border-b font-semibold text-gray-700"
                      scope="col"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr
                    key={task.id}
                    className="hover:bg-gray-50 transition-colors border-b"
                  >
                    {renderTableActions(
                      () => handleEditTask(task),
                      () => handleDeleteTask(task.id),
                      "tarefa"
                    )}
                    <td className="py-2 px-4 border-b">{task.id}</td>
                    <td className="py-2 px-4 border-b">{task.user_name || task.user}</td>
                    <td className="py-2 px-4 border-b">{task.description}</td>
                    <td className="py-2 px-4 border-b">{task.sector_name}</td>
                    <td className="py-2 px-4 border-b">{task.priority}</td>
                    <td className="py-2 px-4 border-b">{task.status}</td>
                    <td className="py-2 px-4 border-b">
                      {formatDate(task.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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