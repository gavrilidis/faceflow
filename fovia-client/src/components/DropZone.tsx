import React, { useCallback, useState } from "react";

interface DropZoneProps {
  onFolderSelected: (path: string) => void;
}

export const DropZone: React.FC<DropZoneProps> = ({ onFolderSelected }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [folderPath, setFolderPath] = useState("");

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const items = e.dataTransfer.items;
      if (items && items.length > 0) {
        const item = items[0];
        if (item.kind === "file") {
          const file = item.getAsFile();
          if (file) {
            // For Tauri, the path comes from the file
            const path = (file as unknown as { path?: string }).path;
            if (path) {
              onFolderSelected(path);
              return;
            }
          }
        }
      }

      // Fallback: use text input
      if (folderPath.trim()) {
        onFolderSelected(folderPath.trim());
      }
    },
    [folderPath, onFolderSelected],
  );

  const handleSubmit = useCallback(() => {
    if (folderPath.trim()) {
      onFolderSelected(folderPath.trim());
    }
  }, [folderPath, onFolderSelected]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        handleSubmit();
      }
    },
    [handleSubmit],
  );

  return (
    <div className="flex h-full w-full items-center justify-center p-8">
      <div
        className={`flex w-full max-w-lg flex-col items-center justify-center rounded-2xl border-2 border-dashed p-16 transition-all duration-200 ${
          isDragging
            ? "border-[var(--accent)] bg-[var(--accent)]/10"
            : "border-[var(--border)] bg-[var(--bg-secondary)] hover:border-[var(--text-secondary)]"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <svg
          className="mb-6 h-16 w-16 text-[var(--text-secondary)]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
          />
        </svg>

        <h2 className="mb-2 text-xl font-semibold text-[var(--text-primary)]">
          Drop RAW Photo Folder
        </h2>
        <p className="mb-6 text-sm text-[var(--text-secondary)]">
          Supports CR2, ARW, RAW, NEF, DNG, ORF, RW2, RAF
        </p>

        <div className="flex w-full items-center gap-3">
          <input
            type="text"
            value={folderPath}
            onChange={(e) => setFolderPath(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="/path/to/photo/folder"
            className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)] outline-none focus:border-[var(--accent)]"
          />
          <button
            onClick={handleSubmit}
            disabled={!folderPath.trim()}
            className="rounded-lg bg-[var(--accent)] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[var(--accent-hover)] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Scan
          </button>
        </div>
      </div>
    </div>
  );
};
