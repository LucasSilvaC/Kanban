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
    .email("Email inválido")
    .regex(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, "Formato de email inválido"),
});

export default function useModalRegisterViewModel({ refreshUsers, onClose }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const validation = userSchema.safeParse({ name, email });

    if (!validation.success) {
      setError(
        validation.error.issues
          ? validation.error.issues.map(err => err.message).join(", ")
          : "Dados inválidos"
      );
      setLoading(false);
      return;
    }

    try {
      await axios.post("http://localhost:8000/api/usuarios/", { name, email });
      alert("Usuário cadastrado com sucesso!");
      setName("");
      setEmail("");
      refreshUsers?.();
      onClose();
    } catch (err) {
      console.error(err);
      setError("Erro ao cadastrar usuário. Verifique os dados e tente novamente.");
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
    handleSubmit,
  };
}