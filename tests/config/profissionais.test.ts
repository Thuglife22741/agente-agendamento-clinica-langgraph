import { describe, test, expect } from "bun:test";
import { profissionais, buscarProfissional } from "../../src/config/profissionais.ts";

describe("profissionais", () => {
  test("contém 1 profissional", () => {
    expect(Object.keys(profissionais).length).toBe(1);
  });

  test("buscarProfissional retorna profissional correto", () => {
    const ana = buscarProfissional("dra-ana-cristina");
    expect(ana).toBeDefined();
    expect(ana!.nome).toBe("Dra. Ana Cristina");
    expect(ana!.especialidade).toBe("Clínico Geral, Limpeza");
  });

  test("buscarProfissional retorna undefined para slug inválido", () => {
    const resultado = buscarProfissional("dr-inexistente");
    expect(resultado).toBeUndefined();
  });

  test("todos profissionais têm disponibilidade semanal", () => {
    for (const prof of Object.values(profissionais)) {
      // Seg a Sex (1-5) + Sáb (6)
      expect(Object.keys(prof.disponibilidade).length).toBe(6);
      expect(prof.disponibilidade[1]).toBeDefined();
      expect(prof.disponibilidade[6]).toBeDefined();
    }
  });

  test("disponibilidade é array de períodos", () => {
    for (const prof of Object.values(profissionais)) {
      // Seg a Sex deve ter 2 períodos (manhã e tarde)
      for (let dia = 1; dia <= 5; dia++) {
        const periodos = prof.disponibilidade[dia];
        expect(Array.isArray(periodos)).toBe(true);
        expect(periodos!.length).toBe(2);
        expect(periodos![0]!.inicio).toBe("08:00");
        expect(periodos![0]!.fim).toBe("12:00");
        expect(periodos![1]!.inicio).toBe("14:00");
        expect(periodos![1]!.fim).toBe("18:00");
      }
      // Sábado deve ter 1 período
      const periodosSab = prof.disponibilidade[6];
      expect(Array.isArray(periodosSab)).toBe(true);
      expect(periodosSab!.length).toBe(1);
      expect(periodosSab![0]!.inicio).toBe("08:00");
      expect(periodosSab![0]!.fim).toBe("11:00");
    }
  });

  test("profissional ID correto", () => {
    expect(profissionais["dra-ana-cristina"]).toBeDefined();
  });
});
