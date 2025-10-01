import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import axios from 'axios'
import TableManager from './TableManager'

// Mock do axios
vi.mock('axios')

const mockUsers = [
  { id: 1, name: 'João Silva', email: 'joao@example.com' },
  { id: 2, name: 'Maria Santos', email: 'maria@example.com' }
]

const mockTasks = [
  { id: 1, user: 1, user_name: 'João Silva', description: 'Testar aplicativo', sector_name: 'TI', priority: 'HIGH', status: 'TODO', created_at: '2023-01-01T10:00:00Z' },
  { id: 2, user: 2, user_name: 'Maria Santos', description: 'Implementar testes', sector_name: 'TI', priority: 'MEDIUM', status: 'DOING', created_at: '2023-01-02T10:00:00Z' }
]

describe('TableManager - Validações e Testes de UI', () => {
  const mockRefreshTasks = vi.fn()
  const mockRefreshUsers = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Validação de Carregamento', () => {
    test('deve mostrar mensagem de carregamento quando loading é true', () => {
      const mockViewModel = {
        users: [],
        tasks: [],
        loading: { users: true, tasks: true },
        error: null,
        showModal: false,
        currentTask: null,
        handleEditTask: vi.fn(),
        handleNewTask: vi.fn(),
        handleDeleteTask: vi.fn(),
        handleDeleteUser: vi.fn(),
        closeModal: vi.fn(),
        fetchTasks: vi.fn(),
      }

      vi.doMock('./viewModel/useTableManagerViewModel', () => ({
        default: vi.fn(() => mockViewModel)
      }))

      render(<TableManager />)
      
      expect(screen.getByText('Carregando usuários...')).toBeInTheDocument()
      expect(screen.getByText('Carregando tarefas...')).toBeInTheDocument()
    })

    test('deve mostrar dados quando loading é false', () => {
      const mockViewModel = {
        users: mockUsers,
        tasks: mockTasks,
        loading: { users: false, tasks: false },
        error: null,
        showModal: false,
        currentTask: null,
        handleEditTask: vi.fn(),
        handleNewTask: vi.fn(),
        handleDeleteTask: vi.fn(),
        handleDeleteUser: vi.fn(),
        closeModal: vi.fn(),
        fetchTasks: vi.fn(),
      }

      vi.doMock('./viewModel/useTableManagerViewModel', () => ({
        default: vi.fn(() => mockViewModel)
      }))

      render(<TableManager />)
      
      expect(screen.getByText('João Silva')).toBeInTheDocument()
      expect(screen.getByText('Maria Santos')).toBeInTheDocument()
      expect(screen.getByText('Testar aplicativo')).toBeInTheDocument()
      expect(screen.getByText('Implementar testes')).toBeInTheDocument()
    })
  })

  describe('Validação de Erros', () => {
    test('deve mostrar mensagem de erro quando error existe', () => {
      const mockViewModel = {
        users: [],
        tasks: [],
        loading: { users: false, tasks: false },
        error: 'Erro ao carregar dados',
        showModal: false,
        currentTask: null,
        handleEditTask: vi.fn(),
        handleNewTask: vi.fn(),
        handleDeleteTask: vi.fn(),
        handleDeleteUser: vi.fn(),
        closeModal: vi.fn(),
        fetchTasks: vi.fn(),
      }

      vi.doMock('./viewModel/useTableManagerViewModel', () => ({
        default: vi.fn(() => mockViewModel)
      }))

      render(<TableManager />)
      
      expect(screen.getByRole('alert')).toHaveTextContent('Erro ao carregar dados')
    })

    test('não deve mostrar mensagem de erro quando error é null', () => {
      const mockViewModel = {
        users: mockUsers,
        tasks: mockTasks,
        loading: { users: false, tasks: false },
        error: null,
        showModal: false,
        currentTask: null,
        handleEditTask: vi.fn(),
        handleNewTask: vi.fn(),
        handleDeleteTask: vi.fn(),
        handleDeleteUser: vi.fn(),
        closeModal: vi.fn(),
        fetchTasks: vi.fn(),
      }

      vi.doMock('./viewModel/useTableManagerViewModel', () => ({
        default: vi.fn(() => mockViewModel)
      }))

      render(<TableManager />)
      
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    })
  })

  describe('Validação de Tabela de Usuários', () => {
    test('deve renderizar tabela de usuários com dados corretos', () => {
      const mockViewModel = {
        users: mockUsers,
        tasks: mockTasks,
        loading: { users: false, tasks: false },
        error: null,
        showModal: false,
        currentTask: null,
        handleEditTask: vi.fn(),
        handleNewTask: vi.fn(),
        handleDeleteTask: vi.fn(),
        handleDeleteUser: vi.fn(),
        closeModal: vi.fn(),
        fetchTasks: vi.fn(),
      }

      vi.doMock('./viewModel/useTableManagerViewModel', () => ({
        default: vi.fn(() => mockViewModel)
      }))

      render(<TableManager />)
      
      expect(screen.getByText('Usuários')).toBeInTheDocument()
      expect(screen.getByText('Ações')).toBeInTheDocument()
      expect(screen.getByText('ID')).toBeInTheDocument()
      expect(screen.getByText('Nome')).toBeInTheDocument()
      expect(screen.getByText('E-mail')).toBeInTheDocument()
      
      expect(screen.getByText('1')).toBeInTheDocument()
      expect(screen.getByText('João Silva')).toBeInTheDocument()
      expect(screen.getByText('joao@example.com')).toBeInTheDocument()
      
      expect(screen.getByText('2')).toBeInTheDocument()
      expect(screen.getByText('Maria Santos')).toBeInTheDocument()
      expect(screen.getByText('maria@example.com')).toBeInTheDocument()
    })

    test('deve chamar handleDeleteUser quando botão de excluir é clicado', () => {
      const mockHandleDeleteUser = vi.fn()
      const mockViewModel = {
        users: mockUsers,
        tasks: mockTasks,
        loading: { users: false, tasks: false },
        error: null,
        showModal: false,
        currentTask: null,
        handleEditTask: vi.fn(),
        handleNewTask: vi.fn(),
        handleDeleteTask: vi.fn(),
        handleDeleteUser: mockHandleDeleteUser,
        closeModal: vi.fn(),
        fetchTasks: vi.fn(),
      }

      vi.doMock('./viewModel/useTableManagerViewModel', () => ({
        default: vi.fn(() => mockViewModel)
      }))

      render(<TableManager />)
      
      const deleteButtons = screen.getAllByRole('button', { name: /Excluir usuário/i })
      fireEvent.click(deleteButtons[0])
      
      expect(mockHandleDeleteUser).toHaveBeenCalledWith(1)
    })
  })

  describe('Validação de Tabela de Tarefas', () => {
    test('deve renderizar tabela de tarefas com dados corretos', () => {
      const mockViewModel = {
        users: mockUsers,
        tasks: mockTasks,
        loading: { users: false, tasks: false },
        error: null,
        showModal: false,
        currentTask: null,
        handleEditTask: vi.fn(),
        handleNewTask: vi.fn(),
        handleDeleteTask: vi.fn(),
        handleDeleteUser: vi.fn(),
        closeModal: vi.fn(),
        fetchTasks: vi.fn(),
      }

      vi.doMock('./viewModel/useTableManagerViewModel', () => ({
        default: vi.fn(() => mockViewModel)
      }))

      render(<TableManager />)
      
      expect(screen.getByText('Tarefas')).toBeInTheDocument()
      expect(screen.getByText('Ações')).toBeInTheDocument()
      expect(screen.getByText('ID')).toBeInTheDocument()
      expect(screen.getByText('Usuário')).toBeInTheDocument()
      expect(screen.getByText('Descrição')).toBeInTheDocument()
      expect(screen.getByText('Setor')).toBeInTheDocument()
      expect(screen.getByText('Prioridade')).toBeInTheDocument()
      expect(screen.getByText('Status')).toBeInTheDocument()
      expect(screen.getByText('Data')).toBeInTheDocument()
      
      expect(screen.getByText('1')).toBeInTheDocument()
      expect(screen.getByText('João Silva')).toBeInTheDocument()
      expect(screen.getByText('Testar aplicativo')).toBeInTheDocument()
      expect(screen.getByText('TI')).toBeInTheDocument()
      expect(screen.getByText('HIGH')).toBeInTheDocument()
      expect(screen.getByText('TODO')).toBeInTheDocument()
      expect(screen.getByText('01/01/2023 10:00:00')).toBeInTheDocument()
    })

    test('deve chamar handleEditTask quando botão de editar é clicado', () => {
      const mockHandleEditTask = vi.fn()
      const mockViewModel = {
        users: mockUsers,
        tasks: mockTasks,
        loading: { users: false, tasks: false },
        error: null,
        showModal: false,
        currentTask: null,
        handleEditTask: mockHandleEditTask,
        handleNewTask: vi.fn(),
        handleDeleteTask: vi.fn(),
        handleDeleteUser: vi.fn(),
        closeModal: vi.fn(),
        fetchTasks: vi.fn(),
      }

      vi.doMock('./viewModel/useTableManagerViewModel', () => ({
        default: vi.fn(() => mockViewModel)
      }))

      render(<TableManager />)
      
      const editButtons = screen.getAllByRole('button', { name: /Editar tarefa/i })
      fireEvent.click(editButtons[0])
      
      expect(mockHandleEditTask).toHaveBeenCalledWith(mockTasks[0])
    })

    test('deve chamar handleDeleteTask quando botão de excluir é clicado', () => {
      const mockHandleDeleteTask = vi.fn()
      const mockViewModel = {
        users: mockUsers,
        tasks: mockTasks,
        loading: { users: false, tasks: false },
        error: null,
        showModal: false,
        currentTask: null,
        handleEditTask: vi.fn(),
        handleNewTask: vi.fn(),
        handleDeleteTask: mockHandleDeleteTask,
        handleDeleteUser: vi.fn(),
        closeModal: vi.fn(),
        fetchTasks: vi.fn(),
      }

      vi.doMock('./viewModel/useTableManagerViewModel', () => ({
        default: vi.fn(() => mockViewModel)
      }))

      render(<TableManager />)
      
      const deleteButtons = screen.getAllByRole('button', { name: /Excluir tarefa/i })
      fireEvent.click(deleteButtons[0])
      
      expect(mockHandleDeleteTask).toHaveBeenCalledWith(1)
    })

    test('deve chamar handleNewTask quando botão de nova tarefa é clicado', () => {
      const mockHandleNewTask = vi.fn()
      const mockViewModel = {
        users: mockUsers,
        tasks: mockTasks,
        loading: { users: false, tasks: false },
        error: null,
        showModal: false,
        currentTask: null,
        handleEditTask: vi.fn(),
        handleNewTask: mockHandleNewTask,
        handleDeleteTask: vi.fn(),
        handleDeleteUser: vi.fn(),
        closeModal: vi.fn(),
        fetchTasks: vi.fn(),
      }

      vi.doMock('./viewModel/useTableManagerViewModel', () => ({
        default: vi.fn(() => mockViewModel)
      }))

      render(<TableManager />)
      
      const newTaskButton = screen.getByRole('button', { name: /Criar nova tarefa/i })
      fireEvent.click(newTaskButton)
      
      expect(mockHandleNewTask).toHaveBeenCalled()
    })
  })

  describe('Validação de Modal', () => {
    test('deve mostrar modal quando showModal é true', () => {
      const mockViewModel = {
        users: mockUsers,
        tasks: mockTasks,
        loading: { users: false, tasks: false },
        error: null,
        showModal: true,
        currentTask: mockTasks[0],
        handleEditTask: vi.fn(),
        handleNewTask: vi.fn(),
        handleDeleteTask: vi.fn(),
        handleDeleteUser: vi.fn(),
        closeModal: vi.fn(),
        fetchTasks: vi.fn(),
      }

      vi.doMock('./viewModel/useTableManagerViewModel', () => ({
        default: vi.fn(() => mockViewModel)
      }))

      render(<TableManager />)
      
      expect(screen.getByText('Editar Tarefa')).toBeInTheDocument()
    })

    test('não deve mostrar modal quando showModal é false', () => {
      const mockViewModel = {
        users: mockUsers,
        tasks: mockTasks,
        loading: { users: false, tasks: false },
        error: null,
        showModal: false,
        currentTask: null,
        handleEditTask: vi.fn(),
        handleNewTask: vi.fn(),
        handleDeleteTask: vi.fn(),
        handleDeleteUser: vi.fn(),
        closeModal: vi.fn(),
        fetchTasks: vi.fn(),
      }

      vi.doMock('./viewModel/useTableManagerViewModel', () => ({
        default: vi.fn(() => mockViewModel)
      }))

      render(<TableManager />)
      
      expect(screen.queryByText('Editar Tarefa')).not.toBeInTheDocument()
      expect(screen.queryByText('Cadastro de Tarefa')).not.toBeInTheDocument()
    })
  })

  describe('Validação de Acessibilidade', () => {
    test('deve ter atributos ARIA corretos', () => {
      const mockViewModel = {
        users: mockUsers,
        tasks: mockTasks,
        loading: { users: false, tasks: false },
        error: null,
        showModal: false,
        currentTask: null,
        handleEditTask: vi.fn(),
        handleNewTask: vi.fn(),
        handleDeleteTask: vi.fn(),
        handleDeleteUser: vi.fn(),
        closeModal: vi.fn(),
        fetchTasks: vi.fn(),
      }

      vi.doMock('./viewModel/useTableManagerViewModel', () => ({
        default: vi.fn(() => mockViewModel)
      }))

      render(<TableManager />)
      
      expect(screen.getByRole('main')).toBeInTheDocument()
      expect(screen.getByLabelText('Tabela de usuários')).toBeInTheDocument()
      expect(screen.getByLabelText('Tabela de tarefas')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Criar nova tarefa/i })).toBeInTheDocument()
    })
  })

  describe('Validação de Integração com API', () => {
    test('deve chamar fetchTasks quando componente é montado', async () => {
      axios.get.mockResolvedValueOnce({ data: { users: mockUsers, tasks: mockTasks } })
      
      const mockViewModel = {
        users: [],
        tasks: [],
        loading: { users: true, tasks: true },
        error: null,
        showModal: false,
        currentTask: null,
        handleEditTask: vi.fn(),
        handleNewTask: vi.fn(),
        handleDeleteTask: vi.fn(),
        handleDeleteUser: vi.fn(),
        closeModal: vi.fn(),
        fetchTasks: vi.fn().mockResolvedValueOnce({ data: { users: mockUsers, tasks: mockTasks } }),
      }

      vi.doMock('./viewModel/useTableManagerViewModel', () => ({
        default: vi.fn(() => mockViewModel)
      }))

      render(<TableManager />)
      
      await waitFor(() => {
        expect(mockViewModel.fetchTasks).toHaveBeenCalled()
      })
    })

    test('deve mostrar erro quando a API falha', async () => {
      axios.get.mockRejectedValueOnce({ response: { data: { message: 'Erro ao carregar dados' } } })
      
      const mockViewModel = {
        users: [],
        tasks: [],
        loading: { users: false, tasks: false },
        error: 'Erro ao carregar dados',
        showModal: false,
        currentTask: null,
        handleEditTask: vi.fn(),
        handleNewTask: vi.fn(),
        handleDeleteTask: vi.fn(),
        handleDeleteUser: vi.fn(),
        closeModal: vi.fn(),
        fetchTasks: vi.fn().mockRejectedValueOnce({ response: { data: { message: 'Erro ao carregar dados' } } }),
      }

      vi.doMock('./viewModel/useTableManagerViewModel', () => ({
        default: vi.fn(() => mockViewModel)
      }))

      render(<TableManager />)
      
      expect(screen.getByRole('alert')).toHaveTextContent('Erro ao carregar dados')
    })
  })

  describe('Validação de Dados Vazios', () => {
    test('deve mostrar mensagem vazia quando não há usuários', () => {
      const mockViewModel = {
        users: [],
        tasks: mockTasks,
        loading: { users: false, tasks: false },
        error: null,
        showModal: false,
        currentTask: null,
        handleEditTask: vi.fn(),
        handleNewTask: vi.fn(),
        handleDeleteTask: vi.fn(),
        handleDeleteUser: vi.fn(),
        closeModal: vi.fn(),
        fetchTasks: vi.fn(),
      }

      vi.doMock('./viewModel/useTableManagerViewModel', () => ({
        default: vi.fn(() => mockViewModel)
      }))

      render(<TableManager />)
      
      expect(screen.getByText('Usuários')).toBeInTheDocument()
      expect(screen.getByText('Ações')).toBeInTheDocument()
      expect(screen.getByText('ID')).toBeInTheDocument()
      expect(screen.getByText('Nome')).toBeInTheDocument()
      expect(screen.getByText('E-mail')).toBeInTheDocument()
    })

    test('deve mostrar mensagem vazia quando não há tarefas', () => {
      const mockViewModel = {
        users: mockUsers,
        tasks: [],
        loading: { users: false, tasks: false },
        error: null,
        showModal: false,
        currentTask: null,
        handleEditTask: vi.fn(),
        handleNewTask: vi.fn(),
        handleDeleteTask: vi.fn(),
        handleDeleteUser: vi.fn(),
        closeModal: vi.fn(),
        fetchTasks: vi.fn(),
      }

      vi.doMock('./viewModel/useTableManagerViewModel', () => ({
        default: vi.fn(() => mockViewModel)
      }))

      render(<TableManager />)
      
      expect(screen.getByText('Tarefas')).toBeInTheDocument()
      expect(screen.getByText('Ações')).toBeInTheDocument()
      expect(screen.getByText('ID')).toBeInTheDocument()
      expect(screen.getByText('Usuário')).toBeInTheDocument()
      expect(screen.getByText('Descrição')).toBeInTheDocument()
      expect(screen.getByText('Setor')).toBeInTheDocument()
      expect(screen.getByText('Prioridade')).toBeInTheDocument()
      expect(screen.getByText('Status')).toBeInTheDocument()
      expect(screen.getByText('Data')).toBeInTheDocument()
    })
  })
})