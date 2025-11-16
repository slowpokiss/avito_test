import Filters from "../components/Filters";
import { useLoaderData, useNavigate } from "react-router-dom";
import PaginationBlock from "../components/PaginationBlock";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateCurrItems } from "../redux-toolkit/mainSlice";
import { adsInterface, adsResponse, AdStatus } from "../interface/interface";


interface AdsPageProps {
  adsData: adsResponse;
}
function AdsPage({ adsData }: AdsPageProps) {
  const navigate = useNavigate();

  const statusCol: Record<AdStatus, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    approved: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
    draft: "bg-gray-200 text-gray-600",
  };

  const priorityCol: Record<"normal" | "urgent", string> = {
    normal: "bg-gray-100 text-gray-600",
    urgent: "bg-red-100 text-red-600",
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        {adsData.ads.map((ad: adsInterface) => (
          <div
            key={ad.id}
            className="ad-card"
            onClick={() => navigate(`/item/${ad.id}`)}
          >
            <div className="ad-image">
              <img
                src={ad.images[0]}
                alt={ad.title}
                className="object-cover w-full h-full"
              />
            </div>

            <div className="flex flex-col flex-grow">
              <h3 className="text-title">{ad.title}</h3>
              <p className="text-price">{ad.price.toLocaleString()} ₽</p>
              <p className="text-small">
                {ad.category} • {new Date(ad.createdAt).toLocaleDateString()}
              </p>
              <div className="flex gap-2 mt-2">
                <span className={`badge ${statusCol[ad.status]}`}>
                  {ad.status === "pending"
                    ? "На модерации"
                    : ad.status === "approved"
                    ? "Одобрено"
                    : ad.status === "rejected"
                    ? "Отклонено"
                    : "Черновик"}
                </span>

                <span className={`badge ${priorityCol[ad.priority]}`}>
                  {ad.priority === "urgent" ? "Срочное" : "Обычное"}
                </span>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/item/${ad.id}`);
              }}
              className="btn-primary btn-green"
            >
              Открыть →
            </button>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <PaginationBlock paginationData={adsData.pagination} />
      </div>
    </>
  );
}


export default function MainPage() {
  const adsData = useLoaderData() as adsResponse[];
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(updateCurrItems({ newItems: adsData.ads }));
  }, [adsData, dispatch]);

  return (
    <>
      <div className="">
        <div className="mb-6">
          <Filters
          //categories={categories}
          />
        </div>

        <div className="flex flex-col gap-3">
          <AdsPage adsData={adsData} />
        </div>
      </div>
    </>
  );
}
