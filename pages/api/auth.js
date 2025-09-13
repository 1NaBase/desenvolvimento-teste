export default function handler(req, res) {
  if (req.method === "POST") {
    const { username, password } = req.body;

    const USERNAME = process.env.DASH_USER;
    const PASSWORD = process.env.DASH_PASS;

    if (username === USERNAME && password === PASSWORD) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(401).json({ success: false, message: "Usuário ou senha incorretos." });
    }
  } else {
    return res.status(405).json({ message: "Método não permitido" });
  }
}
