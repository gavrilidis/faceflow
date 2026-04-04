import React from "react";
import type { FaceGroup } from "../types";
import { FaceSidebar } from "./FaceSidebar";
import { PhotoGrid } from "./PhotoGrid";

interface GalleryViewProps {
  groups: FaceGroup[];
  onReset: () => void;
}

export const GalleryView: React.FC<GalleryViewProps> = ({ groups, onReset }) => {
  const [selectedGroupId, setSelectedGroupId] = React.useState<string | null>(
    groups.length > 0 ? groups[0].id : null,
  );

  const selectedGroup = groups.find((g) => g.id === selectedGroupId) || null;
  const selectedIndex = selectedGroup ? groups.indexOf(selectedGroup) : -1;

  return (
    <div className="flex h-full w-full flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--bg-secondary)] px-6 py-3">
        <div className="flex items-center gap-4">
          <h1 className="text-base font-bold tracking-tight text-[var(--text-primary)]">Fovia</h1>
          <div className="h-4 w-px bg-[var(--border)]" />
          <span className="text-xs tabular-nums text-[var(--text-secondary)]">
            {groups.reduce((sum, g) => sum + g.members.length, 0)} faces in {groups.length} groups
          </span>
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-2 rounded-lg border border-[var(--border)] px-4 py-2 text-xs font-medium text-[var(--text-secondary)] transition-all hover:border-[var(--text-secondary)]/30 hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182"
            />
          </svg>
          New Scan
        </button>
      </div>
      <div className="flex flex-1 overflow-hidden">
        <FaceSidebar
          groups={groups}
          selectedGroupId={selectedGroupId}
          onSelectGroup={setSelectedGroupId}
        />
        <PhotoGrid
          photos={selectedGroup?.members || []}
          personLabel={selectedIndex >= 0 ? `Person ${selectedIndex + 1}` : ""}
        />
      </div>
    </div>
  );
};
