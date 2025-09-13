import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

export default async function handler(req, res) {
  const { method } = req;

  if (method === "GET") {
    // pegar leads (página simples)
    const { page = 1, limit = 10 } = req.query;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .range(from, to)
      .order("lead_id", { ascending: false });

    if (error) return res.status(500).json({ message: error.message });
    return res.status(200).json({ leads: data });
  }

  if (method === "POST") {
    const { nome, email, telefone, mensagem } = req.body;
    const { data, error } = await supabase
      .from("leads")
      .insert([{ nome, email, telefone, mensagem }]);

    if (error) return res.status(500).json({ message: error.message });
    return res.status(200).json({ message: "Lead criado", lead: data[0] });
  }

  // PUT e DELETE podem vir depois
  return res.status(405).json({ message: "Método não permitido" });
}
