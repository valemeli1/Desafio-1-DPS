export function invoiceid(): string {
    return `INV-${Date.now()}`;
}

export function nowiso(): string {
    return new Date().toISOString();
}