"use client";

import { useRef, useEffect, useState } from "react";

/**
 * Google Places Autocomplete input.
 *
 * Falls back to a plain text input when the Google Maps script isn't loaded
 * (e.g. missing API key during development).
 *
 * Props:
 *   value        – controlled input value (place display name)
 *   onChange     – (displayName: string) => void
 *   placeholder
 *   icon         – optional leading React node (e.g. <MapPin />)
 *   label        – small label above the input (e.g. "From")
 *   className    – extra classes on the outer wrapper
 */
export default function PlacesAutocomplete({
  value,
  onChange,
  placeholder = "Address, airport, hotel...",
  icon,
  label,
  className = "",
}) {
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);
  const [isGoogleReady, setIsGoogleReady] = useState(false);

  useEffect(() => {
    // Check if google maps places library is available
    if (window.google?.maps?.places) {
      setIsGoogleReady(true);
    } else {
      // Poll briefly in case the script is still loading
      const timer = setInterval(() => {
        if (window.google?.maps?.places) {
          setIsGoogleReady(true);
          clearInterval(timer);
        }
      }, 500);
      return () => clearInterval(timer);
    }
  }, []);

  useEffect(() => {
    if (!isGoogleReady || !inputRef.current || autocompleteRef.current) return;

    const ac = new window.google.maps.places.Autocomplete(inputRef.current, {
      types: ["geocode", "establishment"],
    });

    ac.addListener("place_changed", () => {
      const place = ac.getPlace();
      if (place?.formatted_address) {
        onChange(place.formatted_address);
      } else if (place?.name) {
        onChange(place.name);
      }
    });

    autocompleteRef.current = ac;
  }, [isGoogleReady, onChange]);

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus-within:border-[#00B1C5] transition-colors ${className}`}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <div className="flex-1 min-w-0">
        {label && (
          <div className="text-xs text-gray-400 font-medium mb-0.5">
            {label}
          </div>
        )}
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent text-gray-700 placeholder-gray-400 text-sm outline-none"
        />
      </div>
    </div>
  );
}
