import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

export default async function handler(req, res) {
  try {
    const { data, error } = await supabase.from("leads").select("*");
    if (error) return res.status(500).json({ message: error.message });

    return res.status(200).json({ leads: data });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}
