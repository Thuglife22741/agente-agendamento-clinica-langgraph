import { logger } from "../lib/logger.ts";

export interface Profissional {
  id: string;
  nome: string;
  especialidade: string;
  calendarId: string;
  disponibilidade: Record<number, Array<{ inicio: string; fim: string }>>;
}

const calendarIds: Record<string, string> = (() => {
  const json = process.env["PROFISSIONAIS_CALENDAR_IDS"];
  if (!json) return {};
  try {
    return JSON.parse(json) as Record<string, string>;
  } catch {
    logger.error("profissionais", "PROFISSIONAIS_CALENDAR_IDS JSON inválido");
    return {};
  }
})();

export const profissionais: Record<string, Profissional> = {
  "dra-ana-cristina": {
    id: "dra-ana-cristina",
    nome: "Dra. Ana Cristina",
    especialidade: "Clínico Geral, Limpeza",
    calendarId: calendarIds["dra-ana-cristina"] ?? "dra-ana-cristina@clinic.com",
    disponibilidade: {
      1: [{ inicio: "08:00", fim: "20:00" }], // segunda
      2: [{ inicio: "08:00", fim: "20:00" }], // terça
      3: [{ inicio: "08:00", fim: "20:00" }], // quarta
      4: [{ inicio: "08:00", fim: "20:00" }], // quinta
      5: [{ inicio: "08:00", fim: "20:00" }], // sexta
      6: [{ inicio: "08:00", fim: "11:00" }], // sábado
    },
  },
};

export function buscarProfissional(id: string): Profissional | undefined {
  return profissionais[id];
}
