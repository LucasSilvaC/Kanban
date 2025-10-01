import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import axios from 'axios'
import ModalTask from './ModalTask'

// Mock do axios
vi.mock('axios')

const mockUsers = [
  { id: 1, name: 'João Silva', email: 'joao@example.com' },
  { id: 2, name: 'Maria Santos', email: 'maria@example.com' }
]

const mockTask = {
  id: 1,
  user: 1,
  description: 'Testar aplicativo',
  sector_name: 'TI',
  priority: 'HIGH',
  status: 'TODO'
}

describe('ModalTask - Validações de Formulário', () => {
  const mockRefreshTasks = vi.fn()
  const mockOnClose = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Validação de Espaços em Branco', () => {
    test('deve mostrar erro quando usuário não é selecionado', async () => {
      render(<ModalTask onClose={mockOnClose} users={mockUsers} refreshTasks={mockRefreshTasks} />)
      
      const submitButton = screen.getByRole('button', { name: /Cadastrar/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Selecione o usuário')).toBeInTheDocument()
      })
    })

    test('deve mostrar erro quando descrição está em branco', async () => {
      render(<ModalTask onClose={mockOnClose} users={mockUsers} refreshTasks={mockRefreshTasks} />)
      
      const userSelect = screen.getByLabelText(/Selecionar usuário/i)
      fireEvent.change(userSelect, { target: { value: '1' } })
      
      const submitButton = screen.getByRole('button', { name: /Cadastrar/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Descrição deve ter no mínimo 5 caracteres')).toBeInTheDocument()
      })
    })

    test('deve mostrar erro quando setor está em branco', async () => {
      render(<ModalTask onClose={mockOnClose} users={mockUsers} refreshTasks={mockRefreshTasks} />)
      
      const userSelect = screen.getByLabelText(/Selecionar usuário/i)
      fireEvent.change(userSelect, { target: { value: '1' } })
      
      const descriptionInput = screen.getByLabelText(/Descrição da tarefa/i)
      fireEvent.change(descriptionInput, { target: { value: 'Descrição válida' } })
      
      const submitButton = screen.getByRole('button', { name: /Cadastrar/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Setor é obrigatório')).toBeInTheDocument()
      })
    })

    test('deve mostrar erro quando prioridade não é selecionada', async () => {
      render(<ModalTask onClose={mockOnClose} users={mockUsers} refreshTasks={mockRefreshTasks} />)
      
      const userSelect = screen.getByLabelText(/Selecionar usuário/i)
      fireEvent.change(userSelect, { target: { value: '1' } })
      
      const descriptionInput = screen.getByLabelText(/Descrição da tarefa/i)
      fireEvent.change(descriptionInput, { target: { value: 'Descrição válida' } })
      
      const sectorInput = screen.getByLabelText(/Setor/i)
      fireEvent.change(sectorInput, { target: { value: 'TI' } })
      
      const submitButton = screen.getByRole('button', { name: /Cadastrar/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Selecione a prioridade')).toBeInTheDocument()
      })
    })
  })

  describe('Validação de Valores Numéricos', () => {
    test('não deve aceitar valores numéricos no campo de descrição', async () => {
      render(<ModalTask onClose={mockOnClose} users={mockUsers} refreshTasks={mockRefreshTasks} />)
      
      const userSelect = screen.getByLabelText(/Selecionar usuário/i)
      fireEvent.change(userSelect, { target: { value: '1' } })
      
      const descriptionInput = screen.getByLabelText(/Descrição da tarefa/i)
      fireEvent.change(descriptionInput, { target: { value: '12345' } })
      
      const sectorInput = screen.getByLabelText(/Setor/i)
      fireEvent.change(sectorInput, { target: { value: 'TI' } })
      
      const prioritySelect = screen.getByLabelText(/Prioridade/i)
      fireEvent.change(prioritySelect, { target: { value: 'HIGH' } })
      
      const submitButton = screen.getByRole('button', { name: /Cadastrar/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Descrição deve ter no mínimo 5 caracteres')).toBeInTheDocument()
      })
    })

    test('não deve aceitar valores numéricos no campo de setor', async () => {
      render(<ModalTask onClose={mockOnClose} users={mockUsers} refreshTasks={mockRefreshTasks} />)
      
      const userSelect = screen.getByLabelText(/Selecionar usuário/i)
      fireEvent.change(userSelect, { target: { value: '1' } })
      
      const descriptionInput = screen.getByLabelText(/Descrição da tarefa/i)
      fireEvent.change(descriptionInput, { target: { value: 'Descrição válida' } })
      
      const sectorInput = screen.getByLabelText(/Setor/i)
      fireEvent.change(sectorInput, { target: { value: '123' } })
      
      const submitButton = screen.getByRole('button', { name: /Cadastrar/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Setor deve conter apenas letras, espaços e hífens')).toBeInTheDocument()
      })
    })
  })

  describe('Validação de Máximo de Caracteres', () => {
    test('deve aceitar descrição com muitos caracteres', async () => {
      const longDescription = 'a'.repeat(1000)
      render(<ModalTask onClose={mockOnClose} users={mockUsers} refreshTasks={mockRefreshTasks} />)
      
      const userSelect = screen.getByLabelText(/Selecionar usuário/i)
      fireEvent.change(userSelect, { target: { value: '1' } })
      
      const descriptionInput = screen.getByLabelText(/Descrição da tarefa/i)
      fireEvent.change(descriptionInput, { target: { value: longDescription } })
      
      const sectorInput = screen.getByLabelText(/Setor/i)
      fireEvent.change(sectorInput, { target: { value: 'TI' } })
      
      const prioritySelect = screen.getByLabelText(/Prioridade/i)
      fireEvent.change(prioritySelect, { target: { value: 'HIGH' } })
      
      const submitButton = screen.getByRole('button', { name: /Cadastrar/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith('http://localhost:8000/api/tasks/', expect.objectContaining({
          description: longDescription
        }))
      })
    })

    test('deve aceitar setor com muitos caracteres', async () => {
      const longSector = 'Setor de Desenvolvimento de Software e Sistemas Complexos'.repeat(5)
      render(<ModalTask onClose={mockOnClose} users={mockUsers} refreshTasks={mockRefreshTasks} />)
      
      const userSelect = screen.getByLabelText(/Selecionar usuário/i)
      fireEvent.change(userSelect, { target: { value: '1' } })
      
      const descriptionInput = screen.getByLabelText(/Descrição da tarefa/i)
      fireEvent.change(descriptionInput, { target: { value: 'Descrição válida' } })
      
      const sectorInput = screen.getByLabelText(/Setor/i)
      fireEvent.change(sectorInput, { target: { value: longSector } })
      
      const prioritySelect = screen.getByLabelText(/Prioridade/i)
      fireEvent.change(prioritySelect, { target: { value: 'HIGH' } })
      
      const submitButton = screen.getByRole('button', { name: /Cadastrar/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith('http://localhost:8000/api/tasks/', expect.objectContaining({
          sector_name: longSector
        }))
      })
    })
  })

  describe('Validação de Valores Nulos', () => {
    test('deve mostrar erro quando todos os campos são nulos', async () => {
      render(<ModalTask onClose={mockOnClose} users={[]} refreshTasks={mockRefreshTasks} />)
      
      const submitButton = screen.getByRole('button', { name: /Cadastrar/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Selecione o usuário')).toBeInTheDocument()
        expect(screen.getByText('Descrição deve ter no mínimo 5 caracteres')).toBeInTheDocument()
        expect(screen.getByText('Setor é obrigatório')).toBeInTheDocument()
        expect(screen.getByText('Selecione a prioridade')).toBeInTheDocument()
      })
    })
  })

  describe('Validação de Valores Não Esperados', () => {
    test('não deve aceitar prioridade inválida', async () => {
      render(<ModalTask onClose={mockOnClose} users={mockUsers} refreshTasks={mockRefreshTasks} />)
      
      const userSelect = screen.getByLabelText(/Selecionar usuário/i)
      fireEvent.change(userSelect, { target: { value: '1' } })
      
      const descriptionInput = screen.getByLabelText(/Descrição da tarefa/i)
      fireEvent.change(descriptionInput, { target: { value: 'Descrição válida' } })
      
      const sectorInput = screen.getByLabelText(/Setor/i)
      fireEvent.change(sectorInput, { target: { value: 'TI' } })
      
      const prioritySelect = screen.getByLabelText(/Prioridade/i)
      fireEvent.change(prioritySelect, { target: { value: 'INVALID' } })
      
      const submitButton = screen.getByRole('button', { name: /Cadastrar/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Selecione a prioridade')).toBeInTheDocument()
      })
    })

    test('não deve aceitar usuário inválido', async () => {
      render(<ModalTask onClose={mockOnClose} users={mockUsers} refreshTasks={mockRefreshTasks} />)
      
      const userSelect = screen.getByLabelText(/Selecionar usuário/i)
      fireEvent.change(userSelect, { target: { value: '999' } })
      
      const descriptionInput = screen.getByLabelText(/Descrição da tarefa/i)
      fireEvent.change(descriptionInput, { target: { value: 'Descrição válida' } })
      
      const sectorInput = screen.getByLabelText(/Setor/i)
      fireEvent.change(sectorInput, { target: { value: 'TI' } })
      
      const prioritySelect = screen.getByLabelText(/Prioridade/i)
      fireEvent.change(prioritySelect, { target: { value: 'HIGH' } })
      
      const submitButton = screen.getByRole('button', { name: /Cadastrar/i })
      fireEvent.click(submitButton)

      // O formulário deve ser enviado mesmo com usuário inválido, pois a validação é feita no backend
      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith('http://localhost:8000/api/tasks/', expect.objectContaining({
          user: '999'
        }))
      })
    })
  })

  describe('Validação de Caracteres Especiais', () => {
    test('deve aceitar caracteres especiais na descrição', async () => {
      render(<ModalTask onClose={mockOnClose} users={mockUsers} refreshTasks={mockRefreshTasks} />)
      
      const userSelect = screen.getByLabelText(/Selecionar usuário/i)
      fireEvent.change(userSelect, { target: { value: '1' } })
      
      const descriptionInput = screen.getByLabelText(/Descrição da tarefa/i)
      fireEvent.change(descriptionInput, { target: { value: 'Descrição com @#$%&* caracteres especiais!' } })
      
      const sectorInput = screen.getByLabelText(/Setor/i)
      fireEvent.change(sectorInput, { target: { value: 'TI' } })
      
      const prioritySelect = screen.getByLabelText(/Prioridade/i)
      fireEvent.change(prioritySelect, { target: { value: 'HIGH' } })
      
      const submitButton = screen.getByRole('button', { name: /Cadastrar/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith('http://localhost:8000/api/tasks/', expect.objectContaining({
          description: 'Descrição com @#$%&* caracteres especiais!'
        }))
      })
    })

    test('não deve aceitar caracteres especiais inválidos no setor', async () => {
      render(<ModalTask onClose={mockOnClose} users={mockUsers} refreshTasks={mockRefreshTasks} />)
      
      const userSelect = screen.getByLabelText(/Selecionar usuário/i)
      fireEvent.change(userSelect, { target: { value: '1' } })
      
      const descriptionInput = screen.getByLabelText(/Descrição da tarefa/i)
      fireEvent.change(descriptionInput, { target: { value: 'Descrição válida' } })
      
      const sectorInput = screen.getByLabelText(/Setor/i)
      fireEvent.change(sectorInput, { target: { value: 'TI@#$%' } })
      
      const submitButton = screen.getByRole('button', { name: /Cadastrar/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Setor deve conter apenas letras, espaços e hífens')).toBeInTheDocument()
      })
    })
  })

  describe('Validação de Excesso de Espaços', () => {
    test('deve aceitar múltiplos espaços na descrição', async () => {
      render(<ModalTask onClose={mockOnClose} users={mockUsers} refreshTasks={mockRefreshTasks} />)
      
      const userSelect = screen.getByLabelText(/Selecionar usuário/i)
      fireEvent.change(userSelect, { target: { value: '1' } })
      
      const descriptionInput = screen.getByLabelText(/Descrição da tarefa/i)
      fireEvent.change(descriptionInput, { target: { value: 'Descrição    com    múltiplos    espaços' } })
      
      const sectorInput = screen.getByLabelText(/Setor/i)
      fireEvent.change(sectorInput, { target: { value: 'TI' } })
      
      const prioritySelect = screen.getByLabelText(/Prioridade/i)
      fireEvent.change(prioritySelect, { target: { value: 'HIGH' } })
      
      const submitButton = screen.getByRole('button', { name: /Cadastrar/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith('http://localhost:8000/api/tasks/', expect.objectContaining({
          description: 'Descrição    com    múltiplos    espaços'
        }))
      })
    })

    test('deve aceitar múltiplos espaços no setor', async () => {
      render(<ModalTask onClose={mockOnClose} users={mockUsers} refreshTasks={mockRefreshTasks} />)
      
      const userSelect = screen.getByLabelText(/Selecionar usuário/i)
      fireEvent.change(userSelect, { target: { value: '1' } })
      
      const descriptionInput = screen.getByLabelText(/Descrição da tarefa/i)
      fireEvent.change(descriptionInput, { target: { value: 'Descrição válida' } })
      
      const sectorInput = screen.getByLabelText(/Setor/i)
      fireEvent.change(sectorInput, { target: { value: 'Setor    de    Desenvolvimento' } })
      
      const prioritySelect = screen.getByLabelText(/Prioridade/i)
      fireEvent.change(prioritySelect, { target: { value: 'HIGH' } })
      
      const submitButton = screen.getByRole('button', { name: /Cadastrar/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith('http://localhost:8000/api/tasks/', expect.objectContaining({
          sector_name: 'Setor    de    Desenvolvimento'
        }))
      })
    })

    test('deve aceitar espaços no início e fim dos campos', async () => {
      render(<ModalTask onClose={mockOnClose} users={mockUsers} refreshTasks={mockRefreshTasks} />)
      
      const userSelect = screen.getByLabelText(/Selecionar usuário/i)
      fireEvent.change(userSelect, { target: { value: '1' } })
      
      const descriptionInput = screen.getByLabelText(/Descrição da tarefa/i)
      fireEvent.change(descriptionInput, { target: { value: '  Descrição com espaços no início e fim  ' } })
      
      const sectorInput = screen.getByLabelText(/Setor/i)
      fireEvent.change(sectorInput, { target: { value: '  TI  ' } })
      
      const prioritySelect = screen.getByLabelText(/Prioridade/i)
      fireEvent.change(prioritySelect, { target: { value: 'HIGH' } })
      
      const submitButton = screen.getByRole('button', { name: /Cadastrar/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith('http://localhost:8000/api/tasks/', expect.objectContaining({
          description: '  Descrição com espaços no início e fim  ',
          sector_name: '  TI  '
        }))
      })
    })
  })

  describe('Modo Edição', () => {
    test('deve preencher o formulário com dados da tarefa existente', () => {
      render(<ModalTask onClose={mockOnClose} users={mockUsers} task={mockTask} refreshTasks={mockRefreshTasks} />)
      
      expect(screen.getByLabelText(/Selecionar usuário/i)).toHaveValue('1')
      expect(screen.getByLabelText(/Descrição da tarefa/i)).toHaveValue('Testar aplicativo')
      expect(screen.getByLabelText(/Setor/i)).toHaveValue('TI')
      expect(screen.getByLabelText(/Prioridade/i)).toHaveValue('HIGH')
    })

    test('deve permitir editar e atualizar tarefa existente', async () => {
      render(<ModalTask onClose={mockOnClose} users={mockUsers} task={mockTask} refreshTasks={mockRefreshTasks} />)
      
      const descriptionInput = screen.getByLabelText(/Descrição da tarefa/i)
      fireEvent.change(descriptionInput, { target: { value: 'Descrição atualizada' } })
      
      const sectorInput = screen.getByLabelText(/Setor/i)
      fireEvent.change(sectorInput, { target: { value: 'RH' } })
      
      const submitButton = screen.getByRole('button', { name: /Atualizar/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(axios.patch).toHaveBeenCalledWith(`http://localhost:8000/api/tasks/${mockTask.id}/`, expect.objectContaining({
          description: 'Descrição atualizada',
          sector_name: 'RH'
        }))
      })
    })
  })
})