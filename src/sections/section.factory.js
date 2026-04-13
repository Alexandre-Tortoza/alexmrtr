import { Section } from '../domain/section.js';

export const buildSections = (infoArray) =>
  infoArray.map((entry) => new Section(entry));
