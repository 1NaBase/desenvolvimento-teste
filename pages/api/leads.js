import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,      // definido no .env.local
  process.env.SUPABASE_SERVICE_KEY // definido no .env.local
);

export default async function handler(req, res) {
  const { method } = req;

  if (method === "GET") {
    try {
      const { page = 1, limit = 5 } = req.query;
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .range(from, to)
        .order("id", { ascending: false });

      if (error) throw error;

      return res.status(200).json({ leads: data });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }

  if (method === "POST") {
    try {
      const { nome, email, telefone, mensagem } = req.body;

      const { data, error } = await supabase
        .from("leads")
        .insert([{ nome, email, telefone, mensagem }])
        .select();

      if (error) throw error;

      return res.status(201).json({ message: "Lead criado!", lead: data[0] });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }

  return res.status(405).json({ message: "Método não permitido" });
}
