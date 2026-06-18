const { createPlugin } = require("@aicupa/api");

const API_BASE = "http://api.nekosapi.com/v4/images";

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

    async getBackgroundImage() {
      const config = (await api.getConfig()) || {};
      return {
        ok: true,
        result: {
          url: config.backgroundImage || "",
          backgroundSize: config.backgroundSize || "cover",
        },
      };
    },

    async applyBackgroundImage({ url, backgroundSize }) {
      if (!url) {
        return { ok: false, error: "No image selected" };
      }

      await api.setBackground({
        backgroundImage: url,
        backgroundSize: backgroundSize || "cover",
      });
      return { ok: true, result: { url } };
    },
  };
});
