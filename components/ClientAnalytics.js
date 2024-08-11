// components/ClientAnalytics.js
'use client';

import { useEffect } from "react";
import { analytics } from "../utils/firebase";

export default function ClientAnalytics() {
  useEffect(() => {
    if (analytics) {
      console.log("Firebase Analytics initialized");
    }
  }, []);

  return null; // This component doesn't need to render anything
}
