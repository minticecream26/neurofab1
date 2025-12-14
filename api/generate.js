export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt, speed, skipCAD } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Missing prompt" });
  }

  // 🔴 CALL YOUR AI HERE
  // Example placeholder (replace with real API)
  const generated = {
    id: Date.now(),
    projectName: "Generated Project",
    plan: `Project plan for:\n${prompt}`,
    bom: "• ESP32\n• Sensors\n• Wiring",
    code: "// Generated code goes here",
    cad: skipCAD ? "CAD skipped" : "// CAD data",
    assembly: "1. Assemble\n2. Upload code\n3. Test",
    tips: "Use stable power"
  };

  res.status(200).json(generated);
}
