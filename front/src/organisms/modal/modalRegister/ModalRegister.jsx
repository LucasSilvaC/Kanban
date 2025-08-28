import { useState } from "react";
import axios from "axios";
import { AiOutlineClose } from "react-icons/ai";

export default function ModalRegister({ onClose }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await axios.post("http://localhost:8000/api/usuarios/", {
        name,
        email,
      });
      alert("Usuário cadastrado com sucesso!");
      setName("");
      setEmail("");
      onClose();
    } catch (err) {
      console.error(err);
      setError("Erro ao cadastrar usuário. Verifique os dados e tente novamente.");
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

        <h1
          className="text-2xl font-bold mb-6"
          style={{ color: "var(--color-plura-blue-50)" }}
        >
          Cadastro de Usuário
        </h1>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-[#5f679f]"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-[#5f679f]"
            required
          />
          {error && <span className="text-red-500 text-sm">{error}</span>}
          <button
            type="submit"
            disabled={loading}
            className="bg-[#5f679f] hover:bg-[#4a5585] text-white font-semibold rounded p-2 mt-2 transition-colors cursor-pointer disabled:opacity-50"
          >
            {loading ? "Cadastrando..." : "Cadastrar"}
          </button>
        </form>
      </div>
    </div>
  );
}