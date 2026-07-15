"use client";

import { useEffect, useState } from "react";
import { BackendError, browserApiRequest } from "@/lib/backend";
import type { AdminStressFinderEntry } from "@/lib/types";

type EntryMutationResponse = {
  entry: AdminStressFinderEntry;
};

type EntryDeleteResponse = {
  id: string;
};

type EntryFormState = {
  label: string;
  word: string;
  description: string;
  sortOrder: number;
};

type ModalState =
  | { mode: "create" }
  | { mode: "edit"; entryId: string };

function EditIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20">
      <path
        d="M13.958 3.542a1.768 1.768 0 1 1 2.5 2.5L8.125 14.375l-3.333.833.833-3.333 8.333-8.333Z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />
      <path
        d="M12.5 5l2.5 2.5"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20">
      <path
        d="M4.167 5.833h11.666"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.6"
      />
      <path
        d="M7.5 5.833V4.583c0-.46.373-.833.833-.833h3.334c.46 0 .833.373.833.833v1.25"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />
      <path
        d="M6.667 8.333v5.834c0 .92.746 1.666 1.666 1.666h3.334c.92 0 1.666-.746 1.666-1.666V8.333"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />
      <path
        d="M8.75 10v3.333M11.25 10v3.333"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.6"
      />
    </svg>
  );
}

function sortEntries(entries: AdminStressFinderEntry[]) {
  return [...entries].sort((left, right) => {
    if (left.sortOrder !== right.sortOrder) {
      return left.sortOrder - right.sortOrder;
    }

    return left.label.localeCompare(right.label);
  });
}

function getNextSortOrder(entries: AdminStressFinderEntry[]) {
  const highestSortOrder = entries.reduce(
    (highestValue, entry) => Math.max(highestValue, entry.sortOrder),
    0,
  );

  return highestSortOrder + 10;
}

function buildEmptyFormState(entries: AdminStressFinderEntry[]): EntryFormState {
  return {
    label: "",
    word: "",
    description: "",
    sortOrder: getNextSortOrder(entries),
  };
}

function buildFormStateFromEntry(entry: AdminStressFinderEntry): EntryFormState {
  return {
    label: entry.label,
    word: entry.word,
    description: entry.description,
    sortOrder: entry.sortOrder,
  };
}

function formatUpdatedAt(value: string) {
  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(parsed);
}

function getModalTitle(state: ModalState | null) {
  if (!state) {
    return "";
  }

  return state.mode === "create" ? "Add a new homepage concern" : "Edit homepage concern";
}

