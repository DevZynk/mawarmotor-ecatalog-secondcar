import * as migration_20260719_072910 from './20260719_072910';

export const migrations = [
  {
    up: migration_20260719_072910.up,
    down: migration_20260719_072910.down,
    name: '20260719_072910'
  },
];
