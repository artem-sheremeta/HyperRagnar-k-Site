// src/App.jsx

import React, { useState, useEffect } from "react";
import { fetchMidPricesFromHyperliquid } from "./services/hyperliquid";
import ConnectWallet from "./components/ConnectWallet";
import Games from "./components/Games";
import MyProfile from "./components/MyProfile";
import Leaderboard from "./components/Leaderboard";
import "./styles/app.css";

export default function App() {
  const [account, setAccount] = useState(null);
  const [balances, setBalances] = useState({
    hype: null,
    wHype: null,
    hypr: null,
  });

  const [priceHype, setPriceHype] = useState(null);
  const [isFetchingPrice, setIsFetchingPrice] = useState(false);

  const [activeTab, setActiveTab] = useState("games");

  useEffect(() => {
    const minWidth = 980;
    const minHeight = 540;

    function checkSize() {
      const tooNarrow = window.innerWidth < minWidth;
      const tooShort = window.innerHeight < minHeight;

      if (tooNarrow || tooShort) {
        document.body.innerHTML = `
          <div style="
            padding: 2rem;
            text-align: center;
            font-size: 1.25rem;
            color: #eee;
            background: #111;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            This site only supports screens
            of ${minWidth}px in width<br>
            and ${minHeight}px in height 😔
          </div>
        `;
      }
    }

    checkSize();
    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, []);

  useEffect(() => {
    let intervalId;

    const updatePrices = async () => {
      try {
        setIsFetchingPrice(true);
        const hyperData = await fetchMidPricesFromHyperliquid(["HYPE"]);
        setPriceHype(hyperData.HYPE);
      } catch (err) {
        console.error("Error updating HYPE price:", err);
        setPriceHype(null);
      } finally {
        setIsFetchingPrice(false);
      }
    };

    updatePrices();
    intervalId = setInterval(updatePrices, 60 * 1000);
    return () => clearInterval(intervalId);
  }, []);

  const formatPrice = (price) => {
    if (price == null) return "--";
    if (price < 1) {
      return Number(price).toLocaleString(undefined, {
        minimumFractionDigits: 4,
        maximumFractionDigits: 6,
      });
    }
    return Number(price).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const backgroundImageUrl = "./images/background.png";
  const tabs = [
    { key: "games", label: "Games" },
    { key: "leaderboard", label: "Leaderboard" },
    { key: "my-profile", label: "Profile" },
    { key: "staking", label: "Staking", disabled: true },
  ];

  return (
    <div
      className="min-h-screen relative overflow-hidden bg-no-repeat bg-center"
      style={{
        backgroundImage: `url(${backgroundImageUrl})`,
        backgroundSize: "100% auto",
      }}
    >
      {/* 1) LIVE-course HYPE + SOON */}
      <div
        className="
    fixed top-4 left-4 z-50
    bg-gray-90
    flex flex-wrap justify-center items-center
    px-2 py-1
    sm:px-3 sm:py-2
    md:px-5 md:py-3
    rounded-md
    sm:rounded-lg
    md:rounded-xl
    text-xs
    sm:text-sm
    md:text-base
    space-x-1 sm:space-x-2 md:space-x-4
    shadow-lg
  "
      >
        <img src="./images/logo.svg" alt="Logo" className="w-6 h-6" />
        <span className="text-gray-200 font-medium">HYPE:</span>
        {isFetchingPrice ? (
          <span className="text-gray-400 italic">Loading…</span>
        ) : (
          <span className="text-green-400 font-semibold">
            ${formatPrice(priceHype)}
          </span>
        )}
        <span className="text-gray-200 font-medium">⏳ SOON: soon</span>
      </div>

      {/* 2) ConnectWallet*/}
      <div className="fixed top-4 right-4 flex items-center space-x-2 z-50">
        <ConnectWallet
          onAccountChange={setAccount}
          onBalancesChange={setBalances}
        />
      </div>

      {/* 3) Central window with tabs */}
      <div className="flex items-center justify-center h-screen px-4">
        <div
          className="
          w-full sm:w-[95%] md:w-4/5 lg:w-2/3 max-w-[1400px]
          h-[80vh]
          3xl:h-[70vh]
         bg-gray-800/50 backdrop-blur-lg
         ring-1 ring-white/20 rounded-3xl
          p-6 sm:p-8 shadow-2xl flex flex-col
           "
        >
          {/* 3.1) Tabs */}
          <div className="tabs-container flex gap-2 mb-6 items-center">
            {tabs.map(({ key, label, disabled }) => {
              const isActive = activeTab === key;
              return (
                <button
                  key={key}
                  onClick={() => {
                    if (!disabled) setActiveTab(key);
                  }}
                  disabled={disabled}
                  className={`
          flex-1
          py-3 px-4
          rounded-lg
          text-sm font-semibold
          transition duration-200 ease-out
          relative

          ${
            disabled
              ? "bg-gray-700 text-gray-500 opacity-50 cursor-not-allowed pointer-events-none"
              : isActive
              ? "bg-gray-700 text-white"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
          }
        `}
                >
                  {label}

                  {!disabled && isActive && (
                    <span
                      className="
            absolute bottom-0 left-0 right-0
            h-1 bg-gradient-to-r from-white via-indigo-300 to-white
            rounded-t-md
          "
                    />
                  )}
                </button>
              );
            })}
            {/* праворуч: Rules & Docs */}
            <div className="ml-auto flex items-center space-x-2">
              <button
                onClick={() =>
                  window.open(
                    "https://hyperragnarok.gitbook.io/hyperragnarok-docs/rules",
                    "_blank"
                  )
                }
                className="
                    flex items-center justify-center
                    py-3 px-4
                    rounded-lg
                    text-gray-300
                    border border-white/20
                    transition duration-200 ease-out
                    hover:bg-white/10 hover:text-white hover:shadow-lg
        "
              >
                Rules
              </button>
              <button
                onClick={() =>
                  window.open(
                    "https://hyperragnarok.gitbook.io/hyperragnarok-docs",
                    "_blank"
                  )
                }
                className="
                    flex items-center justify-center
                    py-3 px-4
                    rounded-lg
                    text-gray-300
                    border border-white/20
                    transition duration-200 ease-out
                    hover:bg-white/10 hover:text-white hover:shadow-lg
        "
              >
                Docs
              </button>
            </div>
            <a
              href="https://x.com/HyperRagnarokk"
              target="_blank"
              rel="noopener"
              title="Follow us on Twitter"
              className={`
                    flex items-center justify-center
                    py-3 px-4
                    rounded-lg
                    text-gray-300
                    border border-white/20
                    transition duration-200 ease-out
                    hover:bg-white/10 hover:text-white hover:shadow-lg
               `}
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5">
                <path
                  fill="currentColor"
                  d="M22.46 6c-.77.35-1.6.58-2.46.69a4.3 4.3 0 001.88-2.37 8.59 8.59 0 01-2.72 1.04 4.28 4.28 0 00-7.3 3.9A12.14 12.14 0 013 4.9a4.28 4.28 0 001.33 5.72 4.26 4.26 0 01-1.94-.54v.06a4.28 4.28 0 003.43 4.19 4.3 4.3 0 01-1.93.07 4.28 4.28 0 004 2.97A8.6 8.6 0 012 19.54a12.13 12.13 0 006.56 1.92c7.88 0 12.2-6.53 12.2-12.2v-.56A8.7 8.7 0 0024 5.54a8.43 8.43 0 01-2.54.7z"
                />
              </svg>
            </a>
          </div>

          <div className="flex-2 bg-gray-700/60 backdrop-blur-sm rounded-md overflow-hidden">
            {activeTab === "games" && (
              <Games account={account} onGameClick={() => {}} />
            )}
            {activeTab === "leaderboard" && <Leaderboard account={account} />}
            {activeTab === "docs" && (
              <div className="p-6 overflow-y-auto text-gray-200"></div>
            )}
            {activeTab === "my-profile" && (
              <div className="h-full flex items-center justify-center text-gray-200">
                {!account ? (
                  <p className="text-lg font-medium">Connect Wallet 🔗</p>
                ) : (
                  <MyProfile account={account} balances={balances} />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
