import { AiOutlineClose } from "react-icons/ai";
import { createPortal } from "react-dom";
import useModalTaskViewModel from "./view-model/useModalTaskViewModel";

export default function ModalTask({ onClose, users, task, refreshTasks }) {
  const { 
    modalRef, 
    userId, 
    setUserId, 
    description, 
    setDescription, 
    sectorName, 
    setSectorName, 
    priority, 
    setPriority, 
    loading, 
    error, 
    errors, 
    handleSubmit, 
    handleDelete 
  } = useModalTaskViewModel({ onClose, users, task, refreshTasks });

  const isEditMode = !!task;

  return createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 backdrop-blur-sm"
      aria-modal="true"
      role="dialog"
      aria-label={isEditMode ? "Editar Tarefa" : "Cadastro de Tarefa"}
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
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
            isEditMode ? 'bg-orange-500' : 'bg-green-500'
          }`}>
            {isEditMode ? (
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            ) : (
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            )}
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {isEditMode ? "Editar Tarefa" : "Cadastro de Tarefa"}
          </h1>
          <p className="text-gray-600">
            {isEditMode ? "Modifique os campos abaixo" : "Preencha os campos para criar uma nova tarefa"}
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {!isEditMode && (
            <div>
              <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-2">
                Responsável
              </label>
              <select
                id="userId"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5f679f] focus:border-transparent transition-all ${
                  errors.includes('userId') 
                    ? 'border-red-500 bg-red-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                required
                aria-label="Selecione o responsável"
                aria-describedby="userId-error"
              >
                <option value="">Selecione um responsável</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
              {errors.includes('userId') && (
                <p id="userId-error" className="mt-1 text-sm text-red-600 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Campo obrigatório
                </p>
              )}
            </div>
          )}

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Descrição da tarefa
            </label>
            <textarea
              id="description"
              placeholder={isEditMode ? "Descrição da tarefa" : "Digite a descrição da tarefa"}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5f679f] focus:border-transparent transition-all resize-none ${
                errors.includes('description') 
                  ? 'border-red-500 bg-red-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              required
              aria-label="Descrição da tarefa"
              aria-describedby="description-error"
              disabled={isEditMode}
            />
            {errors.includes('description') && (
              <p id="description-error" className="mt-1 text-sm text-red-600 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Campo obrigatório
              </p>
            )}
          </div>

          {!isEditMode && (
            <div>
              <label htmlFor="sectorName" className="block text-sm font-medium text-gray-700 mb-2">
                Setor
              </label>
              <input
                id="sectorName"
                type="text"
                placeholder="Digite o setor"
                value={sectorName}
                onChange={(e) => setSectorName(e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5f679f] focus:border-transparent transition-all ${
                  errors.includes('sectorName') 
                    ? 'border-red-500 bg-red-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                required
                aria-label="Setor da tarefa"
                aria-describedby="sectorName-error"
              />
              {errors.includes('sectorName') && (
                <p id="sectorName-error" className="mt-1 text-sm text-red-600 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Campo obrigatório
                </p>
              )}
            </div>
          )}

          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
              Prioridade
            </label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5f679f] focus:border-transparent transition-all ${
                errors.includes('priority') 
                  ? 'border-red-500 bg-red-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              required
              aria-label="Prioridade da tarefa"
              aria-describedby="priority-error"
            >
              <option value="">Selecione a prioridade</option>
              <option value="LOW">Baixa</option>
              <option value="MEDIUM">Média</option>
              <option value="HIGH">Alta</option>
            </select>
            {errors.includes('priority') && (
              <p id="priority-error" className="mt-1 text-sm text-red-600 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Campo obrigatório
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

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#5f679f] hover:bg-[#4a5585] text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[#5f679f] focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
            >
              <div className="flex items-center justify-center">
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Salvando...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {isEditMode ? "Atualizar" : "Cadastrar"}
                  </>
                )}
              </div>
            </button>

            {isEditMode && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={loading}
                className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
              >
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Excluir
                </div>
              </button>
            )}
          </div>
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