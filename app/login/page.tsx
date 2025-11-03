"use client";

import React from "react";
import { LoginForm } from "./login-view";

const LogoIcon = () => (
  <svg
    className="h-8 w-8 text-black"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 4.5C7.30558 4.5 4.5 7.30558 4.5 12C4.5 16.6944 7.30558 19.5 12 19.5C16.6944 19.5 19.5 16.6944 19.5 12C19.5 10.843 19.2388 9.75478 18.7612 8.7612C18.2835 7.76761 17.6188 6.88116 16.8284 6.17157C16.038 5.46198 15.1516 4.9903 14.2579 4.72149"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 4.5C13.157 4.5 14.2452 4.7612 15.2388 5.2388C16.2324 5.7165 17.1188 6.38116 17.8284 7.17157C18.538 7.96198 19.0097 8.84842 19.2785 9.7421C19.5473 10.6358 19.8086 11.624 19.8086 12.781"
      opacity="0.6"
    />
  </svg>
);

/**
 * Right Side: Info Panel Component
 */
const InfoPanel = () => {
  return (
    <div className="hidden m-3 lg:flex flex-col justify-between  lg:rounded-3xl max-h-screen bg-[#E5E5E5] p-12">
      <div>
        <div className="flex items-center space-x-2">
          <LogoIcon />
          <span className="text-xl font-semibold text-black">
            Codefeast Admin
          </span>
        </div>
        <p className="text-gray-600 mt-2">Design. Build. Launch. Repeat.</p>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div>
          <h4 className="font-semibold text-black mb-2">Ready to launch?</h4>
          <p className="text-sm text-gray-600">
            Clone the repo, install dependencies, and your dashboard is live in
            minutes.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-black mb-2">Need help?</h4>
          <p className="text-sm text-gray-600">
            Check out the docs or open an issue on GitHub, community support is
            just a click away.
          </p>
        </div>
      </div>
    </div>
  );
};
export default function LoginPage() {
  return (
    <div className="min-h-screen" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="grid grid-cols-1 bg-[#0A0A0A] lg:grid-cols-2">
        <LoginForm />
        <InfoPanel />
      </div>
    </div>
  );
}
