import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Modal, Spin, Progress } from 'antd';
import { tss } from '../tss';
import { useGetPokemonDetails } from '../hooks/useGetPokemonDetails';

const TYPE_COLORS: Record<string, string> = {
  normal: '#A8A878',
  fire: '#F08030',
  water: '#6890F0',
  electric: '#F8D030',
  grass: '#78C850',
  ice: '#98D8D8',
  fighting: '#C03028',
  poison: '#A040A0',
  ground: '#E0C068',
  flying: '#A890F0',
  psychic: '#F85888',
  bug: '#A8B820',
  rock: '#B8A038',
  ghost: '#705898',
  dragon: '#7038F8',
  dark: '#705848',
  steel: '#B8B8D0',
  fairy: '#EE99AC',
};

const STAT_NAMES: Record<string, string> = {
  hp: 'HP',
  attack: 'Attack',
  defense: 'Defense',
  'special-attack': 'Sp. Atk',
  'special-defense': 'Sp. Def',
  speed: 'Speed',
};

export const PokemonDetailModal = () => {
  const { classes } = useStyles();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data: pokemon, loading, error } = useGetPokemonDetails(Number(id));

  const handleClose = () => {
    navigate('/list');
  };

  const getStatColor = (value: number): string => {
    if (value > 100) return '#52c41a';
    if (value > 50) return '#faad14';
    return '#ff4d4f';
  };

  return (
    <Modal open onCancel={handleClose} footer={null} width={500} centered className={classes.modal}>
      {loading && (
        <div className={classes.loading}>
          <Spin size="large" />
        </div>
      )}

      {error && (
        <div className={classes.error}>
          <p>Failed to load Pokémon details</p>
          <p>{error.message}</p>
        </div>
      )}

      {pokemon && (
        <div className={classes.content}>
          <img src={pokemon.sprite} alt={pokemon.name} className={classes.sprite} />

          <div className={classes.header}>
            <span className={classes.number}>#{pokemon.id}</span>
            <h2 className={classes.name}>{pokemon.name}</h2>
          </div>

          <div className={classes.types}>
            {pokemon.types.map((type) => (
              <span
                key={type}
                className={classes.typeBadge}
                style={{ backgroundColor: TYPE_COLORS[type.toLowerCase()] || '#888' }}
              >
                {type}
              </span>
            ))}
          </div>

          <div className={classes.info}>
            <div className={classes.infoItem}>
              <span className={classes.infoLabel}>Height</span>
              <span className={classes.infoValue}>{(pokemon.height / 10).toFixed(1)} m</span>
            </div>
            <div className={classes.infoItem}>
              <span className={classes.infoLabel}>Weight</span>
              <span className={classes.infoValue}>{(pokemon.weight / 10).toFixed(1)} kg</span>
            </div>
            <div className={classes.infoItem}>
              <span className={classes.infoLabel}>Capture Rate</span>
              <span className={classes.infoValue}>{pokemon.captureRate}</span>
            </div>
          </div>

          <div className={classes.stats}>
            <h3 className={classes.statsTitle}>Base Stats</h3>
            {pokemon.stats.map((stat) => (
              <div key={stat.name} className={classes.statRow}>
                <span className={classes.statName}>{STAT_NAMES[stat.name] || stat.name}</span>
                <span className={classes.statValue}>{stat.value}</span>
                <Progress
                  percent={(stat.value / 255) * 100}
                  showInfo={false}
                  strokeColor={getStatColor(stat.value)}
                  trailColor="rgba(255,255,255,0.1)"
                  size="small"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </Modal>
  );
};

const useStyles = tss.create(() => ({
  modal: {
    '& .ant-modal-content': {
      backgroundColor: '#1a1a2e',
      borderRadius: '1rem',
    },
    '& .ant-modal-close': {
      color: 'rgba(255,255,255,0.6)',
    },
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '18.75rem',
  },
  error: {
    textAlign: 'center',
    color: '#ff4d4f',
    padding: '2.5rem',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    color: '#fff',
  },
  sprite: {
    width: '12.5rem',
    height: '12.5rem',
    objectFit: 'contain',
  },
  header: {
    textAlign: 'center',
    marginTop: '0.5rem',
  },
  number: {
    fontSize: '0.875rem',
    color: 'rgba(255,255,255,0.5)',
  },
  name: {
    fontSize: '1.75rem',
    fontWeight: 700,
    margin: '0.25rem 0 0.75rem',
    textTransform: 'capitalize',
  },
  types: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '1.25rem',
  },
  typeBadge: {
    padding: '0.25rem 1rem',
    borderRadius: '1.25rem',
    fontSize: '0.875rem',
    fontWeight: 500,
    textTransform: 'capitalize',
  },
  info: {
    display: 'flex',
    gap: '1.5rem',
    marginBottom: '1.5rem',
  },
  infoItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: '0.75rem',
    color: 'rgba(255,255,255,0.5)',
  },
  infoValue: {
    fontSize: '1.125rem',
    fontWeight: 600,
  },
  stats: {
    width: '100%',
  },
  statsTitle: {
    fontSize: '1rem',
    fontWeight: 600,
    marginBottom: '0.75rem',
  },
  statRow: {
    display: 'grid',
    gridTemplateColumns: '5rem 2.5rem 1fr',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '0.5rem',
  },
  statName: {
    fontSize: '0.8125rem',
    color: 'rgba(255,255,255,0.7)',
  },
  statValue: {
    fontSize: '0.875rem',
    fontWeight: 600,
    textAlign: 'right',
  },
}));
