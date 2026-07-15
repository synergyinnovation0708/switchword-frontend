"use client";

import Link from "next/link";
import { useState } from "react";
import { BackendError, browserApiRequest } from "@/lib/backend";
import type { SettingsPayload } from "@/lib/types";

export function SettingsPanel({ initialSettings }: { initialSettings: SettingsPayload }) {
  const [settings, setSettings] = useState(initialSettings);
  const [isSaving, setIsSaving] = useState<null | "email" | "whatsapp">(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const deliveryPreferences = [
    {
      label: "Email delivery",
      detail: "Daily word at 7:00 AM",
      kind: "email" as const,
    },
    {
      label: "WhatsApp delivery",
      detail: "Daily word at 7:00 AM",
      kind: "whatsapp" as const,
    },
  ];

  const contactDetails = [
    {
      label: "WhatsApp Number",
      value: settings.phone,
    },
    {
      label: "Email",
      value: settings.email,
    },
  ];

  const saveDeliveryPrefs = async (nextSettings: SettingsPayload["deliveryPrefs"], activeKey: "email" | "whatsapp") => {
    setFormError(null);
    setSuccessMessage(null);
    setIsSaving(activeKey);

    try {
      const payload = await browserApiRequest<SettingsPayload>("/settings/delivery", {
        method: "PUT",
        bodyJson: nextSettings,
      });

      setSettings(payload);
      setSuccessMessage("Preferences updated.");
    } catch (error) {
      if (error instanceof BackendError) {
        setFormError(error.message);
      } else {
        setFormError("We could not save your preferences right now.");
      }
    } finally {
      setIsSaving(null);
    }
  };

  function togglePreference(kind: "email" | "whatsapp") {
    const nextPrefs = {
      emailEnabled:
        kind === "email" ? !settings.deliveryPrefs.emailEnabled : settings.deliveryPrefs.emailEnabled,
      whatsappEnabled:
        kind === "whatsapp"
          ? !settings.deliveryPrefs.whatsappEnabled
          : settings.deliveryPrefs.whatsappEnabled,
    };

    void saveDeliveryPrefs(nextPrefs, kind);
  }

  function DeliveryToggle({ enabled }: { enabled: boolean }) {
    return (
      <span className={`practice-settings-toggle${enabled ? " practice-settings-toggle-active" : ""}`} aria-hidden="true">
        <span className="practice-settings-toggle-knob" />
      </span>
    );
  }

  function EmailIcon() {
    return (
      <svg aria-hidden="true" className="practice-settings-pref-icon" viewBox="0 0 20 20">
        <path
          d="M3.5 5.6A1.6 1.6 0 0 1 5.1 4h9.8a1.6 1.6 0 0 1 1.6 1.6v8.8a1.6 1.6 0 0 1-1.6 1.6H5.1a1.6 1.6 0 0 1-1.6-1.6V5.6Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.35"
        />
        <path
          d="m4.4 5 5.1 4.4a.78.78 0 0 0 1 0L15.6 5"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.35"
        />
      </svg>
    );
  }

  function WhatsAppIcon() {
    return (
      <svg aria-hidden="true" className="practice-settings-pref-icon" viewBox="0 0 20 20">
        <path
          d="M10 3.3a6.2 6.2 0 0 1 6.2 6.2A6.2 6.2 0 0 1 10 15.7a6.2 6.2 0 0 1-2.5-.52L4.3 16l.84-3.02A6.18 6.18 0 0 1 3.8 9.5 6.2 6.2 0 0 1 10 3.3Z"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.35"
        />
      </svg>
    );
  }

  return (
    <section className="practice-settings-card" aria-labelledby="settings-title">
      <h2 id="settings-title">Delivery &amp; Communication Preferences</h2>

      <div className="practice-settings-preferences">
        {deliveryPreferences.map((preference) => {
          const enabled =
            preference.kind === "email"
              ? settings.deliveryPrefs.emailEnabled
              : settings.deliveryPrefs.whatsappEnabled;

          return (
            <div className="practice-settings-pref-row" key={preference.label}>
              <div className="practice-settings-pref-copy">
                {preference.kind === "email" ? <EmailIcon /> : <WhatsAppIcon />}
                <div>
                  <p>{preference.label}</p>
                  <span>{preference.detail}</span>
                </div>
              </div>

              <button
                aria-label={`${preference.label} ${enabled ? "enabled" : "disabled"}`}
                aria-pressed={enabled}
                className="practice-settings-toggle-button"
                type="button"
                disabled={isSaving !== null}
                onClick={() => togglePreference(preference.kind)}
              >
                <DeliveryToggle enabled={enabled} />
              </button>
            </div>
          );
        })}
      </div>

      {formError ? <p className="auth-feedback auth-feedback-error">{formError}</p> : null}
      {successMessage ? <p className="auth-feedback auth-feedback-success">{successMessage}</p> : null}

      <section className="practice-settings-contact" aria-labelledby="contact-info-title">
        <h3 id="contact-info-title">Contact Information</h3>

        <dl className="practice-settings-contact-list">
          {contactDetails.map((detail) => (
            <div className="practice-settings-contact-row" key={detail.label}>
              <dt>{detail.label}</dt>
              <dd>{detail.value}</dd>
            </div>
          ))}
        </dl>

        <button className="practice-settings-inline-link" type="button">
          Edit contact info &rarr;
        </button>
      </section>

      <div className="practice-settings-account-actions">
        <Link className="practice-settings-inline-link" href="/pricing">
          View all plans
        </Link>
        <button className="practice-settings-muted-action" type="button">
          Cancel subscription
        </button>
      </div>
    </section>
  );
}
