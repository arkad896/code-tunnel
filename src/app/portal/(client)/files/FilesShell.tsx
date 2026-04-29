"use client";

import { FileText, Link2, ExternalLink, FolderOpen } from "lucide-react";

interface Deliverable {
  id: string;
  project_id: string;
  label: string;
  type: "file" | "link";
  url: string;
  signedUrl?: string | null;
  created_at: string;
}

interface FilesShellProps {
  deliverables: Deliverable[];
  project: any | null;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function FilesShell({ deliverables, project }: FilesShellProps) {
  if (!project) {
    return (
      <div className="p-8 lg:p-12">
        <div className="mb-10">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
            Files
          </h1>
          <p className="text-zinc-500 text-sm mt-1">
            Your project deliverables and shared files
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-zinc-200 p-12 text-center">
          <FolderOpen className="w-10 h-10 text-zinc-300 mx-auto mb-4" />
          <p className="text-zinc-400 text-sm">
            No project found. Files will appear once a project is assigned.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 lg:p-12">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
          Files
        </h1>
        <p className="text-zinc-500 text-sm mt-1">
          Deliverables and shared files for {project.name}
        </p>
      </div>

      {/* Empty state */}
      {deliverables.length === 0 ? (
        <div className="bg-white rounded-2xl border border-zinc-200 p-12 text-center">
          <FolderOpen className="w-10 h-10 text-zinc-300 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-zinc-900 mb-2">
            No files shared yet
          </h2>
          <p className="text-zinc-500 text-sm max-w-md mx-auto">
            Your deliverables will appear here once your team shares files or
            links with you.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {deliverables.map((d) => (
            <div
              key={d.id}
              className="bg-white rounded-2xl border border-zinc-200 p-5 flex items-start gap-4 group hover:border-zinc-300 transition-colors"
            >
              {/* Icon */}
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  d.type === "file"
                    ? "bg-blue-50"
                    : "bg-violet-50"
                }`}
              >
                {d.type === "file" ? (
                  <FileText className="w-5 h-5 text-blue-600" />
                ) : (
                  <Link2 className="w-5 h-5 text-violet-600" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-zinc-900 truncate">
                  {d.label}
                </p>
                <div className="flex items-center gap-3 mt-1">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-widest ${
                      d.type === "file"
                        ? "bg-blue-50 text-blue-600"
                        : "bg-violet-50 text-violet-600"
                    }`}
                  >
                    {d.type}
                  </span>
                  <span className="text-xs text-zinc-400">
                    {formatDate(d.created_at)}
                  </span>
                </div>
              </div>

              {/* Action */}
              <a
                href={
                  d.type === "file" 
                    ? (d.signedUrl ?? "#") 
                    : (d.url.trim().toLowerCase().startsWith("javascript:") ? "#" : d.url)
                }
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 w-9 h-9 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-500 hover:bg-zinc-900 hover:text-white transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
