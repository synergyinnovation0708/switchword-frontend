"use client";

import { useEffect, useMemo, useState } from "react";
import { BackendError, browserApiRequest } from "@/lib/backend";
import { PRACTICE_FEATURE_LABELS, type PracticeFeature } from "@/lib/practice-features";
import type { AdminSubscriptionPlan, Plan } from "@/lib/types";
import { getSubscriptionPlanDefaults, plans as defaultPlans } from "../../pricing/plans";

type PlanMutationResponse = {
  plan: AdminSubscriptionPlan;
};

type PlanDeleteResponse = {
  id: string;
};

type PlanFormState = {
  slug: Plan;
  name: string;
  deck: string;
  price: number;
  cta: string;
  featured: boolean;
  sortOrder: number;
  features: string[];
  checkoutFeatures: string[];
  checkoutBillingNote: string | null;
  practiceFeatures: PracticeFeature[];
};

type ModalState =
  | { mode: "create" }
  | { mode: "edit"; planId: string }
  | { mode: "view"; planId: string };

function ViewIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20">
      <path
        d="M2.5 10s2.8-4.583 7.5-4.583S17.5 10 17.5 10s-2.8 4.583-7.5 4.583S2.5 10 2.5 10Z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />
      <circle
        cx="10"
        cy="10"
        r="2.25"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}

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

