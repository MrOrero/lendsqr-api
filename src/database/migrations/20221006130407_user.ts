import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("user", (table: Knex.TableBuilder) => {
        table.increments().primary();
        table.string("first_name").notNullable();
        table.string("last_name").notNullable();
        table.string("email").notNullable();
        table.string("password").notNullable();
        table.timestamps(true, false, true);
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("user");
}
