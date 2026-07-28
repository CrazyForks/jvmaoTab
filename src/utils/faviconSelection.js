const STANDARD_ICON_REL = new Set(["icon", "shortcut icon"]);
const TOUCH_ICON_REL = new Set([
  "apple-touch-icon",
  "apple-touch-icon-precomposed",
]);

const normalizeRel = (rel) =>
  String(rel || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");

export const getFaviconPriority = (rel) => {
  const normalized = normalizeRel(rel);

  if (STANDARD_ICON_REL.has(normalized)) {
    return 0;
  }
  if (TOUCH_ICON_REL.has(normalized)) {
    return 1;
  }
  return null;
};

export const isFaviconLink = (link) =>
  getFaviconPriority(link?.getAttribute?.("rel") ?? link?.rel) !== null;

// 优先使用真正的 favicon。apple-touch-icon 只在页面没有标准 favicon 时兜底，
// 避免部分站点把页面封面作为 touch icon，导致同一域名的图标随页面变化。
export const preferStandardFavicon = (items) => {
  if (!items || items.length === 0) return [];

  const priorities = items
    .map((item) => item.priority)
    .filter((priority) => typeof priority === "number");
  if (priorities.length === 0) return items;

  const bestPriority = Math.min(...priorities);
  return items.filter((item) => item.priority === bestPriority);
};
