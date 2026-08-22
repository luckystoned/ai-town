export type SkillKind = 'active' | 'passive' | 'ultimate';

export type SkillTarget = 'self' | 'player' | 'npc' | 'region' | 'route' | 'global' | 'none';

export type SkillDefinition = {
  id: string;
  name: string;
  description: string;
  kind: SkillKind;
  target: SkillTarget;
  cooldownRounds: number;
  tags: readonly string[];
};

type SkillDefinitionForKind<Kind extends SkillKind> = SkillDefinition & { kind: Kind };

export type CharacterSkills = {
  active: SkillDefinitionForKind<'active'>;
  passive: SkillDefinitionForKind<'passive'>;
  ultimate: SkillDefinitionForKind<'ultimate'>;
};

export type PlayableCharacter = {
  id: string;
  name: string;
  shortName: string;
  archetype: string;
  shortDescription: string;
  skills: CharacterSkills;
};

export const playableCharacters = [
  {
    id: 'san-martin',
    name: 'José de San Martín',
    shortName: 'San Martín',
    archetype: 'Estratega',
    shortDescription: 'Estratega de una Argentina alternativa donde la historia tomó otro rumbo.',
    skills: {
      active: {
        id: 'crossing-impossible',
        name: 'Cruce Imposible',
        description: 'Puede ignorar temporalmente una restricción territorial o de movimiento.',
        kind: 'active',
        target: 'region',
        cooldownRounds: 2,
        tags: ['movement', 'strategy', 'territory'],
      },
      passive: {
        id: 'discipline',
        name: 'Disciplina',
        description: 'Las acciones coordinadas con aliados reciben una ventaja mecánica.',
        kind: 'passive',
        target: 'none',
        cooldownRounds: 0,
        tags: ['coordination', 'alliance', 'defense'],
      },
      ultimate: {
        id: 'continental-plan',
        name: 'Plan Continental',
        description: 'Permite alterar temporalmente el orden estratégico de acciones de una ronda.',
        kind: 'ultimate',
        target: 'global',
        cooldownRounds: 4,
        tags: ['turn-order', 'strategy', 'coordination'],
      },
    },
  },
  {
    id: 'belgrano',
    name: 'Manuel Belgrano',
    shortName: 'Belgrano',
    archetype: 'Organizador',
    shortDescription: 'Organizador de una república imposible inspirada libremente en el pasado.',
    skills: {
      active: {
        id: 'create-symbol',
        name: 'Crear Símbolo',
        description: 'Aumenta moral o influencia en una región.',
        kind: 'active',
        target: 'region',
        cooldownRounds: 2,
        tags: ['influence', 'morale', 'region'],
      },
      passive: {
        id: 'conviction',
        name: 'Convicción',
        description: 'Obtiene una ventaja determinística en acciones de persuasión.',
        kind: 'passive',
        target: 'none',
        cooldownRounds: 0,
        tags: ['persuasion', 'diplomacy'],
      },
      ultimate: {
        id: 'exodus',
        name: 'Éxodo',
        description: 'Permite retirar recursos o aliados de una región antes de resolver una crisis.',
        kind: 'ultimate',
        target: 'region',
        cooldownRounds: 4,
        tags: ['evacuation', 'resources', 'protection'],
      },
    },
  },
  {
    id: 'guemes',
    name: 'Martín Miguel de Güemes',
    shortName: 'Güemes',
    archetype: 'Guerrillero',
    shortDescription: 'Guerrillero de una ficción histórica alternativa, no una recreación educativa.',
    skills: {
      active: {
        id: 'ambush',
        name: 'Emboscada',
        description: 'Permite interrumpir una acción enemiga válida bajo determinadas condiciones.',
        kind: 'active',
        target: 'player',
        cooldownRounds: 2,
        tags: ['interrupt', 'defense', 'sabotage'],
      },
      passive: {
        id: 'gaucho-network',
        name: 'Red Gaucha',
        description:
          'Obtiene información adicional sobre movimientos o actividad en determinadas regiones.',
        kind: 'passive',
        target: 'none',
        cooldownRounds: 0,
        tags: ['information', 'territory', 'intelligence'],
      },
      ultimate: {
        id: 'territorial-resistance',
        name: 'Resistencia Territorial',
        description: 'Refuerza temporalmente una región y dificulta acciones hostiles sobre ella.',
        kind: 'ultimate',
        target: 'region',
        cooldownRounds: 4,
        tags: ['territory', 'defense', 'resistance'],
      },
    },
  },
  {
    id: 'azurduy',
    name: 'Juana Azurduy',
    shortName: 'Azurduy',
    archetype: 'Insurgente',
    shortDescription: 'Insurgente en un universo ficticio que reimagina los conflictos de la región.',
    skills: {
      active: {
        id: 'uprising',
        name: 'Levantamiento',
        description: 'Convoca apoyo temporal de NPCs o población en una región.',
        kind: 'active',
        target: 'region',
        cooldownRounds: 2,
        tags: ['npc', 'support', 'rebellion'],
      },
      passive: {
        id: 'resistance',
        name: 'Resistencia',
        description: 'Reduce determinadas penalizaciones aplicadas al personaje.',
        kind: 'passive',
        target: 'none',
        cooldownRounds: 0,
        tags: ['survival', 'resilience'],
      },
      ultimate: {
        id: 'insurrection',
        name: 'Insurrección',
        description: 'Puede alterar fuertemente el equilibrio de influencia de una región.',
        kind: 'ultimate',
        target: 'region',
        cooldownRounds: 4,
        tags: ['influence', 'territory', 'rebellion'],
      },
    },
  },
  {
    id: 'moreno',
    name: 'Mariano Moreno',
    shortName: 'Moreno',
    archetype: 'Operador de información',
    shortDescription: 'Operador de información en una línea histórica deliberadamente inventada.',
    skills: {
      active: {
        id: 'gazette',
        name: 'Gazeta',
        description:
          'Permite publicar una afirmación que posteriormente podrá entrar al sistema de información y memoria de NPCs.',
        kind: 'active',
        target: 'global',
        cooldownRounds: 2,
        tags: ['information', 'rumor', 'public'],
      },
      passive: {
        id: 'press-operation',
        name: 'Operación de Prensa',
        description: 'Obtiene una ventaja al modificar credibilidad o difusión de información.',
        kind: 'passive',
        target: 'none',
        cooldownRounds: 0,
        tags: ['information', 'credibility', 'manipulation'],
      },
      ultimate: {
        id: 'secret-plan',
        name: 'Plan Secreto',
        description:
          'Permite realizar una futura acción compatible sin revelar inmediatamente su autor.',
        kind: 'ultimate',
        target: 'self',
        cooldownRounds: 4,
        tags: ['secret', 'deception', 'information'],
      },
    },
  },
  {
    id: 'rosas',
    name: 'Juan Manuel de Rosas',
    shortName: 'Rosas',
    archetype: 'Caudillo',
    shortDescription: 'Caudillo de una Argentina alternativa diseñada para el juego y la ficción.',
    skills: {
      active: {
        id: 'loyalty',
        name: 'Lealtad',
        description: 'Puede fortalecer la relación o alianza con un NPC.',
        kind: 'active',
        target: 'npc',
        cooldownRounds: 2,
        tags: ['npc', 'loyalty', 'influence'],
      },
      passive: {
        id: 'informant-network',
        name: 'Red de Informantes',
        description: 'Puede obtener información adicional sobre determinados acontecimientos ocultos.',
        kind: 'passive',
        target: 'none',
        cooldownRounds: 0,
        tags: ['information', 'intelligence', 'control'],
      },
      ultimate: {
        id: 'order',
        name: 'Orden',
        description:
          'Puede impedir temporalmente determinados efectos de rebelión o desorden en una región.',
        kind: 'ultimate',
        target: 'region',
        cooldownRounds: 4,
        tags: ['control', 'territory', 'stability'],
      },
    },
  },
  {
    id: 'sarmiento',
    name: 'Domingo F. Sarmiento',
    shortName: 'Sarmiento',
    archetype: 'Reformador',
    shortDescription: 'Reformador ficticio de una república que nunca existió de este modo.',
    skills: {
      active: {
        id: 'education',
        name: 'Educación',
        description:
          'Puede mejorar temporal o permanentemente una futura propiedad permitida de un NPC o región.',
        kind: 'active',
        target: 'npc',
        cooldownRounds: 2,
        tags: ['npc', 'development', 'influence'],
      },
      passive: {
        id: 'reform',
        name: 'Reforma',
        description:
          'Obtiene ventajas al realizar acciones relacionadas con desarrollo o cambio institucional.',
        kind: 'passive',
        target: 'none',
        cooldownRounds: 0,
        tags: ['development', 'institution', 'influence'],
      },
      ultimate: {
        id: 'poison-pen',
        name: 'Pluma Venenosa',
        description: 'Puede producir una fuerte pérdida de reputación pública sobre otro personaje.',
        kind: 'ultimate',
        target: 'player',
        cooldownRounds: 4,
        tags: ['reputation', 'information', 'attack'],
      },
    },
  },
  {
    id: 'brown',
    name: 'Guillermo Brown',
    shortName: 'Brown',
    archetype: 'Almirante',
    shortDescription: 'Almirante de una aventura histórica alternativa sin pretensión documental.',
    skills: {
      active: {
        id: 'blockade',
        name: 'Bloqueo',
        description: 'Puede cerrar temporalmente una ruta válida.',
        kind: 'active',
        target: 'route',
        cooldownRounds: 2,
        tags: ['route', 'control', 'strategy'],
      },
      passive: {
        id: 'river-domain',
        name: 'Dominio del Río',
        description: 'Obtiene ventajas de movimiento o control en rutas fluviales.',
        kind: 'passive',
        target: 'none',
        cooldownRounds: 0,
        tags: ['movement', 'river', 'route'],
      },
      ultimate: {
        id: 'bombardment',
        name: 'Bombardeo',
        description:
          'Puede afectar recursos o control de una región conectada mediante una ruta válida.',
        kind: 'ultimate',
        target: 'region',
        cooldownRounds: 4,
        tags: ['resources', 'attack', 'territory'],
      },
    },
  },
] as const satisfies readonly PlayableCharacter[];

export type PlayableCharacterId = (typeof playableCharacters)[number]['id'];
export type SkillId = (typeof playableCharacters)[number]['skills'][SkillKind]['id'];

export function isPlayableCharacterId(value: string): value is PlayableCharacterId {
  return playableCharacters.some((character) => character.id === value);
}

export function getPlayableCharacter(characterId: PlayableCharacterId) {
  const character = playableCharacters.find((candidate) => candidate.id === characterId);
  if (!character) throw new Error(`Personaje jugable inválido: ${characterId}`);
  return character;
}

export function getCharacterSkills(characterId: PlayableCharacterId): readonly SkillDefinition[] {
  const { skills } = getPlayableCharacter(characterId);
  return [skills.active, skills.passive, skills.ultimate];
}

export function isSkillIdForCharacter(
  characterId: PlayableCharacterId,
  skillId: string,
): skillId is SkillId {
  return getCharacterSkills(characterId).some((skill) => skill.id === skillId);
}

export function getSkill(characterId: PlayableCharacterId, skillId: string): SkillDefinition {
  const skill = getCharacterSkills(characterId).find((candidate) => candidate.id === skillId);
  if (!skill) throw new Error(`Skill inválida para ${characterId}: ${skillId}`);
  return skill;
}
