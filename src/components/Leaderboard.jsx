import React, { useState, useEffect } from "react";

const GAMES = [
  { id: "snowfall", name: "Snowfall" },
  { id: "poker-duel", name: "Poker Duel" },
  { id: "ragnar-edition", name: "Ragnar Edition" },
  { id: "trade--clash", name: "Trade Clash" },
  { id: "list-of-ragnar", name: "List of Ragnar" },
];

const REALISTIC = [
  "0x3F1aE4bC9D2eF017aB3c4D5E6F7a8B9C0d1E2F3A",
  "0xA7c8D9eF0A1bC2d3E4f5A6b7C8d9E0f1A2b3C4D5",
  "0xB1d2E3f4A5b6C7d8E9f0A1b2C3d4E5f6A7b8C9D0",
  "0xC2e3F4a5B6c7D8e9F0a1B2c3D4e5F6a7B8c9D0E1",
  "0xD3f4A5b6C7d8E9f0A1b2C3d4E5f6A7b8C9d0E1F2",
  "0xE4a5B6c7D8e9F0a1B2c3D4e5F6a7B8c9D0e1F2A3",
  "0xF5b6C7d8E9f0A1b2C3D4e5F6a7B8c9D0E1f2A3B4",
  "0x0617D8e9F0a1B2c3D4e5F6a7B8c9D0E1f2A3B4C5",
  "0x1728E9f0A1b2C3d4E5f6A7b8C9d0E1F2a3B4C5D6",
  "0x2839F0a1B2c3D4e5F6a7B8c9D0e1F2A3b4C5D6E7",
];

export default function Leaderboard({ account }) {
  const [selectedGame, setSelectedGame] = useState(GAMES[0].id);
  const [loading, setLoading] = useState(false);

  const top10 = REALISTIC.slice(0, 10).map((addr, idx) => ({
    rank: idx + 1,
    player: `${addr.slice(0, 6)}…${addr.slice(-4)}`,
    points: 0,
  }));

  const yourRank = "You";
  const yourPoints = 0;

  const lastUpdated = new Date().toLocaleString();
  const nextRewards = new Date(Date.now() + 6 * 3600_000).toLocaleString();

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(t);
  }, [selectedGame]);

  return (
    <div className="p-6 bg-gray-800 rounded-xl shadow-lg space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
        <h2 className="text-xl text-gray-100 font-semibold">Leaderboard</h2>
        <div className="text-gray-400 text-sm space-x-4">
          <span>Next Updated: {lastUpdated}</span>
          <span>Rewards: {nextRewards}</span>
        </div>
      </div>

      <select
        value={selectedGame}
        onChange={(e) => setSelectedGame(e.target.value)}
        className="bg-gray-700 text-gray-200 px-3 py-2 rounded-lg"
      >
        {GAMES.map((g) => (
          <option key={g.id} value={g.id}>
            {g.name}
          </option>
        ))}
      </select>

      {loading ? (
        <p className="text-gray-400 italic">Loading leaderboard…</p>
      ) : (
        <>
          <div className="overflow-y-auto max-h-[42vh] rounded-lg">
            <table className="w-full bg-gray-700 rounded-lg overflow-hidden">
              <thead className="bg-gray-600">
                <tr>
                  <th className="p-2 text-left text-gray-300 uppercase">#</th>
                  <th className="p-2 text-left text-gray-300 uppercase">
                    Player
                  </th>
                  <th className="p-2 text-left text-gray-300 uppercase">
                    Points
                  </th>
                </tr>
              </thead>
              <tbody>
                {account && (
                  <tr className="bg-green-900">
                    <td className="px-3 py-2 text-white font-semibold">
                      {yourRank}
                    </td>
                    <td className="px-3 py-2 text-white font-semibold break-all">
                      {account}
                    </td>
                    <td className="px-3 py-2 text-white font-semibold">
                      {yourPoints}
                    </td>
                  </tr>
                )}
                {top10.map((entry) => (
                  <tr
                    key={entry.rank}
                    className={
                      entry.rank === 1
                        ? "bg-gray-500"
                        : entry.rank % 2 === 0
                        ? "bg-gray-700"
                        : "bg-gray-600"
                    }
                  >
                    <td className="px-3 py-2 text-gray-200">{entry.rank}</td>
                    <td className="px-3 py-2 text-indigo-300">
                      {entry.player}
                    </td>
                    <td className="px-3 py-2 text-yellow-300">
                      {entry.points}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
