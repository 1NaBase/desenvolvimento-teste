import bcrypt from "bcryptjs"; // substituído para funcionar em serverless
import { createClient } from "@supabase/supabase-js";

// Inicializa Supabase com variáveis de ambiente
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ message: "Método não permitido" });
    }

    const { login, senha } = req.body;

    if (!login || !senha) {
      return res.status(400).json({ success: false, message: "Login e senha são obrigatórios" });
    }

    // Busca usuário pelo login
    const { data, error } = await supabase
      .from("login")
      .select("*")
      .eq("nome", login)
      .single();

    if (error || !data) {
      return res.status(401).json({ success: false, message: "Usuário não encontrado" });
    }

    // Compara senha enviada com hash do banco
    const senhaValida = await bcrypt.compare(senha, data.senha);
    if (!senhaValida) {
      return res.status(401).json({ success: false, message: "Senha incorreta" });
    }

    // Login OK
    return res.status(200).json({ success: true });

  } catch (err) {
    console.error("Erro no /api/login:", err);
    return res.status(500).json({ success: false, message: "Erro interno do servidor" });
  }
}
