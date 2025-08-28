import { useEffect, useState } from "react";
import axios from "axios";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import ModalTask from "../modal/modalTask/ModalTask";

export default function TableManager() {
    const [users, setUsers] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [loadingTasks, setLoadingTasks] = useState(false);
    const [error, setError] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [currentTask, setCurrentTask] = useState(null); 

    useEffect(() => {
        fetchUsers();
        fetchTasks();
    }, []);

    const fetchUsers = async () => {
        setLoadingUsers(true);
        try {
            const res = await axios.get("http://localhost:8000/api/usuarios/");
            setUsers(res.data);
        } catch (err) {
            console.error("Erro ao buscar usuários:", err);
            setError("Erro ao buscar usuários");
        } finally {
            setLoadingUsers(false);
        }
    };

    const fetchTasks = async () => {
        setLoadingTasks(true);
        try {
            const res = await axios.get("http://localhost:8000/api/tasks/");
            setTasks(res.data);
        } catch (err) {
            console.error("Erro ao buscar tarefas:", err);
            setError("Erro ao buscar tarefas");
        } finally {
            setLoadingTasks(false);
        }
    };

    const handleEditTask = (task) => {
        setCurrentTask(task);
        setShowModal(true); // Abre a modal para editar a tarefa
    };

    const handleDeleteTask = async (taskId) => {
        const confirmDelete = window.confirm("Deseja realmente excluir esta tarefa?");
        if (!confirmDelete) return;

        try {
            await axios.delete(`http://localhost:8000/api/tasks/${taskId}/`);
            alert("Tarefa excluída com sucesso!");
            fetchTasks(); // Recarrega as tarefas após a exclusão
        } catch (err) {
            console.error("Erro ao excluir a tarefa:", err);
            setError("Erro ao excluir a tarefa");
        }
    };

    const handleDeleteUser = async (userId) => {
        const confirmDelete = window.confirm("Deseja realmente excluir este usuário?");
        if (!confirmDelete) return;

        try {
            await axios.delete(`http://localhost:8000/api/usuarios/${userId}/`);
            alert("Usuário excluído com sucesso!");
            fetchUsers(); // Recarrega os usuários após a exclusão
        } catch (err) {
            console.error("Erro ao excluir o usuário:", err);
            setError("Erro ao excluir o usuário");
        }
    };

    return (
        <div className="p-6 space-y-10 max-w-[1200px] mx-auto">
            {error && <p className="text-red-500">{error}</p>}

            <section className="bg-white shadow-lg rounded-lg p-4">
                <h2 className="text-2xl font-semibold mb-4 text-gray-700">Usuários</h2>
                {loadingUsers ? (
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
                                        <button className="text-black hover:text-gray-700"><AiOutlineEdit size={20} /></button>
                                        <button className="text-black hover:text-gray-700" onClick={() => handleDeleteUser(user.id)}><AiOutlineDelete size={20} /></button>
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
                <h2 className="text-2xl font-semibold mb-4 text-gray-700">Tarefas</h2>
                {loadingTasks ? (
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
                                        <button className="text-black hover:text-gray-700" onClick={() => handleEditTask(task)}><AiOutlineEdit size={20} /></button>
                                        <button className="text-black hover:text-gray-700" onClick={() => handleDeleteTask(task.id)}><AiOutlineDelete size={20} /></button>
                                    </td>
                                    <td className="py-2 px-4 border-b">{task.id}</td>
                                    <td className="py-2 px-4 border-b">{task.user_name || task.user}</td>
                                    <td className="py-2 px-4 border-b">{task.description}</td>
                                    <td className="py-2 px-4 border-b">{task.sector_name}</td>
                                    <td className="py-2 px-4 border-b">{task.priority}</td>
                                    <td className="py-2 px-4 border-b">{task.status}</td>
                                    <td className="py-2 px-4 border-b">{new Date(task.created_at).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </section>

            {/* Modal de Edição de Tarefa */}
            {showModal && (
                <ModalTask
                    onClose={() => setShowModal(false)}
                    users={users}
                    task={currentTask}
                    refreshTasks={fetchTasks}
                />
            )}
        </div>
    );
}
