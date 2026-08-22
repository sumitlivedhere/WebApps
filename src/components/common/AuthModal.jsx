import React, { useState } from 'react';
import { sendPhoneOTP, verifyPhoneOTP } from '../../services/authService';

export default function AuthModal({
  isOpen,
  onClose,
  onSuccess,
  actionTitle = 'Verify Phone to Continue',
  selectedCity = 'Alwar',
}) {
  if (!isOpen) return null;

  const [step, setStep] = useState('phone'); // 'phone' | 'otp'
  const [phone, setPhone] = useState('');
  const [fullName, setFullName] = useState('');
  const [areaName, setAreaName] = useState('');
  const [otpToken, setOtpToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSendOtp = async (e) => {
    e.preventDefault();
    const cleanPhone = phone.replace(/\D/g, '');

    if (cleanPhone.length !== 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (!fullName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    const res = await sendPhoneOTP(cleanPhone);
    setIsLoading(false);

    if (res.success) {
      setStep('otp');
    } else {
      setErrorMsg(res.error || 'Failed to send OTP. Please try again.');
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otpToken.trim().length < 4) {
      setErrorMsg('Please enter the OTP sent to your phone.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    const res = await verifyPhoneOTP(phone, otpToken, {
      fullName: fullName.trim(),
      areaName: areaName.trim() || 'Town Center',
      city: selectedCity,
    });

    setIsLoading(false);

    if (res.success && res.profile) {
      if (onSuccess) onSuccess(res.profile);
      onClose();
    } else {
      setErrorMsg(res.error || 'Incorrect OTP. Please check and re-enter.');
    }
  };

  return (
    <div className="fixed inset-0 z-[110] bg-slate-950/80 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 select-none animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl w-full max-w-sm p-4 space-y-4 shadow-2xl text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <span className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center text-sm font-black shadow-md">
              🛡️
            </span>
            <div>
              <h3 className="text-xs font-black text-white">{actionTitle}</h3>
              <p className="text-[10px] text-amber-300 font-bold">
                1-Person = 1-Account Verification
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-full flex items-center justify-center text-xs font-black cursor-pointer"
          >
            ✕
          </button>
        </div>

        {errorMsg && (
          <div className="p-2.5 bg-rose-500/20 border border-rose-500/40 rounded-xl text-rose-300 text-xs font-bold text-center">
            ⚠️ {errorMsg}
          </div>
        )}

        {/* Step 1: Phone & Locality Entry */}
        {step === 'phone' && (
          <form onSubmit={handleSendOtp} className="space-y-3 text-xs">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1">
                Your Full Name (आपका नाम) *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Rahul Sharma"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-semibold focus:outline-hidden focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1">
                Mobile Number (मोबाइल नंबर) *
              </label>
              <div className="flex items-center space-x-2">
                <span className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2.5 font-mono text-slate-400 font-bold">
                  +91
                </span>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  placeholder="9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono font-bold focus:outline-hidden focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1">
                Colony / Sector (कॉलोनी / क्षेत्र)
              </label>
              <input
                type="text"
                placeholder="e.g. Budh Vihar, Alwar"
                value={areaName}
                onChange={(e) => setAreaName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-semibold focus:outline-hidden focus:border-amber-400"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || phone.length !== 10 || !fullName.trim()}
              className="w-full py-3 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 disabled:opacity-40 text-slate-950 font-black text-xs rounded-xl shadow-lg cursor-pointer active:scale-95 transition"
            >
              {isLoading ? 'Sending OTP...' : '➔ Send OTP Code'}
            </button>
          </form>
        )}

        {/* Step 2: OTP Verification */}
        {step === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="space-y-3 text-xs">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center space-y-1">
              <span className="text-[10px] text-slate-400">Enter code sent to</span>
              <div className="font-mono text-sm font-black text-amber-400">+91 {phone}</div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1">
                6-Digit OTP Code *
              </label>
              <input
                type="text"
                required
                maxLength={6}
                autoFocus
                placeholder="123456"
                value={otpToken}
                onChange={(e) => setOtpToken(e.target.value.replace(/\D/g, ''))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-center text-lg font-mono font-black tracking-widest text-white focus:outline-hidden focus:border-amber-400"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || otpToken.length < 4}
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 disabled:opacity-40 text-slate-950 font-black text-xs rounded-xl shadow-lg cursor-pointer active:scale-95 transition"
            >
              {isLoading ? 'Verifying Identity...' : '✓ Verify & Proceed'}
            </button>

            <button
              type="button"
              onClick={() => setStep('phone')}
              className="w-full text-center text-[10px] text-slate-400 hover:text-white pt-1"
            >
              ← Change Phone Number
            </button>
          </form>
        )}
      </div>
    </div>
  );
}