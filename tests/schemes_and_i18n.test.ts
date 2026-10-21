import { describe, it, expect } from 'vitest';
import { verifiedSchemes } from '../src/data/schemesData';
import { learningModules } from '../src/data/learningData';
import { translations } from '../src/i18n/translations';

describe('Government Schemes Integrity', () => {
  it('contains at least 7 verified schemes with non-empty official portals and valid URLs', () => {
    expect(verifiedSchemes.length).toBeGreaterThanOrEqual(7);

    verifiedSchemes.forEach((scheme) => {
      expect(scheme.id).toBeTruthy();
      expect(scheme.name).toBeTruthy();
      expect(scheme.nameMr).toBeTruthy();
      expect(scheme.officialPortal).toMatch(/^https?:\/\//);
      expect(scheme.eligibility.length).toBeGreaterThan(0);
      expect(scheme.documentsRequired.length).toBeGreaterThan(0);
      expect(scheme.applicationSteps.length).toBeGreaterThan(0);
      expect(scheme.verificationStatus).toBe('verified');
    });
  });

  it('includes key flagship Maharashtra programs (CMEGP & Annasaheb Patil IRSY)', () => {
    const cmegp = verifiedSchemes.find((s) => s.id === 'cmegp-maharashtra');
    const annasaheb = verifiedSchemes.find((s) => s.id === 'annasaheb-patil-scheme');
    const mudra = verifiedSchemes.find((s) => s.id === 'pm-mudra-yojana');

    expect(cmegp).toBeDefined();
    expect(annasaheb).toBeDefined();
    expect(mudra).toBeDefined();
  });
});

describe('Financial Literacy Academy Dataset', () => {
  it('has 10 complete modules with business scenarios and valid quizzes', () => {
    expect(learningModules.length).toBe(10);

    learningModules.forEach((mod) => {
      expect(mod.order).toBeGreaterThan(0);
      expect(mod.title).toBeTruthy();
      expect(mod.titleMr).toBeTruthy();
      expect(mod.businessScenario).toBeDefined();
      expect(mod.quiz.length).toBeGreaterThan(0);

      mod.quiz.forEach((q) => {
        expect(q.options.length).toBeGreaterThanOrEqual(2);
        expect(q.correctAnswerIndex).toBeGreaterThanOrEqual(0);
        expect(q.correctAnswerIndex).toBeLessThan(q.options.length);
        expect(q.explanation).toBeTruthy();
      });
    });
  });
});

describe('Bilingual Translations Symmetry', () => {
  it('ensures all translation keys in English exist in Marathi', () => {
    const enKeys = Object.keys(translations.en) as (keyof typeof translations.en)[];
    const mrKeys = Object.keys(translations.mr);

    enKeys.forEach((key) => {
      expect(mrKeys).toContain(key);
      expect(translations.mr[key]).toBeTruthy();
    });
  });
});
