import type { LoaderFunctionArgs } from "react-router-dom";
import type { adsInterface } from "../interface/interface";

export async function useAdsLoader({
  request,
}: LoaderFunctionArgs): Promise<adsInterface[]> {
  const url = new URL(request.url);
  const res = await fetch(
    `http://localhost:3001/api/v1/ads?${url.searchParams}`
  );
  const ads = await res.json();
  return ads;
}
