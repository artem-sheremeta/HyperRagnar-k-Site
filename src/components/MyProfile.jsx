import React from "react";

const defaultGameStats = [
  { game: "Snowfall", leaderboard: "# –", points: 0, rewards: "0 HYPE" },
  { game: "Poker Duel", leaderboard: "# –", points: 0, rewards: "0 HYPE" },
  { game: "Ragnar Edition", leaderboard: "# –", points: 0, rewards: "0 HYPE" },
  { game: "Trade Clash", leaderboard: "# –", points: 0, rewards: "0 HYPE" },
  { game: "Last of Ragnar", leaderboard: "# –", points: 0, rewards: "0 HYPE" },
  { game: "Coming Soon", leaderboard: "–", points: "–", rewards: "–" },
];

export default function MyProfile({
  account,
  balances = {},
  gameStats = defaultGameStats,
  onConnect,
}) {
  if (!account) {
    return (
      <div className="flex justify-center items-center h-64">
        <button
          onClick={onConnect}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
        >
          Connect Wallet
        </button>
      </div>
    );
  }

  const {
    hype = null,
    wHype = null,
    hypr: hypers = null,
    extraNft = null,
  } = balances;

  const copyAddress = () => navigator.clipboard.writeText(account);

  return (
    <div className="flex justify-center px-4 py-6">
      <div
        className="
          bg-gray-800 rounded-2xl shadow-xl
          w-full max-w-1xl
          p-6
          max-h-[calc(100vh-20rem)]  
          overflow-y-auto
        "
      >
        {/* ADDRESS */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <code className="font-mono text-gray-100 text-base break-all">
            {account}
          </code>
          <button
            onClick={copyAddress}
            className="mt-2 sm:mt-0 text-gray-400 hover:text-gray-200"
            title="Copy address"
          >
            📋
          </button>
        </div>

        {/* BALANCES */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: "HYPE", value: hype, color: "text-green-400", dec: 3 },
            { label: "wHYPE", value: wHype, color: "text-yellow-300", dec: 3 },
            {
              label: "HYPERS NFT",
              value: hypers,
              color: "text-indigo-300",
              dec: 0,
            },
            {
              label: "HyperRagnarök NFT",
              value: extraNft,
              color: "text-purple-300",
              dec: 0,
            },
          ].map(({ label, value, color, dec }) => (
            <div
              key={label}
              className="bg-gray-700 rounded-lg p-3 sm:p-4 flex flex-col items-center"
            >
              <div className="text-xs text-gray-400 uppercase">{label}</div>
              <div className={`mt-1 font-semibold ${color} text-lg`}>
                {value != null ? Number(value).toFixed(dec) : "0"}
              </div>
            </div>
          ))}
        </div>

        {/* GAME STATISTICS */}
        <div>
          <h2 className="text-gray-100 text-lg font-semibold mb-4">
            Game Statistics
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full table-fixed bg-gray-700 rounded-lg">
              <thead className="bg-gray-600">
                <tr>
                  {["Game", "Leaderboard", "Points", "Rewards"].map((h) => (
                    <th
                      key={h}
                      className="p-2 text-left text-xs text-gray-300 uppercase"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {gameStats.map((row, i) => (
                  <tr
                    key={row.game}
                    className={i % 2 === 0 ? "bg-gray-700" : "bg-gray-600"}
                  >
                    <td className="px-3 py-2 text-gray-200">{row.game}</td>
                    <td className="px-3 py-2 text-green-300">
                      {row.leaderboard}
                    </td>
                    <td className="px-3 py-2 text-yellow-300">{row.points}</td>
                    <td className="px-3 py-2 text-purple-300">{row.rewards}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
