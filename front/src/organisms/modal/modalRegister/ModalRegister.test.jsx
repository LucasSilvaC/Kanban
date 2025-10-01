import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import axios from 'axios'
import ModalRegister from './ModalRegister'

// Mock do axios
vi.mock('axios')

const mockRefreshUsers = vi.fn()
const mockOnClose = vi.fn()

describe('ModalRegister - Validações de Formulário', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Validação de Espaços em Branco', () => {
    test('deve mostrar erro quando nome está em branco', async () => {
      render(<ModalRegister refreshUsers={mockRefreshUsers} onClose={mockOnClose} />)
      
      const submitButton = screen.getByRole('button', { name: /Cadastrar/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Nome deve ter pelo menos 2 caracteres')).toBeInTheDocument()
      })
    })

    test('deve mostrar erro quando email está em branco', async () => {
      render(<ModalRegister refreshUsers={mockRefreshUsers} onClose={mockOnClose} />)
      
      const nameInput = screen.getByLabelText(/Nome do usuário/i)
      fireEvent.change(nameInput, { target: { value: 'João' } })
      
      const submitButton = screen.getByRole('button', { name: /Cadastrar/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Email inválido')).toBeInTheDocument()
      })
    })
  })

  describe('Validação de Valores Numéricos', () => {
    test('não deve aceitar valores numéricos no campo de nome', async () => {
      render(<ModalRegister refreshUsers={mockRefreshUsers} onClose={mockOnClose} />)
      
      const nameInput = screen.getByLabelText(/Nome do usuário/i)
      fireEvent.change(nameInput, { target: { value: '123' } })
      
      const emailInput = screen.getByLabelText(/Email do usuário/i)
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
      
      const submitButton = screen.getByRole('button', { name: /Cadastrar/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Nome deve conter apenas letras e espaços')).toBeInTheDocument()
      })
    })

    test('não deve aceitar valores numéricos no campo de email', async () => {
      render(<ModalRegister refreshUsers={mockRefreshUsers} onClose={mockOnClose} />)
      
      const nameInput = screen.getByLabelText(/Nome do usuário/i)
      fireEvent.change(nameInput, { target: { value: 'João' } })
      
      const emailInput = screen.getByLabelText(/Email do usuário/i)
      fireEvent.change(emailInput, { target: { value: '123456' } })
      
      const submitButton = screen.getByRole('button', { name: /Cadastrar/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Email inválido')).toBeInTheDocument()
      })
    })
  })

  describe('Validação de Máximo de Caracteres', () => {
    test('deve aceitar nome com muitos caracteres', async () => {
      const longName = 'João Maria Silva Santos'.repeat(10)
      render(<ModalRegister refreshUsers={mockRefreshUsers} onClose={mockOnClose} />)
      
      const nameInput = screen.getByLabelText(/Nome do usuário/i)
      fireEvent.change(nameInput, { target: { value: longName } })
      
      const emailInput = screen.getByLabelText(/Email do usuário/i)
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
      
      const submitButton = screen.getByRole('button', { name: /Cadastrar/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith('http://localhost:8000/api/usuarios/', expect.objectContaining({
          name: longName
        }))
      })
    })

    test('deve aceitar email com muitos caracteres', async () => {
      const longEmail = 'a'.repeat(100) + '@example.com'
      render(<ModalRegister refreshUsers={mockRefreshUsers} onClose={mockOnClose} />)
      
      const nameInput = screen.getByLabelText(/Nome do usuário/i)
      fireEvent.change(nameInput, { target: { value: 'João' } })
      
      const emailInput = screen.getByLabelText(/Email do usuário/i)
      fireEvent.change(emailInput, { target: { value: longEmail } })
      
      const submitButton = screen.getByRole('button', { name: /Cadastrar/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith('http://localhost:8000/api/usuarios/', expect.objectContaining({
          email: longEmail
        }))
      })
    })
  })

  describe('Validação de Valores Nulos', () => {
    test('deve mostrar erro quando ambos os campos são nulos', async () => {
      render(<ModalRegister refreshUsers={mockRefreshUsers} onClose={mockOnClose} />)
      
      const submitButton = screen.getByRole('button', { name: /Cadastrar/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Nome deve ter pelo menos 2 caracteres')).toBeInTheDocument()
        expect(screen.getByText('Email inválido')).toBeInTheDocument()
      })
    })
  })

  describe('Validação de Valores Não Esperados', () => {
    test('não deve aceitar email sem domínio', async () => {
      render(<ModalRegister refreshUsers={mockRefreshUsers} onClose={mockOnClose} />)
      
      const nameInput = screen.getByLabelText(/Nome do usuário/i)
      fireEvent.change(nameInput, { target: { value: 'João' } })
      
      const emailInput = screen.getByLabelText(/Email do usuário/i)
      fireEvent.change(emailInput, { target: { value: 'joao@' } })
      
      const submitButton = screen.getByRole('button', { name: /Cadastrar/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Email inválido')).toBeInTheDocument()
      })
    })

    test('não deve aceitar email com domínio inválido', async () => {
      render(<ModalRegister refreshUsers={mockRefreshUsers} onClose={mockOnClose} />)
      
      const nameInput = screen.getByLabelText(/Nome do usuário/i)
      fireEvent.change(nameInput, { target: { value: 'João' } })
      
      const emailInput = screen.getByLabelText(/Email do usuário/i)
      fireEvent.change(emailInput, { target: { value: 'joao@dominio.invalido' } })
      
      const submitButton = screen.getByRole('button', { name: /Cadastrar/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Email inválido')).toBeInTheDocument()
      })
    })
  })

  describe('Validação de Caracteres Especiais', () => {
    test('deve aceitar caracteres especiais no nome', async () => {
      render(<ModalRegister refreshUsers={mockRefreshUsers} onClose={mockOnClose} />)
      
      const nameInput = screen.getByLabelText(/Nome do usuário/i)
      fireEvent.change(nameInput, { target: { value: 'João Maria Silva Santos' } })
      
      const emailInput = screen.getByLabelText(/Email do usuário/i)
      fireEvent.change(emailInput, { target: { value: 'joao.silva@example.com' } })
      
      const submitButton = screen.getByRole('button', { name: /Cadastrar/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith('http://localhost:8000/api/usuarios/', expect.objectContaining({
          name: 'João Maria Silva Santos'
        }))
      })
    })

    test('deve aceitar caracteres especiais no email', async () => {
      render(<ModalRegister refreshUsers={mockRefreshUsers} onClose={mockOnClose} />)
      
      const nameInput = screen.getByLabelText(/Nome do usuário/i)
      fireEvent.change(nameInput, { target: { value: 'João' } })
      
      const emailInput = screen.getByLabelText(/Email do usuário/i)
      fireEvent.change(emailInput, { target: { value: 'joao.silva+test@example.com' } })
      
      const submitButton = screen.getByRole('button', { name: /Cadastrar/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith('http://localhost:8000/api/usuarios/', expect.objectContaining({
          email: 'joao.silva+test@example.com'
        }))
      })
    })

    test('não deve aceitar caracteres especiais inválidos no nome', async () => {
      render(<ModalRegister refreshUsers={mockRefreshUsers} onClose={mockOnClose} />)
      
      const nameInput = screen.getByLabelText(/Nome do usuário/i)
      fireEvent.change(nameInput, { target: { value: 'João@Maria#Silva' } })
      
      const emailInput = screen.getByLabelText(/Email do usuário/i)
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
      
      const submitButton = screen.getByRole('button', { name: /Cadastrar/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Nome deve conter apenas letras e espaços')).toBeInTheDocument()
      })
    })
  })

  describe('Validação de Excesso de Espaços', () => {
    test('deve aceitar múltiplos espaços no nome', async () => {
      render(<ModalRegister refreshUsers={mockRefreshUsers} onClose={mockOnClose} />)
      
      const nameInput = screen.getByLabelText(/Nome do usuário/i)
      fireEvent.change(nameInput, { target: { value: 'João    Maria    Silva' } })
      
      const emailInput = screen.getByLabelText(/Email do usuário/i)
      fireEvent.change(emailInput, { target: { value: 'joao.silva@example.com' } })
      
      const submitButton = screen.getByRole('button', { name: /Cadastrar/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith('http://localhost:8000/api/usuarios/', expect.objectContaining({
          name: 'João    Maria    Silva'
        }))
      })
    })

    test('deve aceitar espaços no início e fim do nome', async () => {
      render(<ModalRegister refreshUsers={mockRefreshUsers} onClose={mockOnClose} />)
      
      const nameInput = screen.getByLabelText(/Nome do usuário/i)
      fireEvent.change(nameInput, { target: { value: '  João Silva  ' } })
      
      const emailInput = screen.getByLabelText(/Email do usuário/i)
      fireEvent.change(emailInput, { target: { value: 'joao.silva@example.com' } })
      
      const submitButton = screen.getByRole('button', { name: /Cadastrar/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith('http://localhost:8000/api/usuarios/', expect.objectContaining({
          name: '  João Silva  '
        }))
      })
    })

    test('não deve aceitar apenas espaços no nome', async () => {
      render(<ModalRegister refreshUsers={mockRefreshUsers} onClose={mockOnClose} />)
      
      const nameInput = screen.getByLabelText(/Nome do usuário/i)
      fireEvent.change(nameInput, { target: { value: '     ' } })
      
      const emailInput = screen.getByLabelText(/Email do usuário/i)
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
      
      const submitButton = screen.getByRole('button', { name: /Cadastrar/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Nome deve ter pelo menos 2 caracteres')).toBeInTheDocument()
      })
    })
  })

  describe('Validação de Formato de Email', () => {
    test('deve aceitar email com formato válido', async () => {
      const validEmails = [
        'joao@example.com',
        'joao.silva@example.com',
        'joao123@example.com',
        'joao.silva123@example.com',
        'joao@sub.example.com',
        'joao.silva+tag@example.com'
      ]

      for (const email of validEmails) {
        render(<ModalRegister refreshUsers={mockRefreshUsers} onClose={mockOnClose} />)
        
        const nameInput = screen.getByLabelText(/Nome do usuário/i)
        fireEvent.change(nameInput, { target: { value: 'João' } })
        
        const emailInput = screen.getByLabelText(/Email do usuário/i)
        fireEvent.change(emailInput, { target: { value: email } })
        
        const submitButton = screen.getByRole('button', { name: /Cadastrar/i })
        fireEvent.click(submitButton)

        await waitFor(() => {
          expect(axios.post).toHaveBeenCalledWith('http://localhost:8000/api/usuarios/', expect.objectContaining({
            email: email
          }))
        })
      }
    })

    test('não deve aceitar email com formato inválido', async () => {
      const invalidEmails = [
        'joao',
        'joao@',
        '@example.com',
        'joao.example.com',
        'joao@.com',
        'joao@com.',
        'joao..silva@example.com',
        'joao@ex ample.com'
      ]

      for (const email of invalidEmails) {
        render(<ModalRegister refreshUsers={mockRefreshUsers} onClose={mockOnClose} />)
        
        const nameInput = screen.getByLabelText(/Nome do usuário/i)
        fireEvent.change(nameInput, { target: { value: 'João' } })
        
        const emailInput = screen.getByLabelText(/Email do usuário/i)
        fireEvent.change(emailInput, { target: { value: email } })
        
        const submitButton = screen.getByRole('button', { name: /Cadastrar/i })
        fireEvent.click(submitButton)

        await waitFor(() => {
          expect(screen.getByText('Email inválido')).toBeInTheDocument()
        })
      }
    })
  })

  describe('Integração com Backend', () => {
    test('deve chamar a API de cadastro com sucesso', async () => {
      axios.post.mockResolvedValueOnce({ data: { message: 'Usuário cadastrado com sucesso' } })
      
      render(<ModalRegister refreshUsers={mockRefreshUsers} onClose={mockOnClose} />)
      
      const nameInput = screen.getByLabelText(/Nome do usuário/i)
      fireEvent.change(nameInput, { target: { value: 'João Silva' } })
      
      const emailInput = screen.getByLabelText(/Email do usuário/i)
      fireEvent.change(emailInput, { target: { value: 'joao.silva@example.com' } })
      
      const submitButton = screen.getByRole('button', { name: /Cadastrar/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith('http://localhost:8000/api/usuarios/', {
          name: 'João Silva',
          email: 'joao.silva@example.com'
        })
        expect(mockRefreshUsers).toHaveBeenCalled()
        expect(mockOnClose).toHaveBeenCalled()
      })
    })

    test('deve mostrar erro quando a API falha', async () => {
      axios.post.mockRejectedValueOnce({ response: { data: { message: 'Email já existe' } } })
      
      render(<ModalRegister refreshUsers={mockRefreshUsers} onClose={mockOnClose} />)
      
      const nameInput = screen.getByLabelText(/Nome do usuário/i)
      fireEvent.change(nameInput, { target: { value: 'João Silva' } })
      
      const emailInput = screen.getByLabelText(/Email do usuário/i)
      fireEvent.change(emailInput, { target: { value: 'joao.silva@example.com' } })
      
      const submitButton = screen.getByRole('button', { name: /Cadastrar/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Erro ao cadastrar usuário: Email já existe')).toBeInTheDocument()
      })
    })

    test('deve mostrar erro de rede quando a API não responde', async () => {
      axios.post.mockRejectedValueOnce({ request: { status: 0 } })
      
      render(<ModalRegister refreshUsers={mockRefreshUsers} onClose={mockOnClose} />)
      
      const nameInput = screen.getByLabelText(/Nome do usuário/i)
      fireEvent.change(nameInput, { target: { value: 'João Silva' } })
      
      const emailInput = screen.getByLabelText(/Email do usuário/i)
      fireEvent.change(emailInput, { target: { value: 'joao.silva@example.com' } })
      
      const submitButton = screen.getByRole('button', { name: /Cadastrar/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Erro de rede: Não foi possível se conectar ao servidor.')).toBeInTheDocument()
      })
    })
  })
})