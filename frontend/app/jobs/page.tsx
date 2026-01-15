import { Suspense } from "react";
import JobsClient from "./JobsClient";

export const dynamic = "force-dynamic";

interface SearchParams {
  [key: string]: string | string[] | undefined;
}

interface JobsPageProps {
  searchParams: Promise<SearchParams>;
}

export default async function JobsPage({ searchParams }: JobsPageProps) {
  // Await the searchParams promise
  const params = await searchParams;
  
  // Convert to URLSearchParams object
  const searchParamsObj = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach(v => searchParamsObj.append(key, v));
    } else if (value !== undefined && value !== null) {
      searchParamsObj.append(key, value);
    }
  });

  return (
    <Suspense fallback={
      <div className="min-h-screen pt-24 flex justify-center items-center">
        <div className="animate-spin h-12 w-12 border-b-2 border-red-700 rounded-full" />
      </div>
    }>
      <JobsClient searchParams={searchParamsObj} />
    </Suspense>
  );
}