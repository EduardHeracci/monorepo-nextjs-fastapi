const { spawn } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const environment = process.argv[2] || "local";

const allowedEnvironments = ["production", "local_production", "local"];

// Define the root directory where the Dockerfile.production is located
const rootDirectory = path.resolve(__dirname);

generateEnvFile(environment);

if (environment === "local") {
  process.exit(0);
}
// Command to build the Docker image
const buildCommand = "docker";
const buildArgs = [
  "build",
  "--no-cache",
  "-f",
  "Dockerfile.production",
  ".",
  "-t",
  "goldcity-img:latest",
];

// Execute the Docker build command within the root directory
const buildProcess = spawn(buildCommand, buildArgs, { cwd: rootDirectory });

// Listen to stderr for any errors or warnings
buildProcess.stderr.on("data", (data) => {
  console.error(`stderr: ${data}`);
});

// Handle the process exit event
buildProcess.on("close", (code) => {
  if (code === 0) {
    console.log("Docker build completed successfully!");
  } else {
    console.error(`Docker build process exited with code ${code}`);
  }
});

function generateEnvFile(environment) {
  if (!allowedEnvironments.includes(environment)) {
    throw Error("invalid environment");
  }

  const envConfig = {
    production: {
      NEXT_PUBLIC_DIRECTUS_URL:
        "https://goldcity-container.afk1ilfguv2qq.ap-southeast-1.cs.amazonlightsail.com/directus/",
      NEXT_PUBLIC_DIRECTUS_BASE_URL:
        "https://goldcity-container.afk1ilfguv2qq.ap-southeast-1.cs.amazonlightsail.com/directus/",
      NEXT_AUTH_URL:
        "https://goldcity-container.afk1ilfguv2qq.ap-southeast-1.cs.amazonlightsail.com/login",
      NEXT_PUBLIC_DIR_URL: "http://localhost:8055/",
      NEXT_PUBLIC_URL:
        "https://goldcity-container.afk1ilfguv2qq.ap-southeast-1.cs.amazonlightsail.com",
      WEBSOCKET_URL:
        "wss://goldcity-container.afk1ilfguv2qq.ap-southeast-1.cs.amazonlightsail.com/directus/websocket",
    },
    local: {
      NEXT_PUBLIC_FAST_API_URL: "http://localhost/backend/",
      NEXT_PUBLIC_FAST_API_BASE_URL: "http://localhost/backend/",
      NEXT_PUBLIC_DIR_URL: "http://backend:8055/",
      NEXT_PUBLIC_URL: "http://localhost",
      NEXT_AUTH_URL: "http://localhost/",
    //   WEBSOCKET_URL: "ws://localhost/directus/websocket",
    },
    local_production: {
      NEXT_PUBLIC_DIRECTUS_URL: "http://localhost/directus/",
      NEXT_PUBLIC_DIRECTUS_BASE_URL: "http://localhost/directus/",
      NEXT_PUBLIC_DIR_URL: "http://localhost:8055/",
      NEXT_PUBLIC_APP_URL: "http://localhost/",
      NEXT_AUTH_URL: "http://localhost/",
      WEBSOCKET_URL: "ws://localhost/directus/websocket",
    },
  };

  const content = Object.keys(envConfig[environment])
    .map((key) => {
      return `${key}=${envConfig[environment][key]}`;
    })
    .join("\n");

  // Update env file from frontend
  const frontendEnvPath = path.resolve(path.join(rootDirectory, "frontend"), ".env");

  fs.writeFileSync(frontendEnvPath, content);

  console.log(`${environment} file was updated at ${frontendEnvPath}`);
}
