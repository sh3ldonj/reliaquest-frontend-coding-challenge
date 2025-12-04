import React from 'react';
import { render, screen, waitFor } from 'src/test-utils';
import { PokemonDetailModal } from './PokemonDetailModal';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetPokemonDetails } from '../hooks/useGetPokemonDetails';

jest.mock('../hooks/useGetPokemonDetails', () => ({
  useGetPokemonDetails: jest.fn(),
}));
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
  useParams: jest.fn(),
}));

const mockUseGetPokemonDetails = useGetPokemonDetails as jest.Mock;
const mockUseParams = useParams as jest.Mock;
const mockUseNavigate = useNavigate as jest.Mock;

const mockPokemonDetail = {
  id: 25,
  name: 'Pikachu',
  types: ['Electric'],
  sprite: 'https://example.com/pikachu.png',
  weight: 60,
  height: 4,
  captureRate: 190,
  stats: [
    { name: 'hp', value: 35 },
    { name: 'attack', value: 55 },
    { name: 'defense', value: 40 },
    { name: 'speed', value: 90 },
  ],
};

describe('PokemonDetailModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseParams.mockReturnValue({ id: '25' });
    mockUseNavigate.mockReturnValue(jest.fn());
  });

  describe('loading state', () => {
    test('shows loading spinner when fetching data', () => {
      mockUseGetPokemonDetails.mockReturnValue({
        data: null,
        loading: true,
        error: undefined,
      });

      render(<PokemonDetailModal />);
      expect(document.querySelector('.ant-spin')).toBeInTheDocument();
    });
  });

  describe('error state', () => {
    test('shows error message when fetch fails', () => {
      mockUseGetPokemonDetails.mockReturnValue({
        data: null,
        loading: false,
        error: { message: 'Failed to fetch' },
      });

      render(<PokemonDetailModal />);
      expect(screen.getByText('Failed to load Pokémon details')).toBeInTheDocument();
      expect(screen.getByText('Failed to fetch')).toBeInTheDocument();
    });
  });

  describe('successful data display', () => {
    beforeEach(() => {
      mockUseGetPokemonDetails.mockReturnValue({
        data: mockPokemonDetail,
        loading: false,
        error: undefined,
      });
    });

    test('displays Pokemon name', () => {
      render(<PokemonDetailModal />);
      expect(screen.getByText('Pikachu')).toBeInTheDocument();
    });

    test('displays Pokemon number', () => {
      render(<PokemonDetailModal />);
      expect(screen.getByText('#25')).toBeInTheDocument();
    });

    test('displays Pokemon type', () => {
      render(<PokemonDetailModal />);
      expect(screen.getByText('Electric')).toBeInTheDocument();
    });

    test('displays Pokemon height', () => {
      render(<PokemonDetailModal />);
      expect(screen.getByText('0.4 m')).toBeInTheDocument();
    });

    test('displays Pokemon weight', () => {
      render(<PokemonDetailModal />);
      expect(screen.getByText('6.0 kg')).toBeInTheDocument();
    });

    test('displays capture rate', () => {
      render(<PokemonDetailModal />);
      expect(screen.getByText('190')).toBeInTheDocument();
    });

    test('displays base stats section', () => {
      render(<PokemonDetailModal />);
      expect(screen.getByText('Base Stats')).toBeInTheDocument();
    });

    test('displays stat values', () => {
      render(<PokemonDetailModal />);
      expect(screen.getByText('35')).toBeInTheDocument(); // HP
      expect(screen.getByText('55')).toBeInTheDocument(); // Attack
      expect(screen.getByText('40')).toBeInTheDocument(); // Defense
      expect(screen.getByText('90')).toBeInTheDocument(); // Speed
    });

    test('displays Pokemon image', () => {
      render(<PokemonDetailModal />);
      const img = screen.getByAltText('Pikachu');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', 'https://example.com/pikachu.png');
    });
  });

  describe('navigation', () => {
    test('calls navigate to /list when modal is closed', async () => {
      const mockNavigate = jest.fn();
      mockUseNavigate.mockReturnValue(mockNavigate);
      mockUseGetPokemonDetails.mockReturnValue({
        data: mockPokemonDetail,
        loading: false,
        error: undefined,
      });

      const { user } = render(<PokemonDetailModal />);

      // Find and click the close button
      const closeButton = document.querySelector('.ant-modal-close');
      if (closeButton) {
        await user.click(closeButton);
        await waitFor(() => {
          expect(mockNavigate).toHaveBeenCalledWith('/list');
        });
      }
    });
  });

  describe('hook integration', () => {
    test('passes correct ID to useGetPokemonDetails', () => {
      mockUseParams.mockReturnValue({ id: '150' });
      mockUseGetPokemonDetails.mockReturnValue({
        data: null,
        loading: true,
        error: undefined,
      });

      render(<PokemonDetailModal />);
      expect(mockUseGetPokemonDetails).toHaveBeenCalledWith(150);
    });
  });
});
