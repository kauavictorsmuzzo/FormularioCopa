# FormularioCopa# ⚽ FormularioCopa

> Formulário de inscrição para assistir à Copa do Mundo, desenvolvido com **React Native + Expo**, utilizando **React Hook Form** e **Zod** para controle e validação de campos.

---

## 📱 Preview

| Passo 1 — Identificação | Passo 2 — Segurança | Sucesso |
|:-:|:-:|:-:|
| Nome e e-mail com floating labels | Idade, senha e confirmação | Confetti + card de ingresso |

---

## 🚀 Tecnologias

| Tecnologia | Versão | Uso |
|---|---|---|
| [React Native](https://reactnative.dev/) | 0.74+ | Framework mobile |
| [Expo](https://expo.dev/) | SDK 51+ | Ambiente de desenvolvimento |
| [React Hook Form](https://react-hook-form.com/) | 7.x | Controle de formulários |
| [Zod](https://zod.dev/) | 3.x | Schema e validação de dados |
| [@hookform/resolvers](https://github.com/react-hook-form/resolvers) | 3.x | Integração RHF + Zod |

---

## 📂 Estrutura do projeto

```
FormularioCopa/
├── App.tsx                        # Entrada da aplicação
├── package.json
└── src/
    ├── schemas/
    │   └── cadastroSchema.ts      # Schema de validação com Zod
    ├── components/
    │   └── InputForm.tsx          # Componente de input reutilizável (floating label)
    └── screens/
        ├── CadastroScreen.tsx     # Tela principal do formulário (2 etapas)
        └── SuccessScreen.tsx      # Tela de confirmação com ingresso animado
```

---

## ✅ Funcionalidades

- **Formulário em 2 etapas** com animação de transição entre passos
- **Floating labels animadas** nos campos de entrada
- **Validação por etapa** — avança apenas quando os campos do passo atual são válidos
- **Mostrar/ocultar senha** com toggle dentro do input
- **Mensagens de erro** claras e contextuais abaixo de cada campo
- **Tela de sucesso** com confetti animado e card de ingresso gerado dinamicamente
- **Design dark premium** com tema Copa do Mundo (verde + dourado)
- Suporte a `KeyboardAvoidingView` para não cobrir inputs com o teclado

---

## 🔍 Validações implementadas

| Campo | Regra |
|---|---|
| Nome | Obrigatório, mínimo 3 caracteres |
| E-mail | Obrigatório, formato válido |
| Idade | Obrigatório, numérico, mínimo 18 anos |
| Senha | Obrigatório, mínimo 6 caracteres |
| Confirmar senha | Deve ser igual ao campo senha |

---

## ⚙️ Como rodar o projeto

### Pré-requisitos

- [Node.js](https://nodejs.org/) 18+
- [Expo Go](https://expo.dev/go) instalado no celular **ou** emulador Android/iOS configurado

### Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/FormularioCopa.git
cd FormularioCopa

# Instale as dependências
npm install

# Instale as dependências do formulário
npm install react-hook-form zod @hookform/resolvers
```

### Rodando

```bash
npx expo start
```

Escaneie o QR Code com o **Expo Go** ou pressione:
- `a` para abrir no emulador Android
- `i` para abrir no simulador iOS

---

## 📖 Conceitos abordados

Este projeto foi desenvolvido como atividade prática da disciplina de **Desenvolvimento Mobile**, cobrindo os seguintes tópicos:

- Criação e controle de formulários com `useForm` e `Controller`
- Definição de schemas de validação com `z.object()` e `z.refine()`
- Integração do Zod com React Hook Form via `zodResolver`
- Tipagem de formulários com `z.infer<typeof schema>`
- Exibição de mensagens de erro acessadas via `formState.errors`
- Organização de código em componentes e camadas separadas

