import React from 'react';
import { useNavigate } from 'react-router-dom';
import { tss } from '../tss';
import { useGetPokemons } from 'src/hooks/useGetPokemons';

export const PokemonListPage = () => {
  const { classes } = useStyles();
  const { data } = useGetPokemons();
  const navigate = useNavigate();

  const handlePokemonClick = (id: string) => {
    navigate(`/pokemon/${id}`);
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
    </div>
  );
};

const useStyles = tss.create(({ theme }) => ({
  root: {
    color: theme.color.text.primary,
    padding: '20px',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '16px',
  },
  listItem: {
    listStyle: 'none',
  },
  cardButton: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    padding: '16px',
    border: 'none',
    borderRadius: '12px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    color: 'inherit',
    cursor: 'pointer',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    '&:hover': {
      transform: 'translateY(-4px) scale(1.02)',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
  },
  sprite: {
    width: '120px',
    height: '120px',
    objectFit: 'contain',
  },
  number: {
    fontSize: '12px',
    color: 'rgba(250, 250, 250, 0.6)',
    marginTop: '8px',
  },
  name: {
    fontSize: '18px',
    fontWeight: 600,
    marginTop: '4px',
  },
  types: {
    fontSize: '14px',
    color: 'rgba(250, 250, 250, 0.6)',
    marginTop: '4px',
  },
}));
