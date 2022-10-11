import knex, { Knex } from "knex";
import knexfile from "./database/knexfile";

let conn: Knex;
if (process.env.NODE_ENV === "test") {
    conn = knex(knexfile.test);
} else {
    conn = knex(knexfile.development);
}

conn.raw("SELECT VERSION()").then(() => {
    console.log("connected sucessfully");
});

export default conn;
