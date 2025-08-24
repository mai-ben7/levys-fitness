export const SERVICES = [
  { id: "consult30", label: "ייעוץ ראשוני — 30 דק׳", duration: 30, buffer: 0 },
  { id: "session60", label: "אימון — 60 דק׳", duration: 60, buffer: 10 },
];

export type Service = typeof SERVICES[0];
