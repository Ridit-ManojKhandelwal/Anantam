const http = require("http");
const express = require("express");
const { Server: SocketServer } = require("socket.io");
const os = require("os");
const pty = require("node-pty");

function startServer() {
  console.log("starting");

  const shell = os.platform() === "win32" ? "powershell.exe" : "bash";
  const env = { ...process.env, PATH: process.env.PATH }; // Ensure correct PATH in environment

  let ptyProcess = pty.spawn(shell, [], {
    name: "xterm-color",
    rows: 80,
    cols: 100,
    cwd: process.env.INIT_CWD,
    env: env,
  });

  const app = express();
  const server = http.createServer(app);

  const io = new SocketServer(server, {
    cors: {
      origin: "*", // Adjust this for production as needed
    },
  });

  // Terminal data handler
  ptyProcess.onData((data) => {
    io.emit("terminal:data", data);
  });

  // Handle socket connection
  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    const handleTerminalWrite = (data) => {
      console.log("Received data to write in terminal: ", data);
      if (ptyProcess) {
        try {
          ptyProcess.write(data);
        } catch (err) {
          console.error("Error writing to terminal:", err);
        }
      }
    };

    // Handle terminal input
    socket.on("terminal:write", handleTerminalWrite);

    // Handle directory change and spawn new terminal process
    socket.on("terminal:dir", (dirPath) => {
      try {
        if (ptyProcess) {
          ptyProcess.kill(); // Kill existing process if it exists
          ptyProcess = null; // Ensure it's marked as null
        }

        // Spawn a new terminal process with the provided directory
        ptyProcess = pty.spawn(shell, [], {
          name: "xterm-color",
          rows: 80,
          cols: 100,
          cwd: dirPath,
          env: env,
        });

        ptyProcess.onData((data) => {
          io.emit("terminal:data", data);
        });
      } catch (err) {
        console.error("Error handling terminal directory change:", err);
      }
    });

    // Handle terminal resize
    socket.on("terminal:resize", (data) => {
      console.log("Received resize data: ", data);
      const { cols, rows } = data;
      if (ptyProcess) {
        try {
          ptyProcess.resize(cols, rows); // Resize the terminal
        } catch (err) {
          console.error("Error resizing terminal:", err);
        }
      }
    });

    // Handle socket disconnection
    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.id}`);
      if (ptyProcess) {
        try {
          ptyProcess.kill();
          ptyProcess = null;
        } catch (err) {
          console.error("Error killing terminal on disconnect:", err);
        }
      }
    });
  });

  server.listen(4580, () => console.log("Server is running on port 4580"));

  // Graceful shutdown handling
  process.on("SIGINT", () => {
    console.log("Shutting down...");
    if (ptyProcess) {
      try {
        ptyProcess.kill();
        ptyProcess = null;
      } catch (err) {
        console.error("Error during shutdown:", err);
      }
    }
    server.close(() => {
      console.log("Server closed");
      process.exit(0);
    });
  });
}

export default startServer;
