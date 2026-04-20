const SHORT_URL = "https://tinyurl.com/2cnj72yj";

// Check SSLONLY env variable (like your bash logic)
if (!process.env.SSLONLY) {
  console.log("\n\nNavigate to this URL:\n");
  console.log(SHORT_URL);
} else {
  console.log("SSLONLY is set, skipping URL output.");
}

console.log("\nPress Ctrl-C to exit 🛑\n");

// Keep process alive
const interval = setInterval(() => {}, 1000);

// Handle Ctrl+C properly
process.on("SIGINT", () => {
  console.log("\nStopping... 🛑");
  clearInterval(interval);
  process.exit(0);
});
