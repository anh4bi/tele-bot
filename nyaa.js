import { Nyaa } from "@ejnshtein/nyaasi";

const HOT = "https://sukebei.nyaa.si";
const nya = new Nyaa({ host: HOT, apiHost: +"/api" });

class NyaaService {
  constructor(torrents) {
    this.torrents = torrents;
  }

  async getTorrent(keyword) {
    const result = await nya.search({
      title: keyword,
      category: "0_0",
      s: "seeders",
      o: "desc",
    });
    return result.torrents;
  }

  async findTorrents(keyword) {
    const tors = await this.getTorrent(keyword);
    this.torrents.push(...tors);
    return tors.map((el) => ({
      id: el.id,
      name: el.name,
      seed: el.stats.seeders,
      leech: el.stats.leechers,
      magnet: el.links.magnet,
    }));
  }

  async getTorrentById(id) {
    console.log("GET: ", id, this.torrents);
    return this.torrents.find((el) => el.id == id);
  }
}

export default NyaaService;
