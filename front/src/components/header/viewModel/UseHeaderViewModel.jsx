import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function HeaderViewModel() {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [users, setUsers] = useState([]);

  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/usuarios/");
      setUsers(response.data);
    } catch (err) {
      console.error("Erro ao buscar usuários:", err);
    }
  };

  useEffect(() => {
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

  return {
    modalOpen,
    activeModal,
    users,
    openModal,
    closeModal,
    handleManageTasks,
    fetchUsers
  };
}