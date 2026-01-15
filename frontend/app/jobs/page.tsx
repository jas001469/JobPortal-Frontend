// app/jobs/page.tsx

import { Suspense } from "react";
import JobsClient from "./JobsClient";

export const dynamic = "force-dynamic";

export default function JobsPage() {
  return (
    <Suspense fallback={<div className="pt-24 text-center">Loading jobs...</div>}>
      <JobsClient />
    </Suspense>
  );
}
