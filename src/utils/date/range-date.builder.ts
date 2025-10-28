type WhereClause = {
  gte?: string | Date;
  lte?: string | Date;
};

type dateInput = string | Date | undefined;

type DateFilter =
  | string
  | { startDate?: string | Date; endDate?: string | Date };

export const getStartOfDayUTC = (dateString: dateInput) => {
  if (!dateString) return;
  const date = new Date(dateString);
  date.setDate(date.getDate());
  date.setUTCHours(0, 0, 0, 0);
  return date.toISOString();
};

export const getEndOfDayUTC = (dateString: dateInput) => {
  if (!dateString) return;
  const date = new Date(dateString);
  date.setDate(date.getDate());
  date.setUTCHours(23, 59, 59, 999);
  return date.toISOString();
};

export const createDateFilter = (dateRange?: DateFilter | null) => {
  let where: WhereClause = {};

  if (dateRange && typeof dateRange !== "string") {
    if (dateRange.startDate && dateRange.endDate) {
      where = {
        gte: getStartOfDayUTC(dateRange.startDate),
        lte: getEndOfDayUTC(dateRange.endDate)
      };
    } else if (dateRange.startDate) {
      where = {
        gte: getStartOfDayUTC(dateRange.startDate),
        lte: getEndOfDayUTC(dateRange.startDate)
      };
    }
  }

  return where;
};
