import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function generateQRCode(url: string): Promise<string> {
  // Em um ambiente real, você pode usar uma API para gerar QR codes
  // Por enquanto, vamos apenas retornar a URL que seria codificada
  return url;
}
