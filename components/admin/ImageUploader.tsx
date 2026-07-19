"use client";

import { useRef, useState } from "react";
import { Upload, Link2, X, Star } from "lucide-react";

/** Resizes an image file client-side and returns a compact JPEG data URL. */
function resizeImage(file: File, maxWidth = 900, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new window.Image();
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width);
        const canvas = document.createElement("canvas");
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas not supported"));
          return;
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = () => reject(new Error("Could not read image"));
      img.src = reader.result as string;
    };
    reader.onerror = () => reject(new Error("Could not read file"));
    reader.readAsDataURL(file);
  });
}

export default function ImageUploader({
  images,
  onChange,
}: {
  images: string[];
  onChange: (images: string[]) => void;
}) {
  const [urlValue, setUrlValue] = useState("");
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || !files.length) return;
    setBusy(true);
    try {
      const candidates = Array.from(files)
        .filter((file) => file.type.startsWith("image/"))
        .slice(0, 4);
      const results = await Promise.all(
        candidates.map((file) => resizeImage(file).catch(() => null))
      );
      const successful = results.filter((src): src is string => src !== null);
      if (successful.length > 0) onChange([...images, ...successful]);
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function addUrl() {
    const trimmed = urlValue.trim();
    if (!trimmed) return;
    onChange([...images, trimmed]);
    setUrlValue("");
  }

  function removeAt(index: number) {
    onChange(images.filter((_, i) => i !== index));
  }

  function makePrimary(index: number) {
    if (index === 0) return;
    const next = [...images];
    const [chosen] = next.splice(index, 1);
    next.unshift(chosen);
    onChange(next);
  }

  return (
    <div>
      {images.length > 0 && (
        <div className="mb-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
          {images.map((src, index) => (
            <div
              key={`${src.slice(0, 40)}-${index}`}
              className="group relative aspect-square overflow-hidden rounded-lg border border-ink/10 bg-bone"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`Product image ${index + 1}`}
                className="h-full w-full object-cover"
              />
              {index === 0 && (
                <span className="absolute left-1.5 top-1.5 flex items-center gap-1 rounded-full bg-volt px-2 py-0.5 font-mono text-[8px] uppercase tracking-widest2 text-paper">
                  <Star size={9} fill="currentColor" /> Cover
                </span>
              )}
              <div className="absolute inset-0 flex items-center justify-center gap-1.5 bg-ink/0 opacity-0 transition-all duration-200 group-hover:bg-ink/50 group-hover:opacity-100">
                {index !== 0 && (
                  <button
                    type="button"
                    onClick={() => makePrimary(index)}
                    aria-label="Set as cover image"
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-paper text-ink hover:bg-volt hover:text-paper"
                  >
                    <Star size={13} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeAt(index)}
                  aria-label="Remove image"
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-paper text-ink hover:bg-red-600 hover:text-paper"
                >
                  <X size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        disabled={busy}
        className="flex w-full items-center justify-center gap-2 border border-dashed border-ink/25 py-3 font-mono text-[11px] uppercase tracking-widest2 text-ink transition-colors duration-300 hover:border-ink disabled:opacity-50"
      >
        <Upload size={14} />
        {busy ? "Processing…" : "Upload Images"}
      </button>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      <div className="mt-3 flex gap-2">
        <input
          type="url"
          value={urlValue}
          onChange={(e) => setUrlValue(e.target.value)}
          placeholder="Or paste an image URL"
          className="w-full border border-ink/20 bg-paper px-4 py-2.5 text-sm text-ink placeholder:text-ink/30 focus:border-ink focus:outline-none"
        />
        <button
          type="button"
          onClick={addUrl}
          className="flex shrink-0 items-center gap-1.5 border border-ink/20 px-4 py-2.5 font-mono text-[11px] uppercase tracking-widest2 text-ink transition-colors duration-300 hover:border-ink"
        >
          <Link2 size={13} />
          Add
        </button>
      </div>
      <p className="mt-2 font-mono text-[10px] uppercase tracking-widest2 text-smoke/70">
        Demo mode — uploaded images are stored locally in this browser only.
      </p>
    </div>
  );
}
