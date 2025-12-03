import React, { useState, useMemo } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Spin } from 'antd';
import { tss } from '../tss';
import { useGetPokemons } from 'src/hooks/useGetPokemons';

export const PokemonListPage = () => {
  const { classes } = useStyles();
  const { data, loading, error } = useGetPokemons();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPokemon = useMemo(() => {
    if (!data) return [];
    if (!searchTerm.trim()) return data;
    const lowerSearch = searchTerm.toLowerCase();
    return data.filter((pokemon) => pokemon.name?.toLowerCase().includes(lowerSearch));
  }, [data, searchTerm]);

  const handlePokemonClick = (id: number) => {
    navigate(`pokemon/${id}`);
  };

  // Loading state
  if (loading) {
    return (
      <div className={classes.root}>
        <div className={classes.stateContainer}>
          <Spin size="large" />
          <p>Loading Pokémon...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={classes.root}>
        <div className={classes.errorContainer}>
          <p className={classes.errorTitle}>Failed to load Pokémon</p>
          <p className={classes.errorMessage}>{error.message}</p>
        </div>
      </div>
    );
  }

  // Empty data state (no Pokemon returned from API)
  if (!data || data.length === 0) {
    return (
      <div className={classes.root}>
        <div className={classes.stateContainer}>
          <p>No Pokémon available</p>
        </div>
      </div>
    );
  }

  return (
    <div className={classes.root}>
      <div className={classes.searchContainer}>
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={classes.searchInput}
        />
      </div>

      {filteredPokemon.length === 0 ? (
        <div className={classes.noResults}>
          <p>No Pokémon found matching &quot;{searchTerm}&quot;</p>
        </div>
      ) : (
        <ul className={classes.list}>
          {filteredPokemon.map((d) => (
            <li key={d.id} className={classes.listItem}>
              <button
                type="button"
                className={classes.cardButton}
                onClick={() => handlePokemonClick(d.id)}
              >
                <img src={d.sprite} alt={d.name} className={classes.sprite} />
                <span className={classes.number}>#{d.id}</span>
                <span className={classes.name}>{d.name}</span>
                <span className={classes.types}>{d.types?.join(', ')}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
      <Outlet />
    </div>
  );
};

const useStyles = tss.create(({ theme }) => ({
  root: {
    color: theme.color.text.primary,
    padding: '1.25rem',
    minHeight: '50vh',
  },
  stateContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1rem',
    padding: '3rem',
    color: 'rgba(250, 250, 250, 0.6)',
    fontSize: '1.125rem',
  },
  errorContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '3rem',
    textAlign: 'center',
  },
  errorTitle: {
    color: '#ff4d4f',
    fontSize: '1.25rem',
    fontWeight: 600,
    marginBottom: '0.5rem',
  },
  errorMessage: {
    color: 'rgba(250, 250, 250, 0.6)',
    fontSize: '0.875rem',
  },
  searchContainer: {
    marginBottom: '1.5rem',
    display: 'flex',
    justifyContent: 'center',
  },
  searchInput: {
    width: '100%',
    maxWidth: '25rem',
    padding: '0.75rem 1rem',
    fontSize: '1rem',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '0.5rem',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    color: theme.color.text.primary,
    outline: 'none',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    '&::placeholder': {
      color: 'rgba(250, 250, 250, 0.4)',
    },
    '&:focus': {
      borderColor: 'rgba(255, 255, 255, 0.5)',
      boxShadow: '0 0 0 3px rgba(255, 255, 255, 0.1)',
    },
  },
  noResults: {
    textAlign: 'center',
    padding: '3rem',
    color: 'rgba(250, 250, 250, 0.6)',
    fontSize: '1.125rem',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(12.5rem, 1fr))',
    gap: '1rem',
  },
  listItem: {
    listStyle: 'none',
  },
  cardButton: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    padding: '1rem',
    border: 'none',
    borderRadius: '0.75rem',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    color: 'inherit',
    cursor: 'pointer',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    '&:hover': {
      transform: 'translateY(-0.25rem) scale(1.02)',
      boxShadow: '0 0.5rem 1.5rem rgba(0, 0, 0, 0.3)',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
  },
  sprite: {
    width: '7.5rem',
    height: '7.5rem',
    objectFit: 'contain',
  },
  number: {
    fontSize: '0.75rem',
    color: 'rgba(250, 250, 250, 0.6)',
    marginTop: '0.5rem',
  },
  name: {
    fontSize: '1.125rem',
    fontWeight: 600,
    marginTop: '0.25rem',
  },
  types: {
    fontSize: '0.875rem',
    color: 'rgba(250, 250, 250, 0.6)',
    marginTop: '0.25rem',
  },
}));
