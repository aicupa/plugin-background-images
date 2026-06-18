const { createPlugin } = require("@aicupa/api");
const path = require("path");
const os = require("os");
const fs = require("fs");

const configPath = path.join(os.homedir(), ".todoListNative.json");
const API_BASE = "http://api.nekosapi.com/v4/images";

function loadConfig() {
  try {
    return JSON.parse(fs.readFileSync(configPath, "utf-8"));
  } catch (_) {
    return {};
  }
}

function saveConfig(data) {
  fs.writeFileSync(configPath, JSON.stringify(data));
}

module.exports = createPlugin((api) => {
  return {
    async fetchImages({ offset = 0, limit = 6, rating } = {}) {
      try {
        const params = new URLSearchParams({
          limit: String(limit),
          offset: String(offset),
        });
        if (rating) {
          params.set("rating", rating);
        }
        const url = `${API_BASE}?${params.toString()}`;
        const res = await fetch(url);
        if (!res.ok) {
          return { ok: false, error: `API error: ${res.status}` };
        }
        const data = await res.json();
        return { ok: true, result: data };
      } catch (e) {
        return { ok: false, error: e.message || "Failed to fetch images" };
      }
    },

    getBackgroundImage() {
      const config = loadConfig();
      return { ok: true, result: { url: config.backgroundImage || "" } };
    },

    async applyBackgroundImage({ url, filePath }) {
      if (!url) {
        return { ok: false, error: "No image selected" };
      }

      const config = loadConfig();
      config.backgroundImage = url;
      saveConfig(config);
      api.relaunch();

      return { ok: true, result: { url } };
    },
  };
});