function sortPlans(plans: AdminSubscriptionPlan[]) {
  return [...plans].sort((left, right) => {
    if (left.sortOrder !== right.sortOrder) {
      return left.sortOrder - right.sortOrder;
    }

    return left.name.localeCompare(right.name);
  });
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

function getMissingPlanSlugs(existingPlans: AdminSubscriptionPlan[]) {
  return defaultPlans
    .map((plan) => plan.slug)
    .filter((slug) => !existingPlans.some((plan) => plan.slug === slug));
}

function buildFormFromDefaults(slug: Plan): PlanFormState | null {
  const defaults = getSubscriptionPlanDefaults(slug);

  if (!defaults) {
    return null;
  }

  return {
    slug: defaults.slug,
    name: defaults.name,
    deck: defaults.deck,
    price: defaults.price,
    cta: defaults.cta,
    featured: defaults.featured,
    sortOrder: defaults.sortOrder,
    features: [...defaults.features],
    checkoutFeatures: [...defaults.checkoutFeatures],
    checkoutBillingNote: defaults.checkoutBillingNote,
    practiceFeatures: [...defaults.practiceFeatures],
  };
}

function buildCreateFormState(existingPlans: AdminSubscriptionPlan[]) {
  const [firstMissingSlug] = getMissingPlanSlugs(existingPlans);

  if (!firstMissingSlug) {
    return null;
  }

  return buildFormFromDefaults(firstMissingSlug);
}

function buildFormStateFromPlan(plan: AdminSubscriptionPlan): PlanFormState {
  return {
    slug: plan.slug,
    name: plan.name,
    deck: plan.deck,
    price: plan.price,
    cta: plan.cta,
    featured: plan.featured,
    sortOrder: plan.sortOrder,
    features: [...plan.features],
    checkoutFeatures: [...plan.checkoutFeatures],
    checkoutBillingNote: plan.checkoutBillingNote,
    practiceFeatures: [...plan.practiceFeatures],
  };
}

function splitTextareaLines(value: string) {
  return value.split(/\r?\n/);
}

function normalizeTextareaLines(lines: string[]) {
  return lines
    .map((line) => line.trim())
    .filter(Boolean);
}

function formatPlanPrice(plan: PlanFormState | AdminSubscriptionPlan) {
  if (plan.slug === "whisper") {
    return {
      monthlyLabel: "\u20b90",
      secondaryLabel: "/forever free",
    };
  }

  return {
    monthlyLabel: `\u20b9${plan.price.toLocaleString("en-IN")}/mo`,
    secondaryLabel: plan.deck,
  };
}

function getModalTitle(state: ModalState | null) {
  if (!state) {
    return "";
  }

  if (state.mode === "create") {
    return "Create subscription plan";
  }

  if (state.mode === "edit") {
    return "Update subscription plan";
  }

  return "Subscription plan details";
}

export function SubscriptionPlansAdminManager({
  initialPlans,
}: {
  initialPlans: AdminSubscriptionPlan[];
}) {
  const sortedInitialPlans = sortPlans(initialPlans);
  const [plans, setPlans] = useState(sortedInitialPlans);
  const [modalState, setModalState] = useState<ModalState | null>(null);
  const [formState, setFormState] = useState<PlanFormState | null>(buildCreateFormState(sortedInitialPlans));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingPlanId, setPendingPlanId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{
    tone: "success" | "error";
    message: string;
  } | null>(null);

  const missingPlanSlugs = useMemo(() => getMissingPlanSlugs(plans), [plans]);

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

  const resetCreateForm = (nextPlans: AdminSubscriptionPlan[]) => {
    setFormState(buildCreateFormState(nextPlans));
  };

  const openCreateModal = () => {
    const nextCreateForm = buildCreateFormState(plans);

    if (!nextCreateForm) {
      setFeedback({
        tone: "error",
        message: "All core plans already exist. Delete one first if you need to recreate it.",
      });
      return;
    }

    setFormState(nextCreateForm);
    setFeedback(null);
    setModalState({ mode: "create" });
  };

  const openEditModal = (plan: AdminSubscriptionPlan) => {
    setFormState(buildFormStateFromPlan(plan));
    setFeedback(null);
    setModalState({ mode: "edit", planId: plan.id });
  };

  const openViewModal = (plan: AdminSubscriptionPlan) => {
    setFeedback(null);
    setModalState({ mode: "view", planId: plan.id });
  };

  const closeModal = () => {
    if (isSubmitting) {
      return;
    }

    setModalState(null);
  };

  const hydrateFormFromSlug = (slug: Plan) => {
    const defaults = buildFormFromDefaults(slug);

    if (!defaults) {
      return;
    }

    setFormState(defaults);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!modalState || !formState) {
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    try {
      if (modalState.mode === "create") {
        const { plan } = await browserApiRequest<PlanMutationResponse>("/admin/subscription-plans", {
          method: "POST",
          bodyJson: {
            ...formState,
            features: normalizeTextareaLines(formState.features),
            checkoutFeatures: normalizeTextareaLines(formState.checkoutFeatures),
            practiceFeatures: formState.practiceFeatures,
          },
        });
        const nextPlans = sortPlans([...plans, plan]);

        setPlans(nextPlans);
        resetCreateForm(nextPlans);
        setModalState(null);
        setFeedback({
          tone: "success",
          message: `Created ${plan.name}.`,
        });
      } else {
        const { plan } = await browserApiRequest<PlanMutationResponse>(
          `/admin/subscription-plans/${modalState.planId}`,
          {
            method: "PATCH",
            bodyJson: {
              name: formState.name,
              deck: formState.deck,
              price: formState.price,
              cta: formState.cta,
              featured: formState.featured,
              sortOrder: formState.sortOrder,
              features: normalizeTextareaLines(formState.features),
              checkoutFeatures: normalizeTextareaLines(formState.checkoutFeatures),
              checkoutBillingNote: formState.checkoutBillingNote,
              practiceFeatures: formState.practiceFeatures,
            },
          },
        );

        setPlans((currentPlans) =>
          sortPlans(currentPlans.map((currentPlan) => (currentPlan.id === modalState.planId ? plan : currentPlan))),
        );
        setModalState(null);
        setFeedback({
          tone: "success",
          message: `Saved changes for ${plan.name}.`,
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
              ? "We could not create this subscription plan right now. Please try again."
              : "We could not save this subscription plan right now. Please try again.",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (planId: string) => {
    const currentPlan = plans.find((plan) => plan.id === planId);

    if (!currentPlan) {
      return;
    }

    const confirmed = window.confirm(`Delete ${currentPlan.name} from the pricing page?`);

    if (!confirmed) {
      return;
    }

    setPendingPlanId(planId);
    setFeedback(null);

    try {
      await browserApiRequest<PlanDeleteResponse>(`/admin/subscription-plans/${planId}`, {
        method: "DELETE",
      });

      const nextPlans = plans.filter((plan) => plan.id !== planId);
      setPlans(nextPlans);
      resetCreateForm(nextPlans);
      setFeedback({
        tone: "success",
        message: `Deleted ${currentPlan.name}.`,
      });

      if (modalState && modalState.mode !== "create" && modalState.planId === planId) {
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
          message: "We could not delete this subscription plan right now. Please try again.",
        });
      }
    } finally {
      setPendingPlanId(null);
    }
  };

  const activeViewPlan =
    modalState?.mode === "view"
      ? plans.find((plan) => plan.id === modalState.planId) ?? null
      : null;

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
            Add Plan
          </button>
        </div>

        <section className="admin-stress-list-card" aria-labelledby="admin-plan-list-title">
          <div className="admin-stress-card-header">
            <div>
              <p className="admin-users-kicker">Manage</p>
              <h2 id="admin-plan-list-title">Subscription plan catalogue</h2>
            </div>
            <span className="admin-users-page-chip">{plans.length} total</span>
          </div>

          {plans.length === 0 ? (
            <p className="admin-stress-empty">
              There are no subscription plans yet. Create one to populate the pricing page.
            </p>
          ) : (
            <div className="admin-users-table-wrap admin-stress-table-wrap">
              <table className="admin-users-table admin-stress-table">
                <thead>
                  <tr>
                    <th scope="col">Plan</th>
                    <th scope="col">Price</th>
                    <th scope="col">CTA</th>
                    <th scope="col">Featured</th>
                    <th scope="col">Sort</th>
                    <th scope="col">Updated</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {plans.map((plan) => {
                    const isPending = pendingPlanId === plan.id;
                    const pricing = formatPlanPrice(plan);

                    return (
                      <tr key={plan.id}>
                        <td>
                          <div className="admin-users-primary-cell">
                            <strong>{plan.name}</strong>
                            <span>{plan.slug}</span>
                          </div>
                        </td>
                        <td>
                          <div className="admin-users-primary-cell">
                            <strong>{pricing.monthlyLabel}</strong>
                            <span>{pricing.secondaryLabel ?? plan.deck}</span>
                          </div>
                        </td>
                        <td>{plan.cta}</td>
                        <td>
                          <span className={`admin-users-status-badge${plan.featured ? "" : " admin-plan-status-badge-muted"}`}>
                            {plan.featured ? "Most Popular" : "Standard"}
                          </span>
                        </td>
                        <td>{plan.sortOrder}</td>
                        <td>{formatUpdatedAt(plan.updatedAt)}</td>
                        <td>
                          <div className="admin-stress-table-actions">
                            <button
                              aria-label={`View ${plan.name}`}
                              className="admin-stress-icon-button"
                              type="button"
                              onClick={() => openViewModal(plan)}
                            >
                              <ViewIcon />
                            </button>
                            <button
                              aria-label={`Edit ${plan.name}`}
                              className="admin-stress-icon-button"
                              type="button"
                              onClick={() => openEditModal(plan)}
                            >
                              <EditIcon />
                            </button>
                            <button
                              aria-label={`Delete ${plan.name}`}
                              className="admin-stress-icon-button admin-stress-icon-button-danger"
                              type="button"
                              disabled={isPending}
                              onClick={() => handleDelete(plan.id)}
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

      {modalState?.mode === "view" && activeViewPlan ? (
        <div className="admin-stress-modal-backdrop" onClick={closeModal}>
          <section
            aria-labelledby="admin-plan-view-modal-title"
            aria-modal="true"
            className="admin-stress-modal admin-plan-modal"
            role="dialog"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="admin-stress-modal-header">
              <div>
                <p className="admin-users-kicker">View Plan</p>
                <h2 id="admin-plan-view-modal-title">{getModalTitle(modalState)}</h2>
              </div>

              <button
                aria-label="Close modal"
                className="admin-stress-modal-close"
                type="button"
                onClick={closeModal}
              >
                ×
              </button>
            </div>

            <div className="admin-plan-modal-layout">
              <div className="admin-plan-editor-block admin-plan-view-stack">
                <div className="admin-stress-card-header admin-stress-card-header-inline">
                  <div>
                    <p className="admin-stress-card-kicker">{activeViewPlan.slug}</p>
                    <h3 className="admin-stress-card-title">{activeViewPlan.name}</h3>
                  </div>
                  <span
                    className={`admin-users-status-badge${activeViewPlan.featured ? "" : " admin-plan-status-badge-muted"}`}
                  >
                    {activeViewPlan.featured ? "Most Popular" : "Standard"}
                  </span>
                </div>

                <div className="admin-plan-view-grid">
                  <div className="admin-plan-view-copy">
                    <span>Price</span>
                    <strong>{formatPlanPrice(activeViewPlan).monthlyLabel}</strong>
                  </div>
                  <div className="admin-plan-view-copy">
                    <span>CTA</span>
                    <strong>{activeViewPlan.cta}</strong>
                  </div>
                  <div className="admin-plan-view-copy">
                    <span>Sort Order</span>
                    <strong>{activeViewPlan.sortOrder}</strong>
                  </div>
                  <div className="admin-plan-view-copy">
                    <span>Updated</span>
                    <strong>{formatUpdatedAt(activeViewPlan.updatedAt)}</strong>
                  </div>
                </div>

                <div className="admin-plan-view-copy">
                  <span>Deck</span>
                  <p>{activeViewPlan.deck}</p>
                </div>
              </div>

              <div className="admin-plan-editor-block admin-plan-view-stack">
                <div className="admin-plan-view-copy">
                  <span>Pricing Card Features</span>
                  <ul className="admin-plan-view-list">
                    {activeViewPlan.features.map((feature) => (
                      <li key={feature}>{feature}</li>
                    ))}
                  </ul>
                </div>

                <div className="admin-plan-view-copy">
                  <span>Checkout Summary Features</span>
                  <ul className="admin-plan-view-list">
                    {activeViewPlan.checkoutFeatures.map((feature) => (
                      <li key={feature}>{feature}</li>
                    ))}
                  </ul>
                </div>

                <div className="admin-plan-view-copy">
                  <span>Billing Note</span>
                  <p>{activeViewPlan.checkoutBillingNote ?? "No billing note added."}</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      ) : null}

      {modalState && modalState.mode !== "view" && formState ? (
        <div className="admin-stress-modal-backdrop" onClick={closeModal}>
          <section
            aria-labelledby="admin-plan-modal-title"
            aria-modal="true"
            className="admin-stress-modal admin-plan-modal"
            role="dialog"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="admin-stress-modal-header">
              <div>
                <p className="admin-users-kicker">
                  {modalState.mode === "create" ? "Create Plan" : "Edit Plan"}
                </p>
                <h2 id="admin-plan-modal-title">{getModalTitle(modalState)}</h2>
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

            <div className="admin-plan-modal-layout">
              <form className="admin-stress-form admin-stress-modal-form" onSubmit={handleSubmit}>
                <div className="admin-plan-editor-block">
                  <p className="admin-users-kicker">Basics</p>

                  <div className="admin-stress-form-grid">
                    <label className="admin-field">
                      <span>Plan slug</span>
                      {modalState.mode === "create" ? (
                        <select
                          name="slug"
                          value={formState.slug}
                          onChange={(event) => hydrateFormFromSlug(event.target.value as Plan)}
                        >
                          {missingPlanSlugs.map((slug) => (
                            <option key={slug} value={slug}>
                              {slug}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input disabled value={formState.slug} />
                      )}
                    </label>

                    <label className="admin-field">
                      <span>Plan name</span>
                      <input
                        name="name"
                        value={formState.name}
                        onChange={(event) =>
                          setFormState((currentForm) =>
                            currentForm ? { ...currentForm, name: event.target.value } : currentForm,
                          )
                        }
                      />
                    </label>

                    <label className="admin-field">
                      <span>Monthly price</span>
                      <input
                        inputMode="numeric"
                        name="price"
                        type="number"
                        value={formState.price}
                        onChange={(event) =>
                          setFormState((currentForm) =>
                            currentForm
                              ? { ...currentForm, price: Number(event.target.value || 0) }
                              : currentForm,
                          )
                        }
                      />
                    </label>
                  </div>

                  <div className="admin-stress-form-grid">
                    <label className="admin-field">
                      <span>Deck</span>
                      <input
                        name="deck"
                        value={formState.deck}
                        onChange={(event) =>
                          setFormState((currentForm) =>
                            currentForm ? { ...currentForm, deck: event.target.value } : currentForm,
                          )
                        }
                      />
                    </label>

                    <label className="admin-field">
                      <span>CTA label</span>
                      <input
                        name="cta"
                        value={formState.cta}
                        onChange={(event) =>
                          setFormState((currentForm) =>
                            currentForm ? { ...currentForm, cta: event.target.value } : currentForm,
                          )
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
                          setFormState((currentForm) =>
                            currentForm
                              ? { ...currentForm, sortOrder: Number(event.target.value || 0) }
                              : currentForm,
                          )
                        }
                      />
                    </label>
                  </div>

                  <label className="admin-toggle">
                    <input
                      checked={formState.featured}
                      type="checkbox"
                      onChange={(event) =>
                        setFormState((currentForm) =>
                          currentForm ? { ...currentForm, featured: event.target.checked } : currentForm,
                        )
                      }
                    />
                    <span>Mark as most popular</span>
                  </label>
                </div>

                <div className="admin-plan-editor-block">
                  <p className="admin-users-kicker">Content</p>

                  <label className="admin-field">
                    <span>Pricing card features</span>
                    <textarea
                      className="admin-stress-textarea"
                      rows={6}
                      value={formState.features.join("\n")}
                      onChange={(event) =>
                        setFormState((currentForm) =>
                          currentForm
                            ? { ...currentForm, features: splitTextareaLines(event.target.value) }
                            : currentForm,
                        )
                      }
                    />
                  </label>

                  <label className="admin-field">
                    <span>Checkout summary features</span>
                    <textarea
                      className="admin-stress-textarea"
                      rows={5}
                      value={formState.checkoutFeatures.join("\n")}
                      onChange={(event) =>
                        setFormState((currentForm) =>
                          currentForm
                            ? {
                                ...currentForm,
                                checkoutFeatures: splitTextareaLines(event.target.value),
                              }
                            : currentForm,
                        )
                      }
                    />
                  </label>

                  <label className="admin-field">
                    <span>Billing note</span>
                    <textarea
                      className="admin-stress-textarea"
                      rows={4}
                      value={formState.checkoutBillingNote ?? ""}
                      onChange={(event) =>
                        setFormState((currentForm) =>
                          currentForm
                            ? { ...currentForm, checkoutBillingNote: event.target.value || null }
                            : currentForm,
                        )
                      }
                    />
                  </label>

                  <div className="admin-field">
                    <span>Unlocked practice sections</span>
                    <div className="admin-plan-feature-grid">
                      {(
                        Object.entries(PRACTICE_FEATURE_LABELS) as [
                          PracticeFeature,
                          string,
                        ][]
                      ).map(([featureKey, featureLabel]) => {
                        const isChecked = formState.practiceFeatures.includes(featureKey);

                        return (
                          <label className="admin-plan-feature-option" key={featureKey}>
                            <input
                              checked={isChecked}
                              type="checkbox"
                              onChange={(event) =>
                                setFormState((currentForm) => {
                                  if (!currentForm) {
                                    return currentForm;
                                  }

                                  return {
                                    ...currentForm,
                                    practiceFeatures: event.target.checked
                                      ? [...currentForm.practiceFeatures, featureKey]
                                      : currentForm.practiceFeatures.filter(
                                          (currentFeature) => currentFeature !== featureKey,
                                        ),
                                  };
                                })
                              }
                            />
                            <span>{featureLabel}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="admin-stress-modal-actions">
                  <button
                    className="admin-stress-table-button"
                    type="button"
                    disabled={isSubmitting}
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                  <button className="admin-submit admin-stress-modal-submit" disabled={isSubmitting} type="submit">
                    {isSubmitting
                      ? modalState.mode === "create"
                        ? "Creating..."
                        : "Saving..."
                      : modalState.mode === "create"
                        ? "Create Plan"
                        : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}
