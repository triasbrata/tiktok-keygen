/**
 * this code converted from this repository
 * https://github.com/Loukious/StreamLabsTikTokStreamKeyGenerator
 */
import axios from "axios";

export class TiktokStreaming {
  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  async search(
    game: string
  ): Promise<{ full_name: string; game_mask_id: string }[]> {
    if (!game) return [];
    try {
      const response = await axios.get(
        `https://streamlabs.com/api/v5/slobs/tiktok/info?category=${encodeURIComponent(
          game
        )}`,
        {
          headers: { Authorization: `Bearer ${this.token}` },
        }
      );
      const categories = response.data.categories;
      categories.push({ full_name: "Other", game_mask_id: "" });
      return categories;
    } catch (error) {
      console.error("Error fetching game categories:", error);
      return [];
    }
  }

  async start(
    title: string,
    category: string,
    token: string
  ): Promise<{ rtmp: string; key: string; streamId: string }> {
    try {
      const response = await axios.post(
        "https://streamlabs.com/api/v5/slobs/tiktok/stream/start",
        {
          title,
          device_platform: "win32",
          category,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = response.data;
      return { rtmp: data.rtmp, key: data.key, streamId: data.id };
    } catch (error) {
      console.error("Error starting stream:", error);
      throw new Error("Failed to start stream.");
    }
  }

  async end(streamId: string, token: string): Promise<boolean> {
    try {
      const response = await axios.post(
        `https://streamlabs.com/api/v5/slobs/tiktok/stream/${streamId}/end`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return response.data.success;
    } catch (error) {
      console.error("Error ending stream:", error);
      return false;
    }
  }
}
