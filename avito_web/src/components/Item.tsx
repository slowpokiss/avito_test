import { useLoaderData, useNavigate, useParams } from "react-router-dom";
import { Carousel, Popover, Select, Input, Button, message, Form } from "antd";
import type { adsInterface } from "../interface/interface";
import {
  CaretLeftOutlined,
  CaretRightOutlined,
  ArrowLeftOutlined,
  CheckOutlined,
  CloseOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import {
  reasonsFull,
  handleAdActionType,
  statuses,
} from "../interface/interface";
import { useEffect } from "react";

const priority: Record<string, string> = {
  urgent: "Срочно",
  normal: "Обычный",
};

const getRating = (rating: number) => {
  if (rating >= 4) {
    return "bg-green-100 text-green-700 border-green-300";
  }
  if (rating >= 3) {
    return "bg-yellow-100 text-yellow-700 border-yellow-300";
  }
  return "bg-red-100 text-red-700 border-red-300";
};

export default function Item() {
  const [rejectOpen, setRejectOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [animState, setAnimState] = useState<"" | "enter" | "exit">("");

  const ad = useLoaderData() as adsInterface;
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const currListItems = useSelector(
    (state: RootState) => state.main.currListItems
  );
  const adIndex = currListItems.findIndex((item) => item.id === Number(id));

  const goToAd = (index: number) => {
    if (index < 0 || index >= currListItems.length) {
      return;
    }

    setAnimState("exit");
    setTimeout(() => {
      const nextAdId = currListItems[index].id;
      navigate(`/item/${nextAdId}`);
      setAnimState("enter");
      setTimeout(() => setAnimState(""), 300);
    }, 200);
  };

  const handleAdAction = async (
    action: handleAdActionType,
    reason?: string,
    comment?: string
  ) => {
    try {
      const url = `http://localhost:3001/api/v1/ads/${Number(id)}/${action}`;
      const options: RequestInit = { method: "POST" };

      if (action !== "approve") {
        options.headers = { "Content-Type": "application/json" };
        options.body = JSON.stringify({ reason, comment });
      }

      const res = await fetch(url, options);
      if (!res.ok) throw new Error(`Ошибка при ${action}`);

      await res.json();

      message.success(
        action === "approve"
          ? "Объявление одобрено"
          : action === "reject"
          ? "Объявление отклонено"
          : "Объявление отправлено на доработку"
      );

      goToAd(adIndex + 1);
    } catch (error: unknown) {
      message.error(error.message || "Произошла ошибка");
    }
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "a" || e.key === "A") {
        handleAdAction("approve");
      }
      if (e.key === "d" || e.key === "D") {
        setRejectOpen(true);
      }
      if (e.key === "ArrowRight") {
        goToAd(adIndex + 1);
      }
      if (e.key === "ArrowLeft") {
        goToAd(adIndex - 1);
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [adIndex, currListItems]);

  return (
    <div
      className={`
        w-full space-y-10 transition-all duration-300
        ${animState === "enter" ? "opacity-100 translate-x-0" : ""}
        ${animState === "exit" ? "opacity-0 -translate-x-5" : ""}
      `}
    >
      <div className="flex gap-6">
        <div className="w-1/2">
          <Carousel arrows infinite>
            {ad.images.map((img, idx) => (
              <div key={idx} className="flex justify-center">
                <img
                  src={img}
                  alt={ad.title}
                  className="w-full h-72 object-cover rounded-lg shadow"
                />
              </div>
            ))}
          </Carousel>
        </div>

        <div className="w-1/2 bg-gray-50 p-4 rounded-lg border">
          <h2 className="text-lg font-semibold mb-3">История модерации</h2>
          <ul className="space-y-3">
            {ad.moderationHistory?.map((item) => (
              <li key={item.id} className="bg-white rounded border p-3">
                <p className="font-medium">
                  {statuses.find((el) => el.value === item.action)?.name}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(item.timestamp).toLocaleString()}
                </p>
                {item.comment && <p className="mt-1 text-sm">{item.comment}</p>}
                <p className="text-sm mt-1 text-gray-700">
                  Модератор: {item.moderatorName}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div>
        <h1 className="text-2xl font-semibold mb-3">{ad.title}</h1>
        <p className="text-gray-700 leading-relaxed">{ad.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-50 rounded-lg p-4 border">
          <div className="flex justify-between py-1 border-b">
            <span>Цена</span>
            <span>{ad.price} ₽</span>
          </div>
          <div className="flex justify-between py-1 border-b">
            <span>Категория</span>
            <span>{ad.category}</span>
          </div>
          <div className="flex justify-between py-1 border-b">
            <span>Статус</span>
            <span>{statuses.find((el) => el.value === ad.status)?.name}</span>
          </div>
          <div className="flex justify-between py-1 border-b">
            <span>Приоритет</span>
            <span>{priority[ad.priority]}</span>
          </div>
          <div className="flex justify-between py-1 border-b">
            <span>Создано</span>
            <span>{new Date(ad.createdAt).toLocaleString()}</span>
          </div>
          <div className="flex justify-between py-1">
            <span>Обновлено</span>
            <span>{new Date(ad.updatedAt).toLocaleString()}</span>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 border">
          <h2 className="text-lg font-semibold mb-2">Продавец</h2>

          <div className="flex justify-between py-1 border-b">
            <span>Имя</span>
            <span>{ad.seller.name}</span>
          </div>

          <div className="flex justify-between py-1 border-b">
            <span>Рейтинг</span>
            <span
              className={`
                px-2 py-0.5 rounded-md border text-sm font-medium
                ${getRating(Number(ad.seller.rating))}
              `}
            >
              {ad.seller.rating}
            </span>
          </div>

          <div className="flex justify-between py-1 border-b">
            <span>Всего объявлений</span>
            <span>{ad.seller.totalAds}</span>
          </div>

          <div className="flex justify-between py-1">
            <span>Регистрация</span>
            <span>{new Date(ad.seller.registeredAt).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 border">
          <h2 className="text-lg font-semibold mb-2">Характеристики</h2>
          {Object.entries(ad.characteristics).map(([key, value]) => (
            <div
              key={key}
              className="flex justify-between py-1 border-b last:border-none"
            >
              <span>{key}</span>
              <span>{value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center mb-10">
        <div className="flex gap-10 items-center">
          <button
            onClick={() => handleAdAction("approve")}
            className="btn-primary bg-green-100 border-green-300 hover:bg-green-200 text-black text-xl"
          >
            <CheckOutlined />
            Одобрить
          </button>

          <Popover
            content={
              <Form
                layout="vertical"
                onFinish={(values) => {
                  handleAdAction("reject", values.reason, values.comment);
                  setRejectOpen(false);
                }}
              >
                <Form.Item
                  name="reason"
                  label="Причина"
                  rules={[{ required: true }]}
                >
                  <Select
                    options={reasonsFull.map((r) => ({ value: r, label: r }))}
                    placeholder="Выберите причину"
                  />
                </Form.Item>

                <Form.Item name="comment" label="Комментарий">
                  <Input.TextArea autoSize />
                </Form.Item>

                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Подтвердить
                  </Button>
                </Form.Item>
              </Form>
            }
            trigger="click"
            placement="bottom"
            open={rejectOpen}
            onOpenChange={setRejectOpen}
          >
            <button className="btn-primary bg-red-100 border-red-300 hover:bg-red-200 text-black text-xl">
              <CloseOutlined />
              Отклонить
            </button>
          </Popover>

          <Popover
            content={
              <Form
                layout="vertical"
                onFinish={(values) => {
                  handleAdAction(
                    "request-changes",
                    values.reason,
                    values.comment
                  );
                  setEditOpen(false);
                }}
              >
                <Form.Item
                  name="reason"
                  label="Причина"
                  rules={[{ required: true }]}
                >
                  <Select
                    options={reasonsFull.map((r) => ({ value: r, label: r }))}
                    placeholder="Выберите причину"
                  />
                </Form.Item>

                <Form.Item name="comment" label="Комментарий">
                  <Input.TextArea autoSize />
                </Form.Item>

                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Подтвердить
                  </Button>
                </Form.Item>
              </Form>
            }
            trigger="click"
            placement="bottom"
            open={editOpen}
            onOpenChange={setEditOpen}
          >
            <button className="btn-primary bg-yellow-100 border-yellow-300 hover:bg-yellow-200 text-black text-xl">
              <EditOutlined />
              Доработка
            </button>
          </Popover>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <button
          className="btn-primary bg-white hover:bg-gray-100 px-3 py-1"
          onClick={() => navigate(`/list`)}
        >
          <ArrowLeftOutlined />К списку
        </button>

        <div className="flex gap-10">
          <div className="bg-gray-100 border border-black text-black px-3 py-2 rounded-md text-xs mb-4">
            <ul className="space-y-0.5">
              <li>
                <b>A</b> - одобрить{" "}
              </li>
              <li>
                <b>D</b> - отклонить{" "}
              </li>
              <li>
                <b>←</b> - предыдущее{" "}
              </li>
              <li>
                <b>→</b> - следующее
              </li>
            </ul>
          </div>
          <div className="flex gap-5 items-center">
            <button
              onClick={() => goToAd(adIndex - 1)}
              className="btn-primary bg-white hover:bg-gray-100 px-3 py-1"
              disabled={adIndex <= 0}
            >
              <CaretLeftOutlined />
              Пред.
            </button>

            <div>|</div>

            <button
              onClick={() => goToAd(adIndex + 1)}
              className="btn-primary bg-white hover:bg-gray-100 px-3 py-1"
              disabled={adIndex >= currListItems.length - 1}
            >
              След.
              <CaretRightOutlined />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
