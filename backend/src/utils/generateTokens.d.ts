export function generateToken(payload: { userId: string; email: string; role: string }): string;
export function verifyToken(token: string): any;
