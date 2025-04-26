import config from "../config/env.js";
import { MongoClient } from "mongodb";
const connectionString = config.MONGO_DB_URI;
const client = new MongoClient(connectionString);
let conn;
try {
  conn = await client.connect();
} catch(e) {
  console.error(e);
}
let db = conn.db("app");
export default db;