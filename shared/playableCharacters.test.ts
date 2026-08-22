import { readFileSync } from 'node:fs';
import {
  getCharacterSkills,
  getPlayableCharacter,
  getSkill,
  isPlayableCharacterId,
  isSkillIdForCharacter,
  playableCharacters,
  type PlayableCharacterId,
  type SkillKind,
  type SkillTarget,
} from './playableCharacters';

const skillKinds = ['active', 'passive', 'ultimate'] as const satisfies readonly SkillKind[];
const skillTargets = [
  'self',
  'player',
  'npc',
  'region',
  'route',
  'global',
  'none',
] as const satisfies readonly SkillTarget[];

describe('playable character skill catalog', () => {
  it('contains exactly eight unique playable characters', () => {
    expect(playableCharacters).toHaveLength(8);
    expect(new Set(playableCharacters.map(({ id }) => id)).size).toBe(8);
  });

  it('contains exactly one active, passive and ultimate skill per character', () => {
    for (const character of playableCharacters) {
      const skills = getCharacterSkills(character.id);
      expect(skills).toHaveLength(3);
      expect(skills.map(({ kind }) => kind)).toEqual(skillKinds);
      for (const kind of skillKinds) {
        expect(skills.filter((skill) => skill.kind === kind)).toHaveLength(1);
      }
    }
  });

  it('contains 24 globally unique skill ids', () => {
    const ids = playableCharacters.flatMap(({ id }) =>
      getCharacterSkills(id).map((skill) => skill.id),
    );
    expect(ids).toHaveLength(24);
    expect(new Set(ids).size).toBe(24);
  });

  it('satisfies cooldown invariants', () => {
    for (const character of playableCharacters) {
      const { active, passive, ultimate } = character.skills;
      for (const skill of getCharacterSkills(character.id)) {
        expect(skill.cooldownRounds).toBeGreaterThanOrEqual(0);
      }
      expect(passive.cooldownRounds).toBe(0);
      expect(active.cooldownRounds).toBeGreaterThan(0);
      expect(ultimate.cooldownRounds).toBeGreaterThan(active.cooldownRounds);
    }
  });

  it('only uses supported targets', () => {
    for (const character of playableCharacters) {
      for (const skill of getCharacterSkills(character.id)) {
        expect(skillTargets).toContain(skill.target);
      }
    }
  });

  it('provides pure catalog lookup helpers', () => {
    expect(isPlayableCharacterId('san-martin')).toBe(true);
    expect(isPlayableCharacterId('invalid')).toBe(false);
    expect(getPlayableCharacter('moreno').shortName).toBe('Moreno');
    expect(getCharacterSkills('brown').map(({ id }) => id)).toEqual([
      'blockade',
      'river-domain',
      'bombardment',
    ]);
    expect(getSkill('san-martin', 'discipline').kind).toBe('passive');
    expect(isSkillIdForCharacter('san-martin', 'discipline')).toBe(true);
    expect(isSkillIdForCharacter('san-martin', 'gazette')).toBe(false);
  });

  it('rejects invalid character and skill ids', () => {
    expect(() => getPlayableCharacter('invalid' as PlayableCharacterId)).toThrow(
      'Personaje jugable inválido',
    );
    expect(() => getSkill('san-martin', 'gazette')).toThrow('Skill inválida');
  });

  it('does not depend on AI Town agents, players or Convex', () => {
    const source = readFileSync(new URL('./playableCharacters.ts', import.meta.url), 'utf8');
    expect(source).not.toMatch(/from ['"].*(convex|aiTown|agent|player)/i);
  });
});
