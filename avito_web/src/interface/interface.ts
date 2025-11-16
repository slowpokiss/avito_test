export type AdStatus = 'pending' | 'approved' | 'rejected' | 'draft';
export type SortBy = 'createdAt' | 'price' | 'priority';
export type SortOrder = 'asc' | 'desc';
export type handleAdActionType = "approve" | "reject" | "request-changes";

export const categoryList = [
  { id: 0, name: "Электроника" },
  { id: 1, name: "Недвижимость" },
  { id: 2, name: "Транспорт" },
  { id: 3, name: "Работа" },
  { id: 4, name: "Услуги" },
  { id: 5, name: "Животные" },
  { id: 6, name: "Мода" },
  { id: 7, name: "Детское" },
];

export const statuses = [
  { name: "На модерации", value: "pending" },
  { name: "Одобрено", value: "approved" },
  { name: "Отклонено", value: "rejected" },
  { name: "Черновик", value: "draft" },
];

export const reasonsFull = [
    "Запрещенный товар",
    "Неверная категория",
    "Некорректное описание",
    "Проблемы с фото",
    "Подозрение на мошенничество",
    "Другое",
];

export interface adsParams {
  page?: number;
  limit?: number;
  status?: AdStatus[];
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sortBy?: SortBy;
  sortOrder?: SortOrder;
}

export interface adsInterface {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  categoryId: number;
  status: AdStatus;
  priority: 'normal' | 'urgent';
  createdAt: string;
  updatedAt: string;
  images: string[];
  seller: sellerInterface;
  characteristics: Record<string, string>;
  moderationHistory: historyModInterface[];
}

export interface sellerInterface {
  id: number;
  name: string;
  rating: string;
  totalAds: number;
  registeredAt: string;
}

export interface historyModInterface {
  id: number;
  moderatorId: number;
  moderatorName: string;
  action: handleAdActionType;
  reason: string | null;
  comment: string;
  timestamp: string;
}

export interface paginationInterface {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface adsResponse {
  ads: adsInterface[];
  pagination: paginationInterface;
}

export interface statsInterface {
  totalReviewed: number;
  totalReviewedToday: number;
  totalReviewedThisWeek: number;
  totalReviewedThisMonth: number;
  approvedPercentage: number;
  rejectedPercentage: number;
  requestChangesPercentage: number;
  averageReviewTime: number;
}

export interface activityDataInterface {
  date: string;
  approved: number;
  rejected: number;
  requestChanges: number;
}

export interface decisionsInterface {
  approved: number;
  rejected: number;
  requestChanges: number;
}

export interface moderatorStatsInterface {
  totalReviewed: number;
  todayReviewed: number;
  thisWeekReviewed: number;
  thisMonthReviewed: number;
  averageReviewTime: number;
  approvalRate: number;
}

export interface moderatorInterface {
  id: number;
  name: string;
  email: string;
  role: string;
  statistics: moderatorStatsInterface;
  permissions: string[];
}
