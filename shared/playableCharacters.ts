export type PlayableCharacter = {
  id: string;
  name: string;
  shortName: string;
  archetype: string;
  shortDescription: string;
};

export const playableCharacters = [
  {
    id: 'san-martin',
    name: 'José de San Martín',
    shortName: 'San Martín',
    archetype: 'Estratega',
    shortDescription: 'Estratega de una Argentina alternativa donde la historia tomó otro rumbo.',
  },
  {
    id: 'belgrano',
    name: 'Manuel Belgrano',
    shortName: 'Belgrano',
    archetype: 'Organizador',
    shortDescription: 'Organizador de una república imposible inspirada libremente en el pasado.',
  },
  {
    id: 'guemes',
    name: 'Martín Miguel de Güemes',
    shortName: 'Güemes',
    archetype: 'Guerrillero',
    shortDescription: 'Guerrillero de una ficción histórica alternativa, no una recreación educativa.',
  },
  {
    id: 'azurduy',
    name: 'Juana Azurduy',
    shortName: 'Azurduy',
    archetype: 'Insurgente',
    shortDescription: 'Insurgente en un universo ficticio que reimagina los conflictos de la región.',
  },
  {
    id: 'moreno',
    name: 'Mariano Moreno',
    shortName: 'Moreno',
    archetype: 'Operador de información',
    shortDescription: 'Operador de información en una línea histórica deliberadamente inventada.',
  },
  {
    id: 'rosas',
    name: 'Juan Manuel de Rosas',
    shortName: 'Rosas',
    archetype: 'Caudillo',
    shortDescription: 'Caudillo de una Argentina alternativa diseñada para el juego y la ficción.',
  },
  {
    id: 'sarmiento',
    name: 'Domingo F. Sarmiento',
    shortName: 'Sarmiento',
    archetype: 'Reformador',
    shortDescription: 'Reformador ficticio de una república que nunca existió de este modo.',
  },
  {
    id: 'brown',
    name: 'Guillermo Brown',
    shortName: 'Brown',
    archetype: 'Almirante',
    shortDescription: 'Almirante de una aventura histórica alternativa sin pretensión documental.',
  },
] as const satisfies readonly PlayableCharacter[];

export type PlayableCharacterId = (typeof playableCharacters)[number]['id'];

export function isPlayableCharacterId(value: string): value is PlayableCharacterId {
  return playableCharacters.some((character) => character.id === value);
}

export function getPlayableCharacter(characterId: PlayableCharacterId) {
  return playableCharacters.find((character) => character.id === characterId)!;
}
