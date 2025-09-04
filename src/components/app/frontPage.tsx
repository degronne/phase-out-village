// /src/components/app/frontPage.tsx

import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import OnboardingDialog from "../app/onboardingDialog";
import "./onboardingDialog.css";

const STORAGE_KEY = "onboarding_seen_v1";

export function FrontPage() {
  const navigate = useNavigate();
  const [onboardingOpen, setOnboardingOpen] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) !== "1";
    } catch {
      return true;
    }
  });

  // Navigate to map once onboarding is closed or already seen
  useEffect(() => {
    if (!onboardingOpen) {
      navigate("/map", { replace: true });
    }
  }, [onboardingOpen, navigate]);

  const handleOnboardingClose = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {}
    setOnboardingOpen(false);
  };

  return (
    <>
      <OnboardingDialog
        open={onboardingOpen}
        onClose={handleOnboardingClose}
        storageKey={STORAGE_KEY}
      />
    </>
  );
}
