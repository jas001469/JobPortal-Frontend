import { Suspense } from "react";
import JobDetailsPage from "./JobDetailsClient";

export const dynamic = "force-dynamic";

export default function JobsPage() {
  return (
    <Suspense fallback={<div className="p-10">Loading jobs…</div>}>
      <JobDetailsPage />
    </Suspense>
  );
}