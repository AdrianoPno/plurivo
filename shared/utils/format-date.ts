export function formatDate(date: Date | string | number, locale = "pt-BR") {
  if (!date) return "";

  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date));
}

export function formatDateTime(date: Date | string | number, locale = "pt-BR") {
  if (!date) return "";

  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",

    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export function formatRelativeDate(date: Date | string | number) {
  const currentDate = new Date();
  const targetDate = new Date(date);

  const diffInMs = currentDate.getTime() - targetDate.getTime();

  const diffInMinutes = Math.floor(diffInMs / 1000 / 60);

  if (diffInMinutes < 1) {
    return "Agora";
  }

  if (diffInMinutes < 60) {
    return `${diffInMinutes} min atrás`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);

  if (diffInHours < 24) {
    return `${diffInHours}h atrás`;
  }

  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInDays < 30) {
    return `${diffInDays}d atrás`;
  }

  return formatDate(date);
}
