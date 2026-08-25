"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "../components/Navbar";
import { WalletModal } from "../components/WalletModal";
import {
  ShieldAlert,
  Bug,
  Cpu,
  RefreshCw,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Sparkles,
  ArrowRight,
  Globe,
  Check,
  Copy,
  Layers,
  HelpCircle,
  PlayCircle,
  X,
  ChevronDown,
  ChevronUp,
  Info,
  Wallet,
  ShieldCheck,
  Award,
  FileCheck,
  Scale,
  Zap,
} from "lucide-react";

export default function Home() {
  const [role, setRole] = useState<"protocol" | "researcher">("protocol");
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  const [showWelcomeGuide, setShowWelcomeGuide] = useState<boolean>(true);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState<boolean>(false);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  // Web3 Wallet state
  const [account, setAccount] = useState<string | null>(null);

  // Deployed Contract Addresses on StudioNet
  const arbiterAddress = "0x0c88a8916A09464d00f265fe6349E4C13EF7296c";
  const factoryAddress = "0xf3696DF739f725951DaEC63488FB5D9B1719Ee50";

  // Vault state
  const [vaultState, setVaultState] = useState({
    protocolName: "Aegis Vault Alpha",
    bountyPool: "10.00",
    securityCharter: "In-scope: Reentrancy, unauthorized fund drain, oracle price manipulation, and contract freeze. Out-of-scope: UI bugs and DDoS.",
    criticalBps: 5000, // 50%
    highBps: 2000,     // 20%
    mediumBps: 500,    // 5%
    totalReports: 1,
  });

  // Active Report state
  const [reportState, setReportState] = useState({
    reportId: "0",
    researcher: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    title: "Critical reentrancy vulnerability in withdrawal logic",
    pocUrl: "https://github.com/torvalds/linux",
    status: "SUBMITTED",
    severity: "CRITICAL",
    confidenceBps: 9200,
    payout: "5.00",
    reasoning: "PoC reproduces cross-contract reentrancy draining liquidity before balance update. Meets in-scope charter definition.",
  });

  // Action states
  const [activeTab, setActiveTab] = useState<"fund" | "submit" | "resolve">("fund");
  const [depositAmount, setDepositAmount] = useState("5.0");
  const [reportTitleInput, setReportTitleInput] = useState("Reentrancy vulnerability in withdrawal hook");
  const [pocUrlInput, setPocUrlInput] = useState("https://github.com/torvalds/linux");
  const [txStep, setTxStep] = useState<"idle" | "signing" | "pending" | "FINALIZED">("idle");
  const [activePipelineStep, setActivePipelineStep] = useState<number>(0);

  // Browser Wallet Injection Detection
  const handleConnectInjected = async () => {
    if (typeof window !== "undefined" && (window as any).ethereum) {
      try {
        const accounts = await (window as any).ethereum.request({
          method: "eth_requestAccounts",
        });
        if (accounts && accounts.length > 0) {
          setAccount(accounts[0]);
        }
      } catch (err) {
        console.error("User rejected wallet connection:", err);
      }
    } else {
      alert("No Web3 browser wallet detected. You can select one of the StudioNet test accounts from the modal.");
      setIsWalletModalOpen(true);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).ethereum) {
      (window as any).ethereum.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          setAccount(null);
        }
      });
    }
  }, []);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAddress(label);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  const handleToggleRole = () => {
    setRole((prev) => (prev === "protocol" ? "researcher" : "protocol"));
  };

  const loadSamplePreset = () => {
    setAccount("0x5B38Da6a701c568545dCfcB03FcB875f56beddC4");
    setActiveTab("resolve");
    setShowWelcomeGuide(false);
  };

  const runAction = async (actionName: "fund" | "submit" | "resolve") => {
    if (!account) {
      setIsWalletModalOpen(true);
      return;
    }

    setTxStep("signing");

    setTimeout(() => {
      setTxStep("pending");
      setActivePipelineStep(1);

      if (actionName === "resolve") {
        setTimeout(() => {
          setActivePipelineStep(2);
          setTimeout(() => {
            setActivePipelineStep(3);
            setTimeout(() => {
              setActivePipelineStep(4);
              setTxStep("FINALIZED");
              setReportState((prev) => ({ ...prev, status: "SETTLED" }));
              setVaultState((prev) => ({ ...prev, bountyPool: "5.00" }));
            }, 1000);
          }, 1200);
        }, 1200);
      } else if (actionName === "fund") {
        setTimeout(() => {
          setTxStep("FINALIZED");
          const newPool = (parseFloat(vaultState.bountyPool) + parseFloat(depositAmount)).toFixed(2);
          setVaultState((prev) => ({ ...prev, bountyPool: newPool }));
          setActiveTab("submit");
        }, 1200);
      } else if (actionName === "submit") {
        setTimeout(() => {
          setTxStep("FINALIZED");
          setReportState((prev) => ({
            ...prev,
            title: reportTitleInput,
            pocUrl: pocUrlInput,
            status: "SUBMITTED",
          }));
          setActiveTab("resolve");
        }, 1200);
      }
    }, 1000);
  };

  const faqs = [
    {
      q: "Why do bug bounties need GenLayer intelligent contracts?",
      a: "In traditional bug bounties, protocol founders have an economic incentive to downplay critical severity to avoid paying $50k+ bounties, while security researchers fear uncompensated disclosures. AegisBounty locks protocol reward pools on-chain and uses multi-validator AI consensus over live exploit proof-of-concept repositories to adjudicate severity fairly.",
    },
    {
      q: "How is the reward amount calculated and disbursed?",
      a: "When validators classify a confirmed exploit, the smart contract automatically executes a native emit_transfer of the corresponding severity percentage (CRITICAL = 50%, HIGH = 20%, MEDIUM = 5%) directly from the on-chain vault to the researcher's wallet address.",
    },
    {
      q: "How does the Equivalence Principle prevent arbitrary scoring?",
      a: "Validators independently render the live PoC URL via web.render, analyze the reproduction code against the protocol's security charter, and require exact severity matching with a confidence tolerance window <= 15% before payout.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-800">
      <Navbar
        connectedAccount={account}
        onOpenConnectModal={() => setIsWalletModalOpen(true)}
        onDisconnect={() => setAccount(null)}
        activeRole={role}
        onToggleRole={handleToggleRole}
      />

      <WalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        onSelectAccount={(addr) => setAccount(addr)}
        onConnectInjected={handleConnectInjected}
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        {/* Luminous Welcome & Onboarding Banner */}
        {showWelcomeGuide && (
          <div className="relative overflow-hidden rounded-3xl bg-white border border-rose-200/80 p-7 shadow-lg shadow-rose-500/5">
            <button
              onClick={() => setShowWelcomeGuide(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100 transition-all"
              title="Dismiss Guide"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="flex h-2.5 w-2.5 rounded-full bg-rose-500 animate-ping" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-600">
                    GenLayer Security Research Protocol
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Welcome to AegisBounty on StudioNet
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
                  AegisBounty is an autonomous bug bounty adjudication control plane. Protocols lock reward pools
                  on-chain, whitehats submit live exploit reproduction repositories, and GenLayer validators evaluate
                  vulnerability severity to trigger automated payouts.
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={loadSamplePreset}
                  className="px-5 py-3 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-600 text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 shadow-md shadow-rose-600/25 hover:shadow-lg transition-all"
                >
                  <PlayCircle className="w-4 h-4" />
                  <span>1-Click Interactive Demo</span>
                </button>
              </div>
            </div>

            {/* 3-Step Visual Flow */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-100">
              <div className="bg-slate-50/80 border border-slate-200/70 rounded-2xl p-4 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-mono text-rose-600 font-bold">
                  <span className="w-6 h-6 rounded-full bg-rose-100 flex items-center justify-center text-xs">1</span>
                  <span>Protocol Locks Bounty Pool</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed font-sans">
                  Protocol admin deposits native GEN into the vault and publishes binding scope rules.
                </p>
              </div>

              <div className="bg-slate-50/80 border border-slate-200/70 rounded-2xl p-4 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-mono text-amber-600 font-bold">
                  <span className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center text-xs">2</span>
                  <span>Whitehat Submits PoC</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed font-sans">
                  Researcher submits reproduction link (GitHub repository, Gist, or commit diff).
                </p>
              </div>

              <div className="bg-slate-50/80 border border-slate-200/70 rounded-2xl p-4 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-600 font-bold">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-xs">3</span>
                  <span>AI Exploit Adjudication</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed font-sans">
                  Validators fetch live code, classify severity, and disburse on-chain rewards.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Hero Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700 font-semibold border border-rose-200 uppercase tracking-wider">
                Autonomous Exploit Adjudicator
              </span>
              <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-semibold border border-emerald-200">
                StudioNet Live
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              AegisBounty Security Workspace
            </h1>
            <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
              Decentralized bug bounty and vulnerability disclosure control plane with Equivalence Principle multi-node
              consensus over live exploit proof-of-concepts.
            </p>
          </div>

          {/* Institutional Treasury Overview */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="bg-white border border-slate-200 rounded-2xl px-5 py-3 shadow-xs text-right">
              <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider font-medium">
                Active Bounty Vault
              </div>
              <div className="text-2xl font-extrabold font-mono text-rose-600">{vaultState.bountyPool} GEN</div>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl px-5 py-3 shadow-xs text-right">
              <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider font-medium">Gas Model</div>
              <div className="text-2xl font-extrabold font-mono text-emerald-600">0 GEN (Gasless)</div>
            </div>
          </div>
        </div>

        {/* Contract Explorer Badges */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="crystal-panel rounded-2xl p-4 flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-rose-600" />
                <span className="text-[11px] font-mono text-slate-500 font-bold uppercase tracking-wider">
                  Core Bug Bounty Vault Instance
                </span>
              </div>
              <div className="font-mono text-xs text-slate-800 font-bold">{arbiterAddress}</div>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => copyToClipboard(arbiterAddress, "arbiter")}
                className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-all"
                title="Copy Address"
              >
                {copiedAddress === "arbiter" ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
              <a
                href={`https://explorer-studio.genlayer.com/address/${arbiterAddress}`}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-xl hover:bg-rose-50 text-rose-600 transition-all"
                title="View on StudioNet Explorer"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div className="crystal-panel rounded-2xl p-4 flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-indigo-600" />
                <span className="text-[11px] font-mono text-slate-500 font-bold uppercase tracking-wider">
                  Multi-Vault Factory Registry
                </span>
              </div>
              <div className="font-mono text-xs text-slate-800 font-bold">{factoryAddress}</div>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => copyToClipboard(factoryAddress, "factory")}
                className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-all"
                title="Copy Address"
              >
                {copiedAddress === "factory" ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
              <a
                href={`https://explorer-studio.genlayer.com/address/${factoryAddress}`}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-xl hover:bg-indigo-50 text-indigo-600 transition-all"
                title="View on StudioNet Explorer"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Severity Payout Matrix Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <div className="bg-white p-4 rounded-2xl border-2 border-rose-200 shadow-sm">
            <div className="text-[11px] font-mono text-rose-600 uppercase font-extrabold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span>CRITICAL IMPACT</span>
            </div>
            <div className="text-xl font-mono font-extrabold text-slate-900 mt-1">50% POOL</div>
            <div className="text-xs text-slate-500 mt-0.5">Direct fund drain or freeze</div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-amber-200 shadow-sm">
            <div className="text-[11px] font-mono text-amber-600 uppercase font-extrabold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>HIGH IMPACT</span>
            </div>
            <div className="text-xl font-mono font-extrabold text-slate-900 mt-1">20% POOL</div>
            <div className="text-xs text-slate-500 mt-0.5">Temporary lock / auth bypass</div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-sky-200 shadow-sm">
            <div className="text-[11px] font-mono text-sky-600 uppercase font-extrabold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-sky-500" />
              <span>MEDIUM IMPACT</span>
            </div>
            <div className="text-xl font-mono font-extrabold text-slate-900 mt-1">5% POOL</div>
            <div className="text-xs text-slate-500 mt-0.5">Griefing / gas drain exploit</div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-[11px] font-mono text-slate-500 uppercase font-extrabold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-slate-400" />
              <span>LOW / INVALID</span>
            </div>
            <div className="text-xl font-mono font-extrabold text-slate-900 mt-1">0% POOL</div>
            <div className="text-xs text-slate-500 mt-0.5">Spam / out-of-scope report</div>
          </div>
        </div>

        {/* Main Work Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Action Box */}
          <div className="lg:col-span-7 space-y-6">
            <div className="crystal-panel rounded-3xl p-7 space-y-6">
              {/* Tab Selector */}
              <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab("fund")}
                    className={`px-3.5 py-2 rounded-xl text-xs font-mono font-semibold transition-all ${
                      activeTab === "fund"
                        ? "bg-rose-600 text-white font-bold shadow-md shadow-rose-600/20"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    1. Fund Vault
                  </button>
                  <button
                    onClick={() => setActiveTab("submit")}
                    className={`px-3.5 py-2 rounded-xl text-xs font-mono font-semibold transition-all ${
                      activeTab === "submit"
                        ? "bg-rose-600 text-white font-bold shadow-md shadow-rose-600/20"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    2. Submit PoC
                  </button>
                  <button
                    onClick={() => setActiveTab("resolve")}
                    className={`px-3.5 py-2 rounded-xl text-xs font-mono font-semibold transition-all ${
                      activeTab === "resolve"
                        ? "bg-rose-600 text-white font-bold shadow-md shadow-rose-600/20"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    3. AI Adjudicate
                  </button>
                </div>
                <span className="text-xs font-mono text-slate-400 font-semibold">
                  Step {activeTab === "fund" ? "1/3" : activeTab === "submit" ? "2/3" : "3/3"}
                </span>
              </div>

              {!account && (
                <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Wallet className="w-5 h-5 text-rose-600" />
                    <div className="text-xs">
                      <div className="font-bold text-slate-900 font-mono">Wallet Disconnected</div>
                      <div className="text-slate-600">Connect Web3 or StudioNet wallet to interact.</div>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsWalletModalOpen(true)}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs font-mono shrink-0 transition-all"
                  >
                    Connect
                  </button>
                </div>
              )}

              {/* Tab 1: Fund */}
              {activeTab === "fund" && (
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
                    <Info className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900">Protocol Admin Action:</strong> Deposit native GEN into the
                      vault pool to fund verified vulnerability disclosures according to the on-chain charter.
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                      Deposit Amount (Native GEN Tokens)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      className="w-full bg-white border border-slate-300 focus:border-rose-500 rounded-xl px-4 py-3 text-xs text-slate-900 focus:outline-none font-mono shadow-xs"
                    />
                  </div>
                  <button
                    onClick={() => runAction("fund")}
                    disabled={txStep === "signing" || txStep === "pending"}
                    className="w-full py-3.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs font-mono uppercase tracking-wider flex items-center justify-center space-x-2 transition-all shadow-md"
                  >
                    <Lock className="w-4 h-4 text-rose-400" />
                    <span>{account ? "Deposit & Lock Bounty Pool" : "Connect Wallet to Deposit"}</span>
                  </button>
                </div>
              )}

              {/* Tab 2: Submit */}
              {activeTab === "submit" && (
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
                    <Info className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900">Whitehat Action:</strong> Submit your vulnerability
                      reproduction proof (e.g. GitHub Gist or repository commit diff).
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                      Vulnerability Title / Claim
                    </label>
                    <input
                      type="text"
                      value={reportTitleInput}
                      onChange={(e) => setReportTitleInput(e.target.value)}
                      className="w-full bg-white border border-slate-300 focus:border-rose-500 rounded-xl px-4 py-3 text-xs text-slate-900 focus:outline-none font-mono mb-3 shadow-xs"
                    />

                    <label className="block text-xs font-mono font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                      Exploit PoC Evidence URL (HTTP/HTTPS)
                    </label>
                    <input
                      type="url"
                      value={pocUrlInput}
                      onChange={(e) => setPocUrlInput(e.target.value)}
                      className="w-full bg-white border border-slate-300 focus:border-rose-500 rounded-xl px-4 py-3 text-xs text-slate-900 focus:outline-none font-mono shadow-xs"
                    />
                  </div>

                  <button
                    onClick={() => runAction("submit")}
                    disabled={txStep === "signing" || txStep === "pending"}
                    className="w-full py-3.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs font-mono uppercase tracking-wider flex items-center justify-center space-x-2 transition-all shadow-md"
                  >
                    <Bug className="w-4 h-4 text-rose-400" />
                    <span>{account ? "Submit Exploit for Adjudication" : "Connect Wallet to Submit"}</span>
                  </button>
                </div>
              )}

              {/* Tab 3: Resolve */}
              {activeTab === "resolve" && (
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
                    <Info className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900">Consensus Action:</strong> Calling{" "}
                      <code className="text-rose-600 font-bold">resolve_bounty_report()</code> triggers GenLayer
                      validators to fetch the PoC URL, evaluate severity against the charter, and release payout.
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-2 shadow-xs">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-500 font-bold uppercase">Live Target PoC URL</span>
                      <span className="text-rose-600 font-bold">Min Confidence: 70.00%</span>
                    </div>
                    <a
                      href={reportState.pocUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="font-mono text-xs text-rose-600 hover:underline break-all inline-flex items-center gap-1.5"
                    >
                      <Globe className="w-3.5 h-3.5 shrink-0" />
                      <span>{reportState.pocUrl}</span>
                    </a>
                  </div>

                  <button
                    onClick={() => runAction("resolve")}
                    disabled={txStep === "signing" || txStep === "pending"}
                    className="w-full py-4 px-4 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-xs font-mono uppercase tracking-wider flex items-center justify-center space-x-2 transition-all shadow-lg shadow-rose-600/25 disabled:opacity-50"
                  >
                    {txStep === "pending" || txStep === "signing" ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Adjudicating with Multi-Validator Nodes...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>{account ? "Execute AI Severity Consensus" : "Connect Wallet to Adjudicate"}</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right State Certificate */}
          <div className="lg:col-span-5 space-y-6">
            <div className="crystal-panel-interactive rounded-3xl p-7 space-y-5 bg-white">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3.5">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-rose-600" />
                  <h3 className="text-xs font-mono font-bold text-slate-900 uppercase tracking-wider">
                    Vulnerability Certificate #0
                  </h3>
                </div>
                <span
                  className={`px-3 py-0.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider ${
                    reportState.status === "SETTLED"
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                      : "bg-rose-100 text-rose-800 border border-rose-300"
                  }`}
                >
                  {reportState.status}
                </span>
              </div>

              <div className="space-y-4 font-mono text-xs">
                <div>
                  <span className="text-slate-500 text-[11px] block mb-0.5 uppercase tracking-wider font-semibold">
                    Vulnerability Scope Title
                  </span>
                  <span className="text-slate-900 font-sans text-xs font-bold leading-snug block">
                    {reportState.title}
                  </span>
                </div>

                <div>
                  <span className="text-slate-500 text-[11px] block mb-1 uppercase tracking-wider font-semibold">
                    Adjudicated Severity &amp; Reward
                  </span>
                  <div className="flex items-center gap-2.5">
                    <span className="px-3 py-1 rounded-xl bg-rose-600 text-white font-extrabold text-xs shadow-xs">
                      {reportState.severity}
                    </span>
                    <span className="text-emerald-700 font-extrabold text-sm font-mono">
                      +{reportState.payout} GEN Emitted
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-slate-500 text-[11px] block mb-0.5 uppercase tracking-wider font-semibold">
                    Validator Consensus Confidence
                  </span>
                  <span className="text-slate-900 font-bold">
                    {reportState.confidenceBps / 100}% ({reportState.confidenceBps} bps)
                  </span>
                </div>

                <div>
                  <span className="text-slate-500 text-[11px] block mb-1 uppercase tracking-wider font-semibold">
                    Auditor Deliberation Notes
                  </span>
                  <p className="text-slate-700 font-sans text-xs bg-slate-50 p-3.5 rounded-2xl border border-slate-200 leading-relaxed italic">
                    &ldquo;{reportState.reasoning}&rdquo;
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="crystal-panel rounded-3xl p-7 space-y-4">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-rose-600" />
            <h3 className="text-sm font-bold text-slate-900 font-mono uppercase tracking-wider">
              Protocol Security Model &amp; Technical Specifications
            </h3>
          </div>

          <div className="divide-y divide-slate-200/80">
            {faqs.map((faq, index) => (
              <div key={index} className="py-3.5">
                <button
                  onClick={() => setFaqOpen(faqOpen === index ? null : index)}
                  className="w-full flex items-center justify-between text-left text-xs sm:text-sm font-semibold text-slate-900 hover:text-rose-600 transition-all"
                >
                  <span>{faq.q}</span>
                  {faqOpen === index ? (
                    <ChevronUp className="w-4 h-4 text-rose-600 shrink-0 ml-2" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
                  )}
                </button>
                {faqOpen === index && (
                  <p className="mt-2 text-xs text-slate-600 leading-relaxed font-sans">{faq.a}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500 font-mono">
        AegisBounty • Multi-Validator Vulnerability &amp; Bug Bounty Protocol • GenLayer StudioNet
      </footer>
    </div>
  );
}
