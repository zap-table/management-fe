import { TableStatus } from "@/types/tables.types";

export function translateTableStatus(status?: TableStatus): string {
  if (!status) return "";

  switch (status) {
    case "available":
      return "Disponível";
    case "occupied":
      return "Ocupado";
    case "reserved":
      return "Reservado";
  }
}
