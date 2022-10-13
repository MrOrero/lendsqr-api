import path from "path";
import type { Knex } from "knex";

// Update with your config settings.

const config: { [key: string]: Knex.Config } = {
    development: {
        client: "mysql2",
        connection: {
            host: process.env.DEVELOPMENT_HOST,
            user: process.env.DEVELOPMENT_USER,
            password: process.env.DEVELOPMENT_PASSWORD,
            database: process.env.DEVELOPMENT_DATABASE,
        },
        useNullAsDefault: true,
        migrations: {
            directory: path.resolve(__dirname, "migrations"),
        },
    },
    test: {
        client: "mysql2",
        connection: {
            host: process.env.TEST_HOST,
            user: process.env.TEST_USER,
            password: process.env.TEST_PASSWORD,
            database: process.env.TEST_DATABASE,
        },
        useNullAsDefault: true,
        migrations: {
            // tableName: "lendsqr_migrations",
            directory: path.resolve(__dirname, "migrations"),
        },
    },
    production: {
        client: "mysql2",
        connection: {
            host: process.env.DEVELOPMENT_HOST,
            user: process.env.DEVELOPMENT_USER,
            password: process.env.DEVELOPMENT_PASSWORD,
            database: process.env.DEVELOPMENT_DATABASE,
        },
        useNullAsDefault: true,
        migrations: {
            directory: path.resolve(__dirname, "migrations"),
        },
        pool: {
            min: 2,
            max: 10,
        },
    },
};

export default config;
