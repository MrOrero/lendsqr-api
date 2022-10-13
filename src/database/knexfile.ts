import path from "path";
import type { Knex } from "knex";

// Update with your config settings.

const config: { [key: string]: Knex.Config } = {
    development: {
        client: "mysql2",
        connection: {
            host: "sql8.freesqldatabase.com",
            user: "sql8524428",
            password: "tWRJS5xqM2",
            database: "sql8524428",
        },
        useNullAsDefault: true,
        migrations: {
            // tableName: "lendsqr_migrations",
            directory: path.resolve(__dirname, "migrations"),
        },
    },
    test: {
        client: "mysql2",
        connection: {
            host: "sql8.freesqldatabase.com",
            user: "sql8526202",
            password: "XNyc7SSIku",
            database: "sql8526202",
        },
        useNullAsDefault: true,
        migrations: {
            // tableName: "lendsqr_migrations",
            directory: path.resolve(__dirname, "migrations"),
        },
    },

    staging: {
        client: "postgresql",
        connection: {
            database: "my_db",
            user: "username",
            password: "password",
        },
        pool: {
            min: 2,
            max: 10,
        },
        migrations: {
            tableName: "knex_migrations",
        },
    },

    production: {
        client: "postgresql",
        connection: {
            database: "my_db",
            user: "username",
            password: "password",
        },
        pool: {
            min: 2,
            max: 10,
        },
        migrations: {
            tableName: "knex_migrations",
        },
    },
};

export default config;
