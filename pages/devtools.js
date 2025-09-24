// pages/devtools.jsx
import { useState } from "react";
import JSZip from "jszip";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import UnlockWrapper from "../components/UnlockWrapper";

export default function DevTools() {
  const [botName, setBotName] = useState("NightBot");
  const [runtime, setRuntime] = useState("node");
  const [commands, setCommands] = useState([
    { cmd: "/start", reply: "Welcome to NightBot!" },
    { cmd: "/help", reply: "Commands: /start, /help, /status, /ping" },
  ]);
  const [codeIn, setCodeIn] = useState("// paste code here");
  const [changeReq, setChangeReq] = useState("");
  const [codeOut, setCodeOut] = useState("");
  const [cloneNote, setCloneNote] = useState("");
  const [cloneFile, setCloneFile] = useState(null);
  const [loading, setLoading] = useState(false);

  function addCommand() {
    setCommands([...commands, { cmd: "", reply: "" }]);
  }

  async function generateBotCode() {
    setLoading(true);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: "Bot Builder",
          input: JSON.stringify({ botName, runtime, commands }),
          instructions:
            "Generate clean code for a simple Telegram bot with the given runtime and commands.",
        }),
      });
      const data = await res.json();
      setCodeOut(data.result);
    } catch (e) {
      setCodeOut("// Failed to generate code");
    }
    setLoading(false);
  }

  async function applyModification() {
    setLoading(true);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: "Code Modifier",
          input: codeIn,
          instructions: changeReq,
        }),
      });
      const data = await res.json();
      setCodeOut(data.result);
    } catch {
      setCodeOut("// Modification failed");
    }
    setLoading(false);
  }

  async function buildBotZip() {
    const zip = new JSZip();
    zip.file(
      "README.md",
      `# ${botName}\n\nGenerated with NightForge DevTools.\n`
    );
    zip.file(runtime === "node" ? "bot.js" : "bot.py", codeOut || "// no code");
    zip.file("commands.json", JSON.stringify(commands, null, 2));
    if (cloneFile) {
      zip.file(cloneFile.name, await cloneFile.arrayBuffer());
    }
    const blob = await zip.generateAsync({ type: "blob" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${botName}.zip`;
    link.click();
  }

  return (
    <>
      <Navbar />
      <UnlockWrapper>
        <main className="container section">
          <h1 className="section-title">💀 NightForge DevTools</h1>

          {/* BOT BUILDER */}
          <section className="card">
            <h3>🤖 Bot Builder</h3>

            <label>Bot Name</label>
            <input
              className="input"
              value={botName}
              onChange={(e) => setBotName(e.target.value)}
            />

            <label>Runtime</label>
            <select
              className="input"
              value={runtime}
              onChange={(e) => setRuntime(e.target.value)}
            >
              <option value="node">Node.js</option>
              <option value="python">Python</option>
            </select>

            <label>Commands</label>
            <div>
              {commands.map((c, i) => (
                <div key={i} className="command-pair">
                  <input
                    className="input"
                    value={c.cmd}
                    onChange={(e) => {
                      const arr = [...commands];
                      arr[i].cmd = e.target.value;
                      setCommands(arr);
                    }}
                    placeholder="/cmd"
                  />
                  <input
                    className="input"
                    value={c.reply}
                    onChange={(e) => {
                      const arr = [...commands];
                      arr[i].reply = e.target.value;
                      setCommands(arr);
                    }}
                    placeholder="Reply text"
                  />
                </div>
              ))}
              <button className="btn" onClick={addCommand}>
                + Add Command
              </button>
            </div>

            <button
              className="btn btn-primary"
              onClick={generateBotCode}
              disabled={loading}
            >
              Generate Bot Code
            </button>
          </section>

          {/* CODE MODIFIER */}
          <section className="card">
            <h3>🛠 Code Modifier</h3>

            <label>Paste Your Code</label>
            <textarea
              className="code-input"
              rows={6}
              value={codeIn}
              onChange={(e) => setCodeIn(e.target.value)}
            />

            <label>Describe Change</label>
            <input
              className="input"
              placeholder="e.g. add a /status command"
              value={changeReq}
              onChange={(e) => setChangeReq(e.target.value)}
            />

            <button
              className="btn btn-primary"
              onClick={applyModification}
              disabled={loading}
            >
              Apply Change
            </button>

            {codeOut && <pre className="code-block">{codeOut}</pre>}
          </section>

          {/* BOT CLONER */}
          <section className="card">
            <h3>📦 Bot Cloner</h3>

            <label>Upload Existing Bot (.zip)</label>
            <input
              type="file"
              accept=".zip"
              className="input"
              onChange={(e) => {
                setCloneFile(e.target.files[0]);
                setCloneNote(`Uploaded: ${e.target.files[0].name}`);
              }}
            />
            <p className="muted">{cloneNote}</p>

            <button className="btn btn-primary" onClick={buildBotZip}>
              Repackage ZIP
            </button>
          </section>
        </main>
      </UnlockWrapper>
      <Footer />
    </>
  );
}
