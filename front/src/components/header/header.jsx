import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // import do navigate
import axios from "axios";
import ModalRegister from "../../organisms/modal/modalRegister/ModalRegister";
import ModalTask from "../../organisms/modal/modalTask/ModalTask";

export default function Header() {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null); 
  const [users, setUsers] = useState([]);

  const navigate = useNavigate(); // hook do react-router

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/usuarios/");
        setUsers(response.data); 
      } catch (err) {
        console.error("Erro ao buscar usuários:", err);
      }
    };
    fetchUsers();
  }, []);

  const openModal = (modal) => {
    setActiveModal(modal);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setActiveModal(null);
  };

  const handleManageTasks = () => {
    navigate("/table-views"); 
  };

  return (
    <>
      <header className="bg-[#5f679f] text-white px-6 py-4 shadow-md flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gerenciamento de tarefas</h1>
        <nav>
          <ul className="flex space-x-7 text-lg">
            <li
              className="hover:underline cursor-pointer transition-transform duration-200 hover:-translate-y-1"
              onClick={() => openModal("registerUser")}
            >
              Cadastro de usuário
            </li>
            <li
              className="hover:underline cursor-pointer transition-transform duration-200 hover:-translate-y-1"
              onClick={() => openModal("task")}
            >
              Cadastro de tarefas
            </li>
            <li
              className="hover:underline cursor-pointer transition-transform duration-200 hover:-translate-y-1"
              onClick={handleManageTasks} 
            >
              Gerenciar tarefas
            </li>
          </ul>
        </nav>
      </header>

      {modalOpen && activeModal === "registerUser" && <ModalRegister onClose={closeModal} />}
      {modalOpen && activeModal === "task" && <ModalTask onClose={closeModal} users={users} />}
    </>
  );
}