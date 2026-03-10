// ─────────────────────────────────────────────────────────
//  components.jsx  —  Modal, StudentForm, DeleteConfirm,
//                     StudentsTable, Toast, Footer
//  Designed by Bilal · bilaljaved1002@gmail.com
// ─────────────────────────────────────────────────────────

import { useState, useEffect, useRef } from "react";
import { validateStudent } from "./helpers";

// ── Modal ──────────────────────────────────────────
// generic wrapper — just pass a title, onClose, and children
export function Modal({ title, onClose, children }) {
  // let people hit Escape to dismiss
  useEffect(() => {
    const fn = e => e.key === "Escape" && onClose();
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-zinc-900 border border-zinc-700/60 rounded-2xl shadow-2xl p-7"
        onClick={e => e.stopPropagation()}
      >
        {/* header row */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-zinc-100 tracking-tight">{title}</h2>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-200 transition-colors text-base p-1.5 rounded-lg hover:bg-zinc-800"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ── FormField ──────────────────────────────────────
// IMPORTANT: defined outside StudentForm so React doesn't
// treat it as a new component type on every render.
// That was the bug — defining it inside caused the input
// to unmount/remount on each keystroke, killing focus.
function FormField({ label, type = "text", placeholder, value, error, onChange, onEnter, inputRef, extra = {} }) {
  return (
    <div className="mb-4">
      <label className="block text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-1.5">
        {label}
      </label>
      <input
        ref={inputRef}
        type={type}
        value={value}
        onChange={onChange}
        onKeyDown={e => e.key === "Enter" && onEnter()}
        placeholder={placeholder}
        className={`w-full px-3.5 py-2.5 rounded-xl text-sm text-zinc-100 placeholder-zinc-600 bg-zinc-800 border outline-none transition-colors
          ${error
            ? "border-red-500/60 bg-red-950/20 focus:border-red-400"
            : "border-zinc-700 focus:border-amber-500/70"
          }`}
        {...extra}
      />
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}

// ── StudentForm ────────────────────────────────────
// handles both add and edit — pass `initial` when editing
export function StudentForm({ initial, onSave, onCancel }) {
  const [fields, setFields] = useState(initial ?? { name: "", email: "", age: "" });
  const [errors, setErrors] = useState({});
  const nameRef = useRef(null);

  useEffect(() => { nameRef.current?.focus(); }, []);

  function change(key) {
    return e => {
      setFields(p => ({ ...p, [key]: e.target.value }));
      // clear the error for this field as soon as user types
      if (errors[key]) setErrors(p => ({ ...p, [key]: null }));
    };
  }

  function submit() {
    const errs = validateStudent(fields);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSave(fields);
  }

  return (
    <div>
      <FormField
        label="Full Name"
        placeholder="e.g. Aarav Sharma"
        value={fields.name}
        error={errors.name}
        onChange={change("name")}
        onEnter={submit}
        inputRef={nameRef}
      />
      <FormField
        label="Email Address"
        type="email"
        placeholder="e.g. aarav@uni.edu"
        value={fields.email}
        error={errors.email}
        onChange={change("email")}
        onEnter={submit}
      />
      <FormField
        label="Age"
        type="number"
        placeholder="e.g. 21"
        value={fields.age}
        error={errors.age}
        onChange={change("age")}
        onEnter={submit}
        extra={{ min: 5, max: 100 }}
      />

      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-zinc-400 border border-zinc-700 rounded-xl hover:text-zinc-200 hover:border-zinc-500 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={submit}
          className="px-5 py-2 text-sm font-semibold bg-amber-500 text-zinc-950 rounded-xl hover:bg-amber-400 active:scale-95 transition-all"
        >
          {initial ? "Save Changes" : "Add Student"}
        </button>
      </div>
    </div>
  );
}

// ── DeleteConfirm ──────────────────────────────────
export function DeleteConfirm({ student, onConfirm, onCancel }) {
  return (
    <Modal title="Delete Student" onClose={onCancel}>
      <p className="text-sm text-zinc-400 leading-relaxed mb-6">
        You're about to delete{" "}
        <span className="font-semibold text-zinc-200">{student.name}</span>.
        {" "}This can't be undone — sure about this?
      </p>
      <div className="flex justify-end gap-3">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-zinc-400 border border-zinc-700 rounded-xl hover:text-zinc-200 hover:border-zinc-500 transition-colors"
        >
          Nope, keep them
        </button>
        <button
          onClick={onConfirm}
          className="px-5 py-2 text-sm font-semibold bg-red-500 text-white rounded-xl hover:bg-red-400 active:scale-95 transition-all"
        >
          Yes, delete
        </button>
      </div>
    </Modal>
  );
}

// ── StudentsTable ──────────────────────────────────
// pure display component — all logic stays in App
export function StudentsTable({ students, onEdit, onDelete }) {
  if (students.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-20 text-zinc-600">
        <span className="text-5xl">🎓</span>
        <p className="text-sm font-medium">No students found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-zinc-800/50 border-b border-zinc-800">
            {["#", "Name", "Email", "Age", "Actions"].map(h => (
              <th
                key={h}
                className={`px-5 py-3.5 text-xs font-semibold uppercase tracking-widest text-zinc-500
                  ${h === "Actions" ? "text-center" : "text-left"}`}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {students.map((s, i) => (
            <tr
              key={s.id}
              className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors"
            >
              <td className="px-5 py-4 text-zinc-600 text-xs tabular-nums">{i + 1}</td>
              <td className="px-5 py-4 font-semibold text-zinc-100">{s.name}</td>
              <td className="px-5 py-4 text-zinc-500 text-xs">{s.email}</td>
              <td className="px-5 py-4">
                <span className="inline-block px-2.5 py-0.5 text-xs font-bold rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  {s.age}
                </span>
              </td>
              <td className="px-5 py-4 text-center">
                <button
                  onClick={() => onEdit(s)}
                  title="Edit"
                  className="inline-flex items-center justify-center w-8 h-8 rounded-lg hover:bg-blue-400/10 hover:text-blue-400 transition-colors mr-1"
                >
                  ✏️
                </button>
                <button
                  onClick={() => onDelete(s)}
                  title="Delete"
                  className="inline-flex items-center justify-center w-8 h-8 rounded-lg hover:bg-red-400/10 hover:text-red-400 transition-colors"
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Toast ──────────────────────────────────────────
export function Toast({ toast }) {
  if (!toast) return null;
  const ok = toast.type === "success";
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-semibold shadow-2xl
      ${ok ? "bg-emerald-500 text-emerald-950" : "bg-red-500 text-white"}`}
    >
      <span className="font-bold text-base leading-none">{ok ? "✓" : "✕"}</span>
      {toast.message}
    </div>
  );
}

// ── Footer ─────────────────────────────────────────
export function Footer() {
  return (
    <footer className="mt-12 pt-5 border-t border-zinc-800/60">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <span className="text-zinc-600 text-xs font-light">Designed &amp; Built by</span>
        <span className="text-amber-400 text-sm font-bold tracking-wide">Bilal</span>
        <span className="text-zinc-700 text-sm">·</span>
        <a
          href="mailto:bilaljaved1002@gmail.com"
          className="text-zinc-600 hover:text-amber-400 transition-colors text-xs"
        >
          bilaljaved1002@gmail.com
        </a>
      </div>
    </footer>
  );
}