const emailPattern = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;
const phonePattern = /(?:\+?\d[\d\s().-]{8,}\d)/g;

export function redactPersonalDetails(value: string): string {
  return value.replace(emailPattern, "[email]").replace(phonePattern, "[phone]").replace(/\s+/g, " ").trim().slice(0, 240);
}
