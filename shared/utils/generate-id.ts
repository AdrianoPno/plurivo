export function generateId(prefix?: string) {
  const randomPart = Math.random().toString(36).substring(2, 10);

  const timestamp = Date.now().toString(36);

  const id = `${timestamp}${randomPart}`;

  return prefix ? `${prefix}_${id}` : id;
}
