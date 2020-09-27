export function to(value: number): string {
  return isNaN(value) ? String(value) : new Date(1000 * value).toISOString().substr(11, 8);
}

export function from(value: string): number {
  return isNaN(value as any)
    ? new Date(`1970-01-01T${value}Z`).getTime() / 1000
    : parseInt(value, 10);
}
