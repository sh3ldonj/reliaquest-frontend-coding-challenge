import { useQuery } from '@apollo/client/react';
import { GET_POKEMON_DETAILS } from './useGetPokemons';

export interface PokemonDetail {
  id: number;
  name: string;
  types: string[];
  sprite: string;
  weight: number;
  height: number;
  captureRate: number;
  stats: {
    name: string;
    value: number;
  }[];
}

export const useGetPokemonDetails = (
  id: number,
): {
  data: PokemonDetail | null;
  loading: boolean;
  error: ReturnType<typeof useQuery>['error'];
} => {
  const { data, loading, error } = useQuery<{ pokemon: any[] }>(GET_POKEMON_DETAILS, {
    variables: { id },
    skip: !id || Number.isNaN(id),
  });

  const pokemon = data?.pokemon?.[0];

  if (!pokemon) {
    return { data: null, loading, error };
  }

  return {
    data: {
      id: pokemon.id,
      name: pokemon.pokemonspecy?.pokemonspeciesnames?.[0]?.name ?? 'Unknown',
      types: pokemon.pokemontypes?.map((t: any) => t.type.typenames?.[0]?.name) ?? [],
      sprite: pokemon.pokemonsprites?.[0]?.sprites ?? '',
      weight: pokemon.weight,
      height: pokemon.height,
      captureRate: pokemon.pokemonspecy?.capture_rate ?? 0,
      stats:
        pokemon.pokemonstats?.map((s: any) => ({
          name: s.stat.name,
          value: s.base_stat,
        })) ?? [],
    },
    loading,
    error,
  };
};
