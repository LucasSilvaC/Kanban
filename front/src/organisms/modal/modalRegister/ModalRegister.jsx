import { AiOutlineClose } from "react-icons/ai";
import { createPortal } from "react-dom";
import useModalRegisterViewModel from "./view-model/useModalRegisterViewModel";

export default function ModalRegister({ refreshUsers, onClose }) {
  const { 
    modalRef, 
    name, 
    setName, 
    email, 
    setEmail, 
    loading, 
    error, 
    nameError, 
    emailError, 
    handleSubmit 
  } = useModalRegisterViewModel({ refreshUsers, onClose });

  return createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 backdrop-blur-sm"
      aria-modal="true"
      role="dialog"
      aria-label="Cadastro de Usuário"
      style={{ touchAction: "none" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-xl shadow-2xl w-full max-w-md p-8 relative m-4 transform transition-all"
        role="document"
        style={{ 
          touchAction: "auto",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
        }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          tabIndex={0}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#5f679f] rounded-full p-1 transition-colors"
        >
          <AiOutlineClose size={24} />
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Cadastro de Usuário
          </h1>
          <p className="text-gray-600">
            Preencha os campos abaixo para criar uma nova conta
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Nome completo
            </label>
            <input
              id="name"
              type="text"
              placeholder="Digite seu nome completo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5f679f] focus:border-transparent transition-all ${
                nameError 
                  ? 'border-red-500 bg-red-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              required
              aria-label="Nome do usuário"
              aria-describedby="name-error"
            />
            {nameError && (
              <p id="name-error" className="mt-1 text-sm text-red-600 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {nameError}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Endereço de e-mail
            </label>
            <input
              id="email"
              type="email"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5f679f] focus:border-transparent transition-all ${
                emailError 
                  ? 'border-red-500 bg-red-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              required
              aria-label="Email do usuário"
              aria-describedby="email-error"
            />
            {emailError && (
              <p id="email-error" className="mt-1 text-sm text-red-600 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {emailError}
              </p>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-red-800 font-medium">{error}</p>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#5f679f] hover:bg-[#4a5585] text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[#5f679f] focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
          >
            <div className="flex items-center justify-center">
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Cadastrando...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  Cadastrar Usuário
                </>
              )}
            </div>
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={onClose}
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}