"use client";

import { FormEvent, useState } from "react";
import { Modal } from "@/components/Modal";
import { Button } from "@/components/ui/Button";
import { api } from "@/lib/api";
import type { Extraction } from "@/lib/api";

interface ImproveModalProps {
  extraction: Extraction;
  onClose: () => void;
  onUpdated: (updated: Extraction) => void;
}

export function ImproveModal({ extraction, onClose, onUpdated }: ImproveModalProps) {
  const [instructions, setInstructions] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!instructions.trim()) return;
    setError("");
    setLoading(true);
    try {
      const updated = await api.improveExtraction(extraction.id, instructions.trim());
      onUpdated(updated);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al mejorar la extracción");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open onClose={onClose} title="Mejorar extracción" size="md">
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
            {error}
          </div>
        )}

        <p className="text-sm text-slate-600">
          Describe qué quieres corregir o ampliar en la extracción de{" "}
          <span className="font-medium text-slate-800">{extraction.filename}</span>.
          La IA regenerará los documentos con tus indicaciones.
        </p>

        <textarea
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          placeholder="Ej: El cliente es ENDESA, no Iberdrola. Añadir el kickoff date del email adjunto..."
          rows={6}
          required
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />

        <div className="flex gap-3 justify-end pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={loading || !instructions.trim()}>
            {loading ? "Regenerando…" : "Regenerar documentos"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
