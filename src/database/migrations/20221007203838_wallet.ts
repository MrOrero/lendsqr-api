import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("wallet", (table: Knex.TableBuilder) => {
        table.increments("id").primary();
        table.string("wallet_number").notNullable().unique();
        table.decimal("balance").notNullable().defaultTo("0");
        table.string("pin").notNullable();
        table
            .integer("user_id")
            .unsigned()
            .unique()
            .references("user.id")
            .onDelete("CASCADE");
        table.timestamps(true, false, true);
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("wallet");
}
