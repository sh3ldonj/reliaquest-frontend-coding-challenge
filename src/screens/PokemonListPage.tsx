import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { tss } from '../tss';
import { useGetPokemons } from 'src/hooks/useGetPokemons';

export const PokemonListPage = () => {
  const { classes } = useStyles();
  const { data } = useGetPokemons();
  const navigate = useNavigate();

  const handlePokemonClick = (id: string) => {
    navigate(`pokemon/${id}`);
  };

  return (
    <div className={classes.root}>
      <ul className={classes.list}>
        {data?.map((d) => (
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
      <Outlet />
    </div>
  );
};

const useStyles = tss.create(({ theme }) => ({
  root: {
    color: theme.color.text.primary,
    padding: '1.25rem',
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
