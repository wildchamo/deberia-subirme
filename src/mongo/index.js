import { MongoClient } from "mongodb";

export async function mongoClient() {
  const uri = process.env.MONGO_DB_URI;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Conectado exitosamente a MongoDB");
    const dbName = "app";

    const database = client.db(dbName);
    
    return database;

  } catch (err) {
    console.error(`Something went wrong: ${err}\n`);
  } finally {
    await client.close();
  }
}
