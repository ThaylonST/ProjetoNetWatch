const { exec } = require("child_process");

function ping(ip) {
  return new Promise((resolve) => {
    exec(`ping -n 1 ${ip}`, (error, stdout) => {
      if (error) {
        return resolve({ status: "offline", latency: null });
      }

      const match = stdout.match(/Tempo=(\d+)ms/);

      if (match) {
        resolve({
          status: "online",
          latency: Number(match[1]),
        });
      } else {
        resolve({ status: "offline", latency: null });
      }
    });
  });
}

module.exports = ping;
