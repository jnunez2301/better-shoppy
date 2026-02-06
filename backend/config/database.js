import { Sequelize } from 'sequelize';
import { environment } from './environment.js';
import chalk from 'chalk';

const sequelize = new Sequelize(
  environment.DB_NAME,
  environment.DB_USER,
  environment.DB_PASSWORD,
  {
    host: environment.DB_HOST,
    dialect: 'mysql',
    logging: (msg) => console.log(chalk.gray(msg)),
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

export const connectDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log(chalk.green('✓ Database connection established successfully'));

    // Sync models (in development)
    await sequelize.sync({ alter: true });
    console.log(chalk.green('✓ Database models synchronized'));

    return sequelize;
  } catch (error) {
    console.error(chalk.red('✗ Unable to connect to database:'), error);
    process.exit(1);
  }
};

export default sequelize;
