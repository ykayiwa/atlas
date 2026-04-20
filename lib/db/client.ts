import postgres from "postgres";

let sql: ReturnType<typeof postgres>;

export function getDb() {
  if (!sql) {
    sql = postgres(process.env.DATABASE_URL!, {
      max: 10,
      idle_timeout: 30,
      connect_timeout: 10,
    });
  }
  return sql;
}
