#!/usr/bin/env node

const { execSync } = require("child_process");

function run(cmd) {
  try {
    console.log(`\n[RUN] ${cmd}`);
    execSync(cmd, { stdio: "inherit" });
  } catch (e) {
    console.error(`\n[ERROR] Command failed: ${cmd}`);
    process.exit(1);
  }
}

// Colors
const red = "\x1b[1;31m";
const green = "\x1b[1;32m";
const yellow = "\x1b[1;33m";
const cyan = "\x1b[1;96m";
const reset = "\x1b[0m";

console.clear();

// Setup HOME
run("mkdir -p /data/data/com.termux/files/home");
process.env.HOME = "/data/data/com.termux/files/home";
process.chdir(process.env.HOME);

// Storage permission
run("echo Y | termux-setup-storage");

// Set mirror
run(`echo "deb https://packages-cf.termux.dev/apt/termux-main stable main" > /data/data/com.termux/files/usr/etc/apt/sources.list`);

// Update packages
run("pkg update -y && pkg upgrade -y");
run("pkg install p7zip wget tar qemu-system-aarch64-headless -y");

// Download files
console.log(`\n${cyan} - Downloading...${green}\n`);

run(`wget -O base_arm64-khanhnguyen.tar.7z.001 https://github.com/KhanhNguyen9872/Windows10ARM64/releases/download/Win10ARM64Base/base_arm64-khanhnguyen.tar.7z.001`);

run(`wget -O base_arm64-khanhnguyen.tar.7z.002 https://github.com/KhanhNguyen9872/Windows10ARM64/releases/download/Win10ARM64Base/base_arm64-khanhnguyen.tar.7z.002`);

run(`wget -O base_arm64-khanhnguyen.sha512sum https://github.com/KhanhNguyen9872/Windows10ARM64/releases/download/Win10ARM64Base/base_arm64-khanhnguyen.sha512sum`);

// Extract
console.log(`\n${cyan} - Extracting...${green}\n`);
run("7z x base_arm64-khanhnguyen.tar.7z.001 -aoa");

// Cleanup split files
run("rm -f base_arm64-khanhnguyen.tar.7z.*");

// Verify
console.log(`\n${cyan} - Verifying...${green}\n`);
try {
  run("sha512sum -c base_arm64-khanhnguyen.sha512sum");
} catch {
  console.log(`${red} File corrupted. Please reinstall.${reset}`);
  run("rm -f base_arm64-khanhnguyen.tar.xz");
  run("rm -f base_arm64-khanhnguyen.sha512sum");
  process.exit(1);
}

// Install
console.log(`\n${cyan} - Installing...${green}\n`);
run("tar -xJf base_arm64-khanhnguyen.tar.xz");

// Cleanup
run("rm -f base_arm64-khanhnguyen.tar.xz");
run("rm -f base_arm64-khanhnguyen.sha512sum");

// Download launcher
run("wget -O win10arm.sh https://raw.githubusercontent.com/davidcurbet111111111/Ls/refs/heads/main/win10.sh");

// Move script
run("mv win10arm.sh $PREFIX/bin/win10arm.sh");
run("chmod +x $PREFIX/bin/win10arm.sh");
run("chmod +x base_arm64");

// Check files
let success = true;

try {
  run("test -f base_arm64/khanh/base_arm64.qcow2");
  run("test -f base_arm64/khanh/BIOS.img");
  run("test -f base_arm64/khanh/qemu.conf");
} catch {
  success = false;
}

// Final
console.clear();

if (success) {
  console.log(`\n${yellow} - INSTALL COMPLETED!`);
  console.log(`${cyan} Run: bash $PREFIX/bin/win10arm.sh`);
  console.log(`${yellow} Use VNC Viewer → 127.0.0.1:5901${reset}`);
} else {
  console.log(`\n${red} - INSTALL FAILED!`);
  run("rm -rf base_arm64");
  run("rm -f /data/data/com.termux/files/usr/bin/win10arm.sh");
  process.exit(1);
}