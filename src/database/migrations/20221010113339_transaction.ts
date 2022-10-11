import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable(
        "transaction",
        (table: Knex.CreateTableBuilder) => {
            table.increments("id").primary();
            table
                .integer("sender_id")
                .unsigned()
                .references("user.id")
                .onDelete("CASCADE");
            table
                .integer("reciever_id")
                .unsigned()
                .references("user.id")
                .onDelete("CASCADE");
            table.string("amount").notNullable();
            table.timestamps(true, false, true);
        }
    );
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("account");
}
