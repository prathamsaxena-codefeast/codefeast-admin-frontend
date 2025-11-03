"use client";

import React from "react";
import { LoginForm } from "./login-view";
import Image from "next/image";

/**
 * Right Side: Info Panel Component
 */
const InfoPanel = () => {
  return (
    <div className="hidden m-3 lg:flex flex-col justify-between  lg:rounded-3xl max-h-screen bg-[#E5E5E5] p-12">
      <div>
        <div className="flex items-center space-x-2">
          <Image
            src="/codefeast.svg"
            alt="codefeast"
            className="w-20 h-18 object-contain cursor-pointer"
            width={250}
            height={250}
            priority
          />

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
