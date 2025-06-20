import React from "react";

export default function Games({ account }) {
  const gameList = [
    {
      id: "game1",
      label: "Snowfall",
      img: "./images/snowfall.png",
      preview: null,
      status: "New",
      startDate: "2025-06-20T12:00:00Z",
    },
    {
      id: "game2",
      label: "Poker Duel",
      img: "./images/pokerDuel.png",
      preview: null,
      status: "New",
      startDate: "2025-06-20T12:00:00Z",
    },
    {
      id: "game3",
      label: "Ragnar Edition",
      img: "./images/ragnarEdition.png",
      preview: null,
      status: "New",
      startDate: "2025-06-20T12:00:00Z",
    },
    {
      id: "game4",
      label: "Trade Clash",
      img: "./images/tradeClash.png",
      preview: null,
      status: "New",
      startDate: "2025-06-20T12:00:00Z",
    },
    {
      id: "game5",
      label: "Last of Ragnar",
      img: "./images/lastOfRagnar.png",
      preview: null,
      status: "New",
      startDate: "2025-06-20T12:00:00Z",
    },
    {
      id: "soon",
      label: "Coming Soon",
      img: "./images/soon.png",
      preview: null,
      status: "Soon",
    },
  ];

  const formatStartDate = (dateStr) => {
    const date = new Date(dateStr);
    date.setUTCDate(date.getUTCDate() + 2);
    const formatter = new Intl.DateTimeFormat("uk-UA", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC",
      hour12: false,
    });

    return formatter.format(date) + " UTC";
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 rounded-lg">
      {gameList.map(({ id, label, img, preview, status, link, startDate }) => (
        <div
          key={id}
          className="
          relative
          bg-white/10 backdrop-blur-sm
          border border-white/20
          rounded-xl
          overflow-hidden
          shadow-md
          transition-transform duration-200 ease-out
          hover:scale-102 hover:shadow-xl
        "
        >
          <div className="relative w-full aspect-w-16 aspect-h-9 bg-gray-900 group">
            {preview ? (
              <video
                src={preview}
                className="absolute inset-0 w-full h-full object-cover"
                muted
                loop
                autoPlay
                playsInline
              />
            ) : (
              <img
                src={img}
                alt={label}
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
              />
            )}

            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-colors" />

            <button
              onClick={(e) => {
                e.stopPropagation();
                if (!account) {
                  alert("Please connect your wallet.");
                  return;
                }
                if (link) {
                  window.open(link, "_blank");
                }
              }}
              disabled={!link}
              className={`
                  absolute inset-0 flex items-center justify-center transition-opacity duration-200
                  opacity-0 group-hover:opacity-100
                  ${link ? "cursor-pointer" : "cursor-not-allowed"}
                `}
            >
              <span
                className={`
                    px-4 py-2 rounded text-white font-semibold text-sm
                    ${
                      link ? "bg-indigo-600 hover:bg-indigo-500" : "bg-gray-600"
                    }
                  `}
              >
                {link
                  ? "Play"
                  : startDate
                  ? formatStartDate(startDate)
                  : "Soon"}
              </span>
            </button>
          </div>

          <div className="w-full py-2 bg-gray-900 text-center">
            <span className="text-gray-300 text-sm">{label}</span>
          </div>

          {status && (
            <span
              className={`
                  absolute top-2 right-2 text-xs px-2 py-1 rounded
                  ${
                    status === "Soon"
                      ? "bg-gray-600 text-white"
                      : "bg-green-500 text-white"
                  }
                `}
            >
              {status === "Soon" ? "Soon" : "New"}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
