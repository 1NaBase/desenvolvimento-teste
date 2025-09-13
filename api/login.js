import bcrypt from "bcrypt";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método não permitido" });
  }

  const { login, senha } = req.body;

  // Pega o usuário pelo nome
  const { data, error } = await supabase
    .from("login")
    .select("*")
    .eq("nome", login)
    .single();

  if (!data) {
    return res.status(401).json({ success: false, message: "Usuário não encontrado" });
  }

  // Compara a senha enviada com o hash do banco
  const senhaValida = await bcrypt.compare(senha, data.senha);
  if (!senhaValida) {
    return res.status(401).json({ success: false, message: "Senha incorreta" });
  }

  // Login OK
  return res.status(200).json({ success: true });
}
