import React from 'react';
import { act, render, screen } from 'src/test-utils';
import { PokemonListPage } from './PokemonListPage';
import { useNavigate } from 'react-router-dom';
import { useGetPokemons } from 'src/hooks/useGetPokemons';

const mockPokemonData = [
  { id: '1', name: 'Bulbasaur', types: ['Grass', 'Poison'], sprite: '' },
  { id: '4', name: 'Charmander', types: ['Fire'], sprite: '' },
  { id: '7', name: 'Squirtle', types: ['Water'], sprite: '' },
];

jest.mock('src/hooks/useGetPokemons', () => ({
  useGetPokemons: jest.fn(),
}));
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
  Outlet: jest.fn(() => null),
}));

const mockUseGetPokemons = useGetPokemons as jest.Mock;

describe('PokemonListPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Default mock - successful data load
    mockUseGetPokemons.mockReturnValue({
      data: mockPokemonData,
      loading: false,
      error: undefined,
    });
  });

  describe('rendering', () => {
    test('renders Pokemon list', () => {
      render(<PokemonListPage />);
      expect(screen.getByText('Bulbasaur')).toBeInTheDocument();
      expect(screen.getByText('Charmander')).toBeInTheDocument();
      expect(screen.getByText('Squirtle')).toBeInTheDocument();
    });

    test('renders search input', () => {
      render(<PokemonListPage />);
      expect(screen.getByPlaceholderText('Search by name...')).toBeInTheDocument();
    });

    test('renders Pokemon numbers', () => {
      render(<PokemonListPage />);
      expect(screen.getByText('#1')).toBeInTheDocument();
      expect(screen.getByText('#4')).toBeInTheDocument();
      expect(screen.getByText('#7')).toBeInTheDocument();
    });
  });

  describe('loading state', () => {
    test('shows loading spinner when loading', () => {
      mockUseGetPokemons.mockReturnValue({
        data: [],
        loading: true,
        error: undefined,
      });

      render(<PokemonListPage />);
      expect(screen.getByText('Loading Pokémon...')).toBeInTheDocument();
    });
  });

  describe('error state', () => {
    test('shows error message when fetch fails', () => {
      mockUseGetPokemons.mockReturnValue({
        data: [],
        loading: false,
        error: { message: 'Network error' },
      });

      render(<PokemonListPage />);
      expect(screen.getByText('Failed to load Pokémon')).toBeInTheDocument();
      expect(screen.getByText('Network error')).toBeInTheDocument();
    });
  });

  describe('empty state', () => {
    test('shows empty message when no Pokemon available', () => {
      mockUseGetPokemons.mockReturnValue({
        data: [],
        loading: false,
        error: undefined,
      });

      render(<PokemonListPage />);
      expect(screen.getByText('No Pokémon available')).toBeInTheDocument();
    });
  });

  describe('navigation', () => {
    test('clicking on a Pokemon calls navigate with correct route', async () => {
      const mockNavigate = jest.fn();
      (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
      const { user } = render(<PokemonListPage />);

      await act(async () => {
        await user.click(screen.getByText('Bulbasaur'));
      });

      expect(mockNavigate).toHaveBeenCalledWith('pokemon/1');
    });

    test('clicking different Pokemon navigates to different routes', async () => {
      const mockNavigate = jest.fn();
      (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
      const { user } = render(<PokemonListPage />);

      await act(async () => {
        await user.click(screen.getByText('Squirtle'));
      });

      expect(mockNavigate).toHaveBeenCalledWith('pokemon/7');
    });
  });

  describe('search functionality', () => {
    test('typing in search bar filters results', async () => {
      (useNavigate as jest.Mock).mockReturnValue(jest.fn());
      const { user } = render(<PokemonListPage />);

      const searchInput = screen.getByPlaceholderText('Search by name...');
      await act(async () => {
        await user.type(searchInput, 'char');
      });

      expect(screen.queryByText('Bulbasaur')).not.toBeInTheDocument();
      expect(screen.getByText('Charmander')).toBeInTheDocument();
      expect(screen.queryByText('Squirtle')).not.toBeInTheDocument();
    });

    test('search is case insensitive', async () => {
      (useNavigate as jest.Mock).mockReturnValue(jest.fn());
      const { user } = render(<PokemonListPage />);

      const searchInput = screen.getByPlaceholderText('Search by name...');
      await act(async () => {
        await user.type(searchInput, 'SQUIRTLE');
      });

      expect(screen.queryByText('Bulbasaur')).not.toBeInTheDocument();
      expect(screen.queryByText('Charmander')).not.toBeInTheDocument();
      expect(screen.getByText('Squirtle')).toBeInTheDocument();
    });

    test('shows no results message when search has no matches', async () => {
      (useNavigate as jest.Mock).mockReturnValue(jest.fn());
      const { user } = render(<PokemonListPage />);

      const searchInput = screen.getByPlaceholderText('Search by name...');
      await act(async () => {
        await user.type(searchInput, 'pikachu');
      });

      expect(screen.getByText('No Pokémon found matching "pikachu"')).toBeInTheDocument();
    });

    test('clearing search shows all Pokemon again', async () => {
      (useNavigate as jest.Mock).mockReturnValue(jest.fn());
      const { user } = render(<PokemonListPage />);

      const searchInput = screen.getByPlaceholderText('Search by name...');

      // Type to filter
      await act(async () => {
        await user.type(searchInput, 'char');
      });
      expect(screen.queryByText('Bulbasaur')).not.toBeInTheDocument();

      // Clear search
      await act(async () => {
        await user.clear(searchInput);
      });

      // All should be visible again
      expect(screen.getByText('Bulbasaur')).toBeInTheDocument();
      expect(screen.getByText('Charmander')).toBeInTheDocument();
      expect(screen.getByText('Squirtle')).toBeInTheDocument();
    });
  });
});
