import React from "react";
import type { FaceEntry } from "../types";

interface PhotoGridProps {
  photos: FaceEntry[];
  personLabel: string;
}

export const PhotoGrid: React.FC<PhotoGridProps> = ({ photos, personLabel }) => {
  if (photos.length === 0) {
    return (
      <div className="flex h-full flex-1 flex-col items-center justify-center gap-3">
        <svg
          className="h-12 w-12 text-[var(--text-secondary)]/40"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
          />
        </svg>
        <p className="text-sm text-[var(--text-secondary)]">Select a person to view their photos</p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4">
        <h2 className="text-base font-semibold text-[var(--text-primary)]">{personLabel}</h2>
        <span className="rounded-md bg-[var(--bg-tertiary)] px-2.5 py-1 text-xs tabular-nums text-[var(--text-secondary)]">
          {photos.length} photo{photos.length !== 1 ? "s" : ""}
        </span>
      </div>
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {photos.map((photo) => (
            <div
              key={photo.face_id}
              className="group relative aspect-square overflow-hidden rounded-xl bg-[var(--bg-tertiary)] shadow-md shadow-black/20 ring-1 ring-white/5"
            >
              {photo.preview_base64 ? (
                <img
                  src={`data:image/jpeg;base64,${photo.preview_base64}`}
                  alt={photo.file_path.split("/").pop() || "Photo"}
                  className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <svg
                    className="h-8 w-8 text-[var(--text-secondary)]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a2.25 2.25 0 002.25-2.25V5.25a2.25 2.25 0 00-2.25-2.25H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z"
                    />
                  </svg>
                </div>
              )}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 pb-3 pt-6 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <p className="truncate text-xs text-white">
                  {photo.file_path.split("/").pop()}
                </p>
                <p className="text-xs text-white/60">
                  Score: {(photo.detection_score * 100).toFixed(0)}%
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
