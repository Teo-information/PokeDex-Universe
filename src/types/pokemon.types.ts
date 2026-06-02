export interface ApiResource {
  name: string;
  url: string;
}

export interface NamedApiResource {
  name: string;
  url: string;
}

export interface PokemonListResult {
  count: number;
  next: string | null;
  previous: string | null;
  results: ApiResource[];
}

export interface PokemonTypeSlot {
  slot: number;
  type: NamedApiResource;
}

export interface PokemonStat {
  base_stat: number;
  effort: number;
  stat: NamedApiResource;
}

export interface PokemonSprites {
  front_default: string | null;
  back_default: string | null;
  front_shiny: string | null;
  back_shiny: string | null;
  other?: {
    'official-artwork'?: { front_default: string | null };
  };
}

export interface PokemonAbility {
  ability: NamedApiResource;
  is_hidden: boolean;
  slot: number;
}

export interface PokemonMoveEntry {
  move: NamedApiResource;
  version_group_details: {
    level_learned_at: number;
    move_learn_method: NamedApiResource;
    version_group: NamedApiResource;
  }[];
}

export interface Pokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience: number;
  sprites: PokemonSprites;
  types: PokemonTypeSlot[];
  stats: PokemonStat[];
  abilities: PokemonAbility[];
  moves: PokemonMoveEntry[];
}

export interface PokemonSpecies {
  id: number;
  name: string;
  color: NamedApiResource;
  habitat: NamedApiResource | null;
  capture_rate: number;
  base_happiness: number;
  gender_rate: number;
  hatch_counter: number;
  evolution_chain: { url: string };
  flavor_text_entries: {
    flavor_text: string;
    language: { name: string };
    version: { name: string };
  }[];
  egg_groups: NamedApiResource[];
}

export interface EvolutionDetail {
  min_level: number | null;
  item: NamedApiResource | null;
  trigger: NamedApiResource;
  gender: number | null;
}

export interface EvolutionChainLink {
  species: NamedApiResource;
  evolution_details: EvolutionDetail[];
  evolves_to: EvolutionChainLink[];
}

export interface EvolutionChain {
  id: number;
  chain: EvolutionChainLink;
}

export interface Move {
  id: number;
  name: string;
  accuracy: number | null;
  power: number | null;
  pp: number | null;
  type: NamedApiResource;
  damage_class: NamedApiResource;
  flavor_text_entries: {
    flavor_text: string;
    language: { name: string };
  }[];
}

export interface Item {
  id: number;
  name: string;
  cost: number;
  sprites: { default: string | null };
  category: NamedApiResource;
  effect_entries: {
    effect: string;
    short_effect: string;
    language: { name: string };
  }[];
}

export interface Berry {
  id: number;
  name: string;
  growth_time: number;
  max_harvest: number;
  natural_gift_power: number;
  natural_gift_type: NamedApiResource | null;
  firmness: NamedApiResource;
  flavors: { potency: number; flavor: NamedApiResource }[];
}

export interface TypeDamageRelations {
  double_damage_from: NamedApiResource[];
  double_damage_to: NamedApiResource[];
  half_damage_from: NamedApiResource[];
  half_damage_to: NamedApiResource[];
  no_damage_from: NamedApiResource[];
  no_damage_to: NamedApiResource[];
}

export interface PokemonType {
  id: number;
  name: string;
  damage_relations: TypeDamageRelations;
}

export interface Ability {
  id: number;
  name: string;
  flavor_text_entries: {
    flavor_text: string;
    language: { name: string };
  }[];
}

export interface PokemonSummary {
  id: number;
  name: string;
  sprite: string | null;
  types: string[];
}
