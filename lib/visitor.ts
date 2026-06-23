export function getVisitorId() {
  if (typeof window === "undefined") return "";

  let visitorId = localStorage.getItem(
    "jcu-visitor-id"
  );

  if (!visitorId) {
    visitorId = crypto.randomUUID();

    localStorage.setItem(
      "jcu-visitor-id",
      visitorId
    );
  }

  return visitorId;
}