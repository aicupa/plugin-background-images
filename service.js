const API_BASE = "http://api.nekosapi.com/v4/images";

/**
 * @param {import('@aicupa/api').PluginApi} api
 * @returns {import('@aicupa/api').Plugin}
 */
module.exports = (api) => {
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
        const res = await api.fetch(url);
        if (!res.ok) {
          return { ok: false, error: `API error: ${res.status}` };
        }
        const data = res.body;
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

    async openLink({ url }) {
      await api.openLink(url);
      return { ok: true };
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
};
