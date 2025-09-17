import { AiOutlineClose } from "react-icons/ai";
import { createPortal } from "react-dom";
import useModalRegisterViewModel from "./viewmodels/useModalRegisterViewModel";

export default function ModalRegister({ refreshUsers, onClose }) {
  const { modalRef, name, setName, email, setEmail, loading, error, handleSubmit } =
    useModalRegisterViewModel({ refreshUsers, onClose });

  return createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
      aria-modal="true"
      role="dialog"
      aria-label="Cadastro de Usuário"
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
          Cadastro de Usuário
        </h1>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <label className="text-xl">Nome</label>
          <input
            type="text"
            placeholder="Insira o seu nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-[#5f679f]"
            required
            aria-label="Nome do usuário"
          />
          <label className="text-xl">Email</label>
          <input
            type="email"
            placeholder="Insira o seu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-[#5f679f]"
            required
            aria-label="Email do usuário"
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
    </div>,
    document.body
  );
}