import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { z } from "zod";

const userSchema = z.object({
  name: z
    .string()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .regex(/^[a-zA-ZÀ-ÿ\s']+$/, "Nome deve conter apenas letras e espaços"),
  email: z
    .string()
    .email("Email inválido"),
});

export default function useModalRegisterViewModel({ refreshUsers, onClose }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const modalRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const blockEvent = (e) => {
      if (modalRef.current && modalRef.current.contains(e.target)) return;
      if (typeof e.stopImmediatePropagation === "function") e.stopImmediatePropagation();
      else e.stopPropagation();
      if (typeof e.preventDefault === "function") e.preventDefault();
      return false;
    };

    const opts = { capture: true, passive: false };
    const events = ["pointerdown", "pointermove", "mousedown", "mousemove", "touchstart", "dragstart"];
    events.forEach(ev => document.addEventListener(ev, blockEvent, opts));

    return () => {
      document.body.style.overflow = "auto";
      events.forEach(ev => document.removeEventListener(ev, blockEvent, opts));
    };
  }, []);

  const validateField = (field, value) => {
    const trimmedValue = value.trim();
    
    if (field === 'name') {
      if (trimmedValue.length < 2) {
        setNameError("Nome deve ter pelo menos 2 caracteres");
        return false;
      }
      if (!/^[a-zA-ZÀ-ÿ\s']+$/.test(trimmedValue)) {
        setNameError("Nome deve conter apenas letras e espaços");
        return false;
      }
      setNameError("");
      return true;
    }
    
    if (field === 'email') {
      if (!trimmedValue) {
        setEmailError("Email inválido");
        return false;
      }
      if (!z.string().email().safeParse(trimmedValue).success) {
        setEmailError("Email inválido");
        return false;
      }
      setEmailError("");
      return true;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate all fields
    const isNameValid = validateField('name', name);
    const isEmailValid = validateField('email', email);

    if (!isNameValid || !isEmailValid) {
      setLoading(false);
      return;
    }

    try {
      // Use trimmed values for API call
      const trimmedName = name.trim();
      const trimmedEmail = email.trim();
      
      await axios.post("http://localhost:8000/api/usuarios/", { name: trimmedName, email: trimmedEmail });
      alert("Usuário cadastrado com sucesso!");
      setName("");
      setEmail("");
      setNameError("");
      setEmailError("");
      refreshUsers?.();
      onClose();
    } catch (err) {
      console.error(err);
      if (err.response) {
        setError("Erro ao cadastrar usuário: " + err.response.data.message || "Erro desconhecido.");
      } else if (err.request) {
        setError("Erro de rede: Não foi possível se conectar ao servidor.");
      } else {
        setError("Erro ao cadastrar usuário. Verifique os dados e tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    modalRef,
    name, setName,
    email, setEmail,
    loading,
    error,
    nameError,
    emailError,
    handleSubmit,
  };
}