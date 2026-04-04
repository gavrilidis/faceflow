import React from "react";
import type { FaceGroup } from "../types";

interface FaceSidebarProps {
  groups: FaceGroup[];
  selectedGroupId: string | null;
  onSelectGroup: (groupId: string) => void;
}

export const FaceSidebar: React.FC<FaceSidebarProps> = ({
  groups,
  selectedGroupId,
  onSelectGroup,
}) => {
  return (
    <div className="flex h-full w-60 flex-shrink-0 flex-col border-r border-[var(--border)] bg-[var(--bg-secondary)]">
      <div className="px-5 py-4">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-[var(--text-secondary)]">
          Faces
          <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--bg-tertiary)] px-1.5 text-xs tabular-nums font-normal">
            {groups.length}
          </span>
        </h3>
      </div>
      <div className="flex-1 overflow-y-auto px-2 pb-2">
        {groups.map((group, idx) => (
          <button
            key={group.id}
            onClick={() => onSelectGroup(group.id)}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 transition-all ${
              selectedGroupId === group.id
                ? "bg-[var(--accent)]/15 shadow-sm"
                : "hover:bg-[var(--bg-tertiary)]"
            }`}
          >
            <div
              className={`h-10 w-10 flex-shrink-0 overflow-hidden rounded-full ring-2 ${
                selectedGroupId === group.id
                  ? "ring-[var(--accent)]"
                  : "ring-transparent"
              } bg-[var(--bg-tertiary)]`}
            >
              {group.representative.preview_base64 ? (
                <img
                  src={`data:image/jpeg;base64,${group.representative.preview_base64}`}
                  alt="Face"
                  className="h-full w-full object-cover"
                  style={{
                    objectPosition: `${(group.representative.bbox_x1 / 6000) * 100}% ${(group.representative.bbox_y1 / 4000) * 100}%`,
                  }}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <svg
                    className="h-5 w-5 text-[var(--text-secondary)]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                    />
                  </svg>
                </div>
              )}
            </div>
            <div className="min-w-0 text-left">
              <div className="truncate text-sm font-medium text-[var(--text-primary)]">
                Person {idx + 1}
              </div>
              <div className="mt-0.5 text-xs tabular-nums text-[var(--text-secondary)]">
                {group.members.length} photo{group.members.length !== 1 ? "s" : ""}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
