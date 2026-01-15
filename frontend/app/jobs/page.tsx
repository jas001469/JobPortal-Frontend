import { Suspense } from "react";
import JobsClient from "./JobsClient";

export const runtime = "edge";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function JobsPage() {
  return (
    <Suspense fallback={<div className="pt-24 text-center">Loading jobs...</div>}>
      <JobsClient />
    </Suspense>
  );
}
