"use client";

import { useState, useEffect } from "react";
import { useSupabase } from "@/components/providers/SupabaseProvider";
import { 
  User, 
  CalendarBlank, 
  Phone, 
  Key, 
  Eye, 
  EyeSlash, 
  Question, 
  ArrowRight, 
  Check,
  Warning
} from "@phosphor-icons/react";
import { motion, AnimatePresence } from "motion/react";

export function SetupModal() {
  const { profile, updateProfile, user } = useSupabase();

  // If setup is already completed, or user is not logged in, do not render
  if (!profile || profile.hasCompletedSetup || !user) {
    return null;
  }

  return (
    <SetupModalContent
      profile={profile}
      updateProfile={updateProfile}
      user={user}
    />
  );
}

function SetupModalContent({ profile, updateProfile, user }: { profile: any; updateProfile: any; user: any }) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState(profile.name || "");
  const [dob, setDob] = useState(profile.dob || "");
  const [mobileNo, setMobileNo] = useState(profile.mobileNo || "");
  const [groqApiKey, setGroqApiKey] = useState(profile.groqApiKey || "");
  const [showKey, setShowKey] = useState(false);
  const [needHelp, setNeedHelp] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  // Auto-detect fields from profile when it asynchronously loads
  useEffect(() => {
    if (profile && !hasInitialized && profile.email !== "john.doe@example.com") {
      setName(profile.name || "");
      setDob(profile.dob || "");
      setMobileNo(profile.mobileNo || "");
      setGroqApiKey(profile.groqApiKey || "");
      setHasInitialized(true);
    }
  }, [profile, hasInitialized]);

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (!dob) {
      setError("Please select your date of birth.");
      return;
    }
    if (!mobileNo.trim()) {
      setError("Mobile number is required for profile verification and friend search.");
      return;
    }
    // Strict 10-digit mobile check
    const cleanMobile = mobileNo.replace(/\D/g, "");
    if (cleanMobile.length !== 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    setError("");
    setStep(2);
  };

  const handleCompleteSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groqApiKey.trim()) {
      setError("Groq API Key is required to power your day-wise study agent.");
      return;
    }
    if (!groqApiKey.startsWith("gsk_")) {
      setError("Invalid key format. Groq API keys typically start with 'gsk_'.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await updateProfile({
        name,
        dob,
        mobileNo,
        groqApiKey,
        hasCompletedSetup: true
      });
    } catch (err: any) {
      setError(err.message || "An error occurred during onboarding setup.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1B1917]/40 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-surface border border-border rounded-2xl shadow-xl overflow-hidden flex flex-col"
      >
        {/* Progress Tracker */}
        <div className="bg-[#FAF7F0] px-6 py-4 border-b border-border flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="font-bold text-xs uppercase tracking-wider text-text-secondary">Onboarding Setup</span>
          </div>
          <div className="flex gap-1.5">
            <div className={`w-2 h-2 rounded-full transition-all duration-300 ${step === 1 ? "bg-focus w-6" : "bg-signal"}`} />
            <div className={`w-2 h-2 rounded-full transition-all duration-300 ${step === 2 ? "bg-focus w-6" : "bg-border"}`} />
          </div>
        </div>

        {/* Form Area */}
        <div className="p-6 overflow-y-auto" style={{maxHeight: 'calc(100vh - 12rem)'}}>
          {error && (
            <div className="mb-4 text-xs text-alert bg-alert/5 p-3.5 rounded-xl border border-alert/20 font-semibold flex items-start gap-2.5">
              <Warning className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.form 
                key="step1"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                onSubmit={handleNextStep} 
                className="space-y-4"
              >
                <div className="space-y-2">
                  <h2 className="text-xl font-bold tracking-tight text-text-primary">Personal Details</h2>
                  <p className="text-xs text-text-secondary">Tell us a bit about yourself to customize your 92-Day DSA tracker.</p>
                </div>

                <div className="space-y-4">
                  {/* Name Input */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-3 w-5 h-5 text-text-secondary" />
                      <input
                        type="text"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => { setName(e.target.value); setError(""); }}
                        className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-paper border border-border focus:outline-none focus:ring-2 focus:ring-focus/20 text-sm font-medium text-text-primary"
                      />
                    </div>
                  </div>

                  {/* DOB Input */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Date of Birth</label>
                    <div className="relative">
                      <CalendarBlank className="absolute left-3.5 top-3 w-5 h-5 text-text-secondary" />
                      <input
                        type="date"
                        value={dob}
                        onChange={(e) => { setDob(e.target.value); setError(""); }}
                        className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-paper border border-border focus:outline-none focus:ring-2 focus:ring-focus/20 text-sm font-medium text-text-primary"
                      />
                    </div>
                  </div>

                  {/* Mobile Input */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Mobile Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-3 w-5 h-5 text-text-secondary" />
                      <input
                        type="tel"
                        placeholder="10-digit mobile number"
                        value={mobileNo}
                        maxLength={10}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "");
                          setMobileNo(val);
                          setError("");
                        }}
                        className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-paper border border-border focus:outline-none focus:ring-2 focus:ring-focus/20 text-sm font-medium text-text-primary"
                      />
                    </div>
                    <p className="text-[10px] text-text-secondary font-medium leading-normal">Required so friends can find your profile and compare streak progress.</p>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#1B1917] text-white py-3 rounded-xl font-semibold shadow-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2 text-sm cursor-pointer mt-6"
                >
                  Continue to API Settings
                  <ArrowRight weight="bold" />
                </button>
              </motion.form>
            ) : (
              <motion.form 
                key="step2"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                onSubmit={handleCompleteSetup} 
                className="space-y-4"
              >
                <div className="space-y-2">
                  <h2 className="text-xl font-bold tracking-tight text-text-primary">Configure AI Agent</h2>
                  <p className="text-xs text-text-secondary">Enter your Groq API key to power the right-side day study panel assistant.</p>
                </div>

                <div className="space-y-4">
                  {/* API Key Input */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Groq API Key</label>
                      <button
                        type="button"
                        onClick={() => setNeedHelp(!needHelp)}
                        className="text-xs text-focus font-semibold hover:underline flex items-center gap-1 focus:outline-none"
                      >
                        <Question className="w-3.5 h-3.5" />
                        Need Help?
                      </button>
                    </div>
                    <div className="relative">
                      <Key className="absolute left-3.5 top-3 w-5 h-5 text-text-secondary" />
                      <input
                        type={showKey ? "text" : "password"}
                        placeholder="gsk_••••••••••••••••••••••••"
                        disabled={loading}
                        value={groqApiKey}
                        onChange={(e) => { setGroqApiKey(e.target.value); setError(""); }}
                        className="w-full pl-11 pr-12 py-2.5 rounded-xl bg-paper border border-border focus:outline-none focus:ring-2 focus:ring-focus/20 text-sm font-medium text-text-primary"
                      />
                      <button
                        type="button"
                        onClick={() => setShowKey(!showKey)}
                        className="absolute right-3.5 top-3 text-text-secondary hover:text-text-primary focus:outline-none"
                      >
                        {showKey ? <EyeSlash className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Help Guide Accordion */}
                  <AnimatePresence>
                    {needHelp && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden border border-border bg-[#FAF7F0] rounded-xl p-4 space-y-3"
                      >
                        <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider">How to get a Groq API Key:</h3>
                        <ol className="text-xs text-text-secondary space-y-2 list-decimal list-inside leading-relaxed">
                          <li>
                            Go to the official{" "}
                            <a 
                              href="https://console.groq.com/" 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-focus hover:underline font-semibold"
                            >
                              Groq Console
                            </a>.
                          </li>
                          <li>Log in or create a free developer account.</li>
                          <li>Go to the **API Keys** section in the left sidebar menu.</li>
                          <li>Click **Create API Key**, name it (e.g. `DSA Tracker`), and copy it.</li>
                          <li>Paste the key into the input field above.</li>
                        </ol>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => { setError(""); setStep(1); }}
                    className="flex-1 py-3 border border-border rounded-xl font-semibold text-text-primary bg-surface hover:bg-[#FAF7F0] transition-colors text-sm disabled:opacity-50 cursor-pointer text-center"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-[#1B1917] text-white py-3 rounded-xl font-semibold shadow-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2 text-sm disabled:opacity-50 cursor-pointer"
                  >
                    {loading ? "Saving..." : "Complete Setup"}
                    {!loading && <Check weight="bold" />}
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
