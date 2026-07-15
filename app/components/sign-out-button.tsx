"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { browserApiRequest } from "@/lib/backend";

export function SignOutButton({
  className,
  children,
}: {
  className: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClick = async () => {
    setIsSubmitting(true);

    try {
      await browserApiRequest("/auth/signout", {
        method: "POST",
      });
    } finally {
      router.replace("/signin");
      router.refresh();
      setIsSubmitting(false);
    }
  };

  return (
    <button className={className} type="button" onClick={handleClick} disabled={isSubmitting}>
      {children}
    </button>
  );
}

