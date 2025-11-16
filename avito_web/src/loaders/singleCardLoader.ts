import type { LoaderFunctionArgs } from "react-router-dom";
import type { adsInterface } from "../interface/interface";

export async function itemLoader({
  params,
}: LoaderFunctionArgs): Promise<adsInterface> {
  if (!params.id) throw new Error("ID объявления не указан");

  const response = await fetch(`http://localhost:3001/api/v1/ads/${params.id}`);
  if (!response.ok)
    throw new Error(`Ошибка при загрузке объявления: ${response.statusText}`);

  return response.json();
}
