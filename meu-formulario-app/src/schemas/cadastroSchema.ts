import { z } from 'zod';

export const cadastroSchema = z.object({
  nome: z
    .string()
    .min(3, 'Nome deve ter pelo menos 3 caracteres'),

  email: z
    .string()
    .email('E-mail inválido'),

  idade: z
    .string()
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 18, {
      message: 'Você deve ter pelo menos 18 anos para se inscrever',
    }),

  senha: z
    .string()
    .min(6, 'Senha deve ter pelo menos 6 caracteres'),

  confirmarSenha: z
    .string(),
}).refine((data) => data.senha === data.confirmarSenha, {
  message: 'As senhas não coincidem',
  path: ['confirmarSenha'],
});

export type CadastroFormData = z.infer<typeof cadastroSchema>;