export function StressFinderAdminManager({
  initialEntries,
}: {
  initialEntries: AdminStressFinderEntry[];
}) {
  const sortedInitialEntries = sortEntries(initialEntries);
  const [entries, setEntries] = useState(sortedInitialEntries);
  const [modalState, setModalState] = useState<ModalState | null>(null);
  const [formState, setFormState] = useState<EntryFormState>(buildEmptyFormState(sortedInitialEntries));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingEntryId, setPendingEntryId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{
    tone: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    if (!modalState) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isSubmitting) {
        setModalState(null);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isSubmitting, modalState]);

  const openCreateModal = () => {
    setFormState(buildEmptyFormState(entries));
    setFeedback(null);
    setModalState({ mode: "create" });
  };

  const openEditModal = (entry: AdminStressFinderEntry) => {
    setFormState(buildFormStateFromEntry(entry));
    setFeedback(null);
    setModalState({ mode: "edit", entryId: entry.id });
  };

  const closeModal = () => {
    if (isSubmitting) {
      return;
    }

    setModalState(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!modalState) {
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    try {
      if (modalState.mode === "create") {
        const { entry } = await browserApiRequest<EntryMutationResponse>("/admin/stress-finder", {
          method: "POST",
          bodyJson: formState,
        });
        const nextEntries = sortEntries([...entries, entry]);

        setEntries(nextEntries);
        setFormState(buildEmptyFormState(nextEntries));
        setModalState(null);
        setFeedback({
          tone: "success",
          message: "New homepage concern added successfully.",
        });
      } else {
        const { entry } = await browserApiRequest<EntryMutationResponse>(
          `/admin/stress-finder/${modalState.entryId}`,
          {
            method: "PATCH",
            bodyJson: formState,
          },
        );

        setEntries((currentEntries) =>
          sortEntries(
            currentEntries.map((currentEntry) =>
              currentEntry.id === modalState.entryId ? entry : currentEntry,
            ),
          ),
        );
        setModalState(null);
        setFeedback({
          tone: "success",
          message: `Saved changes for "${entry.label}".`,
        });
      }
    } catch (error) {
      if (error instanceof BackendError) {
        setFeedback({
          tone: "error",
          message: error.message,
        });
      } else {
        setFeedback({
          tone: "error",
          message:
            modalState.mode === "create"
              ? "We could not create this entry right now. Please try again."
              : "We could not save these changes right now. Please try again.",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (entryId: string) => {
    const currentEntry = entries.find((entry) => entry.id === entryId);

    if (!currentEntry) {
      return;
    }

    const confirmed = window.confirm(
      `Delete "${currentEntry.label}" from the homepage stress finder?`,
    );

    if (!confirmed) {
      return;
    }

    setPendingEntryId(entryId);
    setFeedback(null);

    try {
      await browserApiRequest<EntryDeleteResponse>(`/admin/stress-finder/${entryId}`, {
        method: "DELETE",
      });

      const nextEntries = entries.filter((entry) => entry.id !== entryId);
      setEntries(nextEntries);
      setFeedback({
        tone: "success",
        message: `Deleted "${currentEntry.label}".`,
      });

      if (modalState?.mode === "edit" && modalState.entryId === entryId) {
        setModalState(null);
      }
    } catch (error) {
      if (error instanceof BackendError) {
        setFeedback({
          tone: "error",
          message: error.message,
        });
      } else {
        setFeedback({
          tone: "error",
          message: "We could not delete this entry right now. Please try again.",
        });
      }
    } finally {
      setPendingEntryId(null);
    }
  };

  return (
    <>
      <div className="admin-stress-layout">
        <div className="admin-stress-toolbar-actions">
          {feedback ? (
            <p
              className={`auth-feedback ${feedback.tone === "error" ? "auth-feedback-error" : "auth-feedback-success"}`}
              aria-live="polite"
            >
              {feedback.message}
            </p>
          ) : null}

          <button className="admin-submit admin-stress-add-button" type="button" onClick={openCreateModal}>
            Add Concern
          </button>
        </div>

        <section className="admin-stress-list-card" aria-labelledby="admin-stress-list-title">
          <div className="admin-stress-card-header">
            <div>
              <p className="admin-users-kicker">Manage</p>
              <h2 id="admin-stress-list-title">Stress finder catalogue</h2>
            </div>
            <span className="admin-users-page-chip">{entries.length} total</span>
          </div>

          {entries.length === 0 ? (
            <p className="admin-stress-empty">
              There are no entries yet. Create the first one to populate the homepage.
            </p>
          ) : (
            <div className="admin-users-table-wrap admin-stress-table-wrap">
              <table className="admin-users-table admin-stress-table">
                <thead>
                  <tr>
                    <th scope="col">Concern</th>
                    <th scope="col">Switchword</th>
                    <th scope="col">Description</th>
                    <th scope="col">Sort</th>
                    <th scope="col">Updated</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry) => {
                    const isPending = pendingEntryId === entry.id;

                    return (
                      <tr key={entry.id}>
                        <td>
                          <div className="admin-users-primary-cell">
                            <strong>{entry.label}</strong>
                            <span>Homepage concern</span>
                          </div>
                        </td>
                        <td>
                          <span className="admin-stress-word-badge">{entry.word}</span>
                        </td>
                        <td>
                          <p className="admin-stress-table-description">{entry.description}</p>
                        </td>
                        <td>{entry.sortOrder}</td>
                        <td>{formatUpdatedAt(entry.updatedAt)}</td>
                        <td>
                          <div className="admin-stress-table-actions">
                            <button
                              aria-label={`Edit ${entry.label}`}
                              className="admin-stress-icon-button"
                              type="button"
                              onClick={() => openEditModal(entry)}
                            >
                              <EditIcon />
                            </button>
                            <button
                              aria-label={`Delete ${entry.label}`}
                              className="admin-stress-icon-button admin-stress-icon-button-danger"
                              type="button"
                              disabled={isPending}
                              onClick={() => handleDelete(entry.id)}
                            >
                              <TrashIcon />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      {modalState ? (
        <div
          aria-hidden={isSubmitting ? "true" : undefined}
          className="admin-stress-modal-backdrop"
          onClick={closeModal}
        >
          <section
            aria-labelledby="admin-stress-modal-title"
            aria-modal="true"
            className="admin-stress-modal"
            role="dialog"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="admin-stress-modal-header">
              <div>
                <p className="admin-users-kicker">
                  {modalState.mode === "create" ? "Create Entry" : "Edit Entry"}
                </p>
                <h2 id="admin-stress-modal-title">{getModalTitle(modalState)}</h2>
              </div>

              <button
                aria-label="Close modal"
                className="admin-stress-modal-close"
                type="button"
                disabled={isSubmitting}
                onClick={closeModal}
              >
                ×
              </button>
            </div>

            <form className="admin-stress-form admin-stress-modal-form" onSubmit={handleSubmit}>
              <div className="admin-stress-form-grid">
                <label className="admin-field">
                  <span>Concern label</span>
                  <input
                    name="label"
                    placeholder="Financial stress"
                    value={formState.label}
                    onChange={(event) =>
                      setFormState((currentForm) => ({
                        ...currentForm,
                        label: event.target.value,
                      }))
                    }
                  />
                </label>

                <label className="admin-field">
                  <span>Switchword</span>
                  <input
                    name="word"
                    placeholder="COUNT"
                    value={formState.word}
                    onChange={(event) =>
                      setFormState((currentForm) => ({
                        ...currentForm,
                        word: event.target.value.toUpperCase(),
                      }))
                    }
                  />
                </label>

                <label className="admin-field">
                  <span>Sort order</span>
                  <input
                    inputMode="numeric"
                    name="sortOrder"
                    type="number"
                    value={formState.sortOrder}
                    onChange={(event) =>
                      setFormState((currentForm) => ({
                        ...currentForm,
                        sortOrder: Number(event.target.value || 0),
                      }))
                    }
                  />
                </label>
              </div>

              <label className="admin-field">
                <span>Description</span>
                <textarea
                  className="admin-stress-textarea"
                  name="description"
                  placeholder="Add the guidance shown after someone selects this concern."
                  rows={5}
                  value={formState.description}
                  onChange={(event) =>
                    setFormState((currentForm) => ({
                      ...currentForm,
                      description: event.target.value,
                    }))
                  }
                />
              </label>

              <div className="admin-stress-modal-actions">
                <button
                  className="admin-stress-table-button"
                  type="button"
                  disabled={isSubmitting}
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button className="admin-submit admin-stress-modal-submit" type="submit" disabled={isSubmitting}>
                  {isSubmitting
                    ? modalState.mode === "create"
                      ? "Adding..."
                      : "Saving..."
                    : modalState.mode === "create"
                      ? "Add Concern"
                      : "Save Changes"}
                </button>
              </div>
            </form>
          </section>
        </div>
      ) : null}
    </>
  );
}
