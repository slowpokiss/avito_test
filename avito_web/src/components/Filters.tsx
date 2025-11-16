import { Popover, Button, Input } from "antd";
import {
  FilterOutlined,
  CaretUpOutlined,
  CaretDownOutlined,
  SearchOutlined,
  LineChartOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import type { adsParams, SortOrder, SortBy } from "../interface/interface";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setFilters } from "../redux-toolkit/mainSlice";
import { statuses, categoryList } from "../interface/interface";

function SortFunction() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const filtersParams = useSelector(
    (state: RootState) => state.main.filtersParams
  );

  const toggleSort = (type: SortBy) => {
    let newSortOrder: SortOrder = "asc";

    if (filtersParams.sortBy === type) {
      newSortOrder = filtersParams.sortOrder === "asc" ? "desc" : "asc";
    }

    const params = new URLSearchParams(window.location.search);
    params.set("sortBy", type);
    params.set("sortOrder", newSortOrder);
    navigate(`/list?${params.toString()}`);

    dispatch(
      setFilters({
        ...filtersParams,
        sortBy: type,
        sortOrder: newSortOrder,
      })
    );
  };

  return (
    <ul className="flex gap-4 items-center select-none">
      {["createdAt", "price", "priority"].map((field) => (
        <li
          key={field}
          className="flex items-center gap-1 cursor-pointer text-grey"
          onClick={() => toggleSort(field as SortBy)}
        >
          {field === "createdAt"
            ? "По дате"
            : field === "price"
            ? "По цене"
            : "По приоритету"}

          {filtersParams.sortBy === field ? (
            filtersParams.sortOrder === "asc" ? (
              <CaretUpOutlined />
            ) : (
              <CaretDownOutlined />
            )
          ) : null}
        </li>
      ))}
    </ul>
  );
}

export default function Filters() {
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number[]>([]);
  const [searchValue, setSearchValue] = useState<string>("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const filtersParams = useSelector(
    (state: RootState) => state.main.filtersParams
  );

  const setNewFilter = (
    type: keyof adsParams | string,
    value: string | number | string[] | number[] | null
  ) => {
    const params = new URLSearchParams(window.location.search);

    if (Array.isArray(value)) {
      params.delete(type);
      value.forEach((v) => params.append(type, String(v)));
    } else {
      value === "" || value === null
        ? params.delete(type)
        : params.set(type, String(value));
    }

    navigate(`/list?${params.toString()}`);

    dispatch(
      setFilters({
        ...filtersParams,
        [type]: value,
      })
    );
  };

  const statusChange = (status: string) => {
    let updated = [...selectedStatuses];

    if (updated.includes(status)) {
      updated = updated.filter((s) => s !== status);
    } else {
      updated.push(status);
    }

    setSelectedStatuses(updated);
    setNewFilter("status", updated);
  };

  const categoryChange = (id: number) => {
    let updated = [...selectedCategory];

    if (updated.includes(id)) {
      updated = updated.filter((c) => c !== id);
    } else {
      updated.push(id);
    }

    setSelectedCategory(updated);
    setNewFilter("categoryId", updated);
  };

  const clearFilters = () => {
    setSelectedStatuses([]);
    setSelectedCategory([]);
    setSearchValue("");
    const params = new URLSearchParams();

    navigate(`/list?${params.toString()}`);
    dispatch(
      setFilters({
        ...filtersParams,
        status: [],
        categoryId: [],
        minPrice: undefined,
        maxPrice: undefined,
        search: "",
        sortBy: undefined,
        sortOrder: undefined,
      })
    );
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setNewFilter("search", searchValue.trim());
  };

  return (
    <div>
      <div className="mb-3 w-fit">
        <Link to="/stats">
          <div className="px-2 py-1.5 rounded-full bg-sky-500 hover:bg-sky-600 transition">
            <LineChartOutlined style={{ fontSize: 20, color: "white" }} />
          </div>
        </Link>
      </div>

      <div className="flex justify-between items-center gap-3">
        <SortFunction />

        <div className="flex gap-10">
          <form onSubmit={handleSearchSubmit} className="flex items-center">
            <Input
              placeholder="Поиск..."
              prefix={<SearchOutlined />}
              allowClear
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="w-64"
            />
          </form>

          <Popover
            content={
              <div className="w-64 p-3">
                <ul className="flex flex-col gap-4">
                  <li className="flex flex-col gap-2">
                    <span className="text-grey">Статус</span>
                    <form className="flex flex-col gap-1 ml-2">
                      {statuses.map((el) => (
                        <label
                          key={el.value}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedStatuses.includes(el.value)}
                            onChange={() => statusChange(el.value)}
                            className="accent-blue-500 cursor-pointer"
                          />
                          <span className="text-sm text-gray-700">
                            {el.name}
                          </span>
                        </label>
                      ))}
                    </form>
                  </li>

                  <li className="flex flex-col gap-2">
                    <span className="text-grey">Категория</span>
                    <form className="flex flex-col gap-1 ml-2">
                      {categoryList.map((c) => (
                        <label
                          key={c.id}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedCategory.includes(c.id)}
                            onChange={() => categoryChange(c.id)}
                            className="accent-blue-500 cursor-pointer"
                          />
                          <span className="text-sm text-gray-700">
                            {c.name}
                          </span>
                        </label>
                      ))}
                    </form>
                  </li>

                  <li className="flex justify-between items-center">
                    <span className="text-grey">Цена</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        placeholder="от"
                        className="input-primary"
                        onChange={(e) =>
                          e.target.value
                            ? setNewFilter("minPrice", Number(e.target.value))
                            : setNewFilter("minPrice", "")
                        }
                      />
                      <span>–</span>
                      <input
                        type="number"
                        placeholder="до"
                        className="input-primary"
                        onChange={(e) =>
                          e.target.value
                            ? setNewFilter("maxPrice", Number(e.target.value))
                            : setNewFilter("maxPrice", "")
                        }
                      />
                    </div>
                  </li>

                  <li className="flex justify-center mt-3">
                    <Button
                      type="default"
                      onClick={clearFilters}
                      className="w-full"
                    >
                      Сбросить фильтры
                    </Button>
                  </li>
                </ul>
              </div>
            }
            title={<span className="font-semibold text-gray-800">Фильтры</span>}
            trigger="click"
          >
            <Button
              type="primary"
              style={{ backgroundColor: "#00aaff" }}
              icon={<FilterOutlined />}
            >
              Фильтры
            </Button>
          </Popover>
        </div>
      </div>
    </div>
  );
}
