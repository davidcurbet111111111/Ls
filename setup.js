const { execSync, spawn } = require("child_process");
const readline = require("readline");
const http = require("http");

// Disable Ctrl+C / Ctrl+Z
process.on("SIGINT", () => {});
process.on("SIGTSTP", () => {});

// Prompt
function ask(q) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((res) =>
    rl.question(q, (ans) => {
      rl.close();
      res(ans.trim());
    })
  );
}

// Run command
function run(cmd, silent = false) {
  try {
    execSync(cmd, {
      stdio: silent ? "ignore" : "inherit",
      shell: "/bin/bash",
    });
  } catch {
    console.log("❌ Error:", cmd);
    process.exit(1);
  }
}

// Get ngrok tunnel info (same as curl API)
function getTunnel() {
  return new Promise((resolve, reject) => {
    http.get("http://127.0.0.1:4040/api/tunnels", (res) => {
      let data = "";
      res.on("data", (c) => (data += c));
      res.on("end", () => {
        try {
          const json = JSON.parse(data);
          const url = json.tunnels?.[0]?.public_url;
          if (!url) return reject();
          resolve(url.replace("tcp://", ""));
        } catch {
          reject();
        }
      });
    }).on("error", reject);
  });
}

// Download ngrok
function installNgrok() {
  console.clear();
  console.log("=======================");
  console.log("Downloading ngrok...");
  console.log("=======================");

  run("rm -rf ngrok ngrok.tgz ngrok.zip ng.sh", true);
  run("wget -q -O ngrok.tgz https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-linux-amd64.tgz", true);
  run("tar -xzf ngrok.tgz", true);
  run("chmod +x ngrok", true);
}

// Start ngrok with retry
async function startNgrok() {
  while (true) {
    console.clear();
    console.log("Go to: https://dashboard.ngrok.com/get-started/your-authtoken\n");

    const token = await ask("Paste Ngrok Authtoken: ");
    run(`./ngrok authtoken ${token}`, true);

    console.clear();
    console.log("Choose ngrok region:");
    console.log("us eu ap au sa jp in\n");

    const region = await ask("Region: ");

    spawn("./ngrok", ["tcp", "--region", region, "4000"], {
      detached: true,
      stdio: "ignore",
    });

    await new Promise((r) => setTimeout(r, 2000));

    try {
      await getTunnel();
      console.log("✅ Ngrok started");
      break;
    } catch {
      console.log("❌ Ngrok Error! Retrying...");
      await new Promise((r) => setTimeout(r, 1500));
    }
  }
}

// Main
(async () => {
  installNgrok();
  await startNgrok();

  console.log("\nStarting Docker...\n");

  run(`docker run --rm -d --network host --privileged \
--name nomachine-xfce4 \
-e PASSWORD=123456 \
-e USER=user \
--cap-add=SYS_PTRACE \
--shm-size=1g \
thuonghai2711/nomachine-ubuntu-desktop:windows10`);

  const ip = await getTunnel();

  console.clear();
  console.log("NoMachine: https://www.nomachine.com/download\n");
  console.log("Done! NoMachine Information:\n");
  console.log("IP Address:", ip);
  console.log("User: user");
  console.log("Passwd: 123456\n");
  console.log("Keep running... (Ctrl+C disabled)\n");

  // Keep alive loop (~12h)
  let i = 0;
  const max = 43200;
  const frames = ["Running .", "Running ..", "Running ...", "Running ....", "Running ....."];

  while (i < max) {
    for (let f of frames) {
      process.stdout.write(`\r${f} ${i}s / ${max}s`);
      await new Promise((r) => setTimeout(r, 120));
    }
    i++;
  }
})();
