import bcrypt from "bcrypt";
import { createClient } from "@supabase/supabase-js";

// Coloque sua URL e chave diretamente
const supabase = createClient(
  "https://supabase.co",               // sua URL
  "key" // sua service key
);

async function criarUsuario(login, senha) {
  const hash = await bcrypt.hash(senha, 10);
  const { data, error } = await supabase
    .from("login")
    .insert([{ nome: login, senha: hash }]);

  if (error) console.error("Erro:", error);
  else console.log("Usuário criado:", login);
}

// Exemplo
criarUsuario("admin", "Maxword2021#");
