import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

const W_HYPE_ADDRESS = "0x5555555555555555555555555555555555555555";
const HYPR_NFT_ADDRESS = "0x9Be117D27f8037F6f549903C899e96E5755e96db";

const ERC20_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function decimals() view returns (uint8)",
];
const ERC721_ABI = ["function balanceOf(address owner) view returns (uint256)"];

export default function ConnectWallet({
  onAccountChange = () => {},
  onBalancesChange = () => {},
}) {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [network, setNetwork] = useState(null);
  const [totalBalance, setTotalBalance] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const [menuOpen, setMenuOpen] = useState(false);

  const [rawNative, setRawNative] = useState(null);
  const [rawWrapped, setRawWrapped] = useState(null);
  const [hyprCount, setHyprCount] = useState(null);

  const [fmtNative, setFmtNative] = useState(null);
  const [fmtWrapped, setFmtWrapped] = useState(null);

  useEffect(() => {
    if (!window.ethereum) {
      setErrorMessage("Install MetaMask or another Web3 wallet");
      return;
    }
    const ethProvider = new ethers.providers.Web3Provider(
      window.ethereum,
      "any"
    );
    setProvider(ethProvider);

    ethProvider
      .listAccounts()
      .then((accs) => {
        if (accs.length) handleAccountsChanged(accs);
      })
      .catch(() => {});

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", () => window.location.reload());

    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum.removeListener("chainChanged", () => {});
    };
  }, []);

  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      setAccount(null);
      setNetwork(null);
      onAccountChange(null);
    } else {
      const addr = ethers.utils.getAddress(accounts[0]);
      setAccount(addr);
      onAccountChange(addr);
      provider.getNetwork().then((net) => setNetwork(net));
    }
  };

  useEffect(() => {
    if (!provider || !account) {
      setRawNative(null);
      setRawWrapped(null);
      setHyprCount(null);
      setFmtNative(null);
      setFmtWrapped(null);
      return;
    }

    provider
      .getBalance(account)
      .then((bn) => {
        setRawNative(bn.toString());
        setFmtNative(Number(ethers.utils.formatEther(bn)));
      })
      .catch(() => {
        setRawNative(null);
        setFmtNative(null);
      });

    const wContract = new ethers.Contract(W_HYPE_ADDRESS, ERC20_ABI, provider);
    wContract
      .balanceOf(account)
      .then((bn) => {
        setRawWrapped(bn.toString());
        return wContract.decimals().then((dec) => {
          setFmtWrapped(Number(ethers.utils.formatUnits(bn, dec)));
        });
      })
      .catch(() => {
        setRawWrapped(null);
        setFmtWrapped(null);
      });

    const nftContract = new ethers.Contract(
      HYPR_NFT_ADDRESS,
      ERC721_ABI,
      provider
    );
    nftContract
      .balanceOf(account)
      .then((countBN) => {
        setHyprCount(countBN.toNumber());
      })
      .catch(() => {
        setHyprCount(null);
      });
    setMenuOpen(false);
  }, [provider, account, network]);

  useEffect(() => {
    if (fmtNative != null || fmtWrapped != null || hyprCount != null) {
      onBalancesChange({
        hype: fmtNative,
        wHype: fmtWrapped,
        hypr: hyprCount,
      });
    }
  }, [fmtNative, fmtWrapped, hyprCount]);

  useEffect(() => {
    if (fmtNative != null && fmtWrapped != null) {
      setTotalBalance(fmtNative + fmtWrapped);
    } else {
      setTotalBalance(null);
    }
  }, [fmtNative, fmtWrapped]);

  const connect = async () => {
    if (!provider) return;
    try {
      setErrorMessage("");
      await provider.send("eth_requestAccounts", []);
    } catch (err) {
      if (err.code === 4001) setErrorMessage("Підключення відхилено");
      else setErrorMessage(err.message);
    }
  };

  const disconnect = async () => {
    setAccount(null);
    setNetwork(null);
    onAccountChange(null);

    if (window.ethereum.request) {
      window.ethereum
        .request({
          method: "wallet_revokePermissions",
          params: [{ eth_accounts: {} }],
        })
        .catch(() => {});
    }
  };

  return (
    <div className="flex flex-col items-center z-50">
      {account ? (
        <div
          className="
          bg-gray-90
          flex flex-wrap justify-center items-center
          px-2 py-1        /* mobile padding */
          sm:px-3 sm:py-2  /* small screens */
          md:px-5 md:py-3  /* medium and up */
          rounded-md       /* mobile radius */
          sm:rounded-lg    /* small */
          md:rounded-xl    /* medium+ */
          text-xs           /* mobile font */
          sm:text-sm        /* small */
          md:text-base      /* medium+ */
          space-x-1 sm:space-x-2 md:space-x-4
        "
        >
          {/* Balance */}
          <span className="font-mono text-green-400">
            {totalBalance != null ? totalBalance.toFixed(3) : "—"}
          </span>

          {/* Logo */}
          <img
            src="./images/logo.svg"
            alt="Logo"
            className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6"
          />

          {/* Address + Arrow */}
          <button
            onClick={() => setMenuOpen((p) => !p)}
            className="flex items-center space-x-1"
          >
            <span className="font-mono truncate max-w-[6ch] sm:max-w-[8ch] md:max-w-none">
              {account.slice(0, 6)}…{account.slice(-4)}
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-gray-200 transform transition-transform ${
                menuOpen ? "rotate-180" : ""
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {/* Disconnect */}
          {menuOpen && (
            <button
              onClick={disconnect}
              className="
              w-full sm:w-auto
              bg-red-600 hover:bg-red-700
              text-white font-medium
              px-2 py-1 sm:px-3 sm:py-2 md:px-4 md:py-2
              rounded-md sm:rounded-lg md:rounded-xl
              mt-1 sm:mt-0 md:mt-1
            "
            >
              Disconnect
            </button>
          )}
        </div>
      ) : (
        <button
          onClick={connect}
          className="
    fixed top-4 right-4 z-50

    bg-gray-700 hover:bg-gray-600

    text-white hover:text-gray-200

    font-semibold

    px-[clamp(0.5rem,4vw,1.25rem)]
    py-[clamp(0.25rem,2vw,0.75rem)]
    text-[clamp(0.75rem,2vw,1rem)]

    rounded-[clamp(0.25rem,1vw,0.75rem)]

    shadow-lg active:shadow-inner

    transition-colors duration-150 ease-out
  "
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
}
