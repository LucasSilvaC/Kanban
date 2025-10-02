import { Link } from "react-router-dom";
import ModalRegister from "../../organisms/modal/modalRegister/ModalRegister";
import ModalTask from "../../organisms/modal/modalTask/ModalTask";
import HeaderViewModel from "./view-model/UseHeaderViewModel";

export default function Header() {
  const {
    modalOpen,
    activeModal,
    users,
    openModal,
    closeModal,
    handleManageTasks,
    fetchUsers
  } = HeaderViewModel();

  return (
    <>
      <header
        className="bg-[#5f679f] text-white px-6 py-4 shadow-md flex justify-between items-center"
        role="banner"
      >
        <h1 className="text-2xl font-bold">
          <Link
            to="/"
            aria-label="Ir para a página inicial de gerenciamento de tarefas"
            className="cursor-pointer hover:underline focus:outline-none focus:ring-2 focus:ring-white rounded"
          >
            Gerenciamento de tarefas
          </Link>
        </h1>

        <nav aria-label="Menu principal">
          <ul className="flex space-x-7 text-lg" role="menubar">
            <li role="none">
              <button
                type="button"
                role="menuitem"
                tabIndex={0}
                aria-label="Abrir cadastro de usuário"
                className="hover:underline cursor-pointer transition-transform duration-200 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-white rounded"
                onClick={() => openModal("registerUser")}
              >
                Cadastro de usuário
              </button>
            </li>
            <li role="none">
              <button
                type="button"
                role="menuitem"
                tabIndex={0}
                aria-label="Abrir cadastro de tarefas"
                className="hover:underline cursor-pointer transition-transform duration-200 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-white rounded"
                onClick={() => openModal("task")}
              >
                Cadastro de tarefas
              </button>
            </li>
            <li role="none">
              <button
                type="button"
                role="menuitem"
                tabIndex={0}
                aria-label="Ir para gerenciamento de tarefas"
                className="hover:underline cursor-pointer transition-transform duration-200 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-white rounded"
                onClick={handleManageTasks}
              >
                Gerenciar tarefas
              </button>
            </li>
          </ul>
        </nav>
      </header>

      {modalOpen && activeModal === "registerUser" && (
        <ModalRegister onClose={closeModal} refreshUsers={fetchUsers} />
      )}
      {modalOpen && activeModal === "task" && (
        <ModalTask onClose={closeModal} users={users} />
      )}
    </>
  );
}