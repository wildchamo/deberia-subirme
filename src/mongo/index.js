const { MongoClient } = require("mongodb");

export async function mongoClient() {
  const uri = process.env.MONGO_DB_URI;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const dbName = "app";

    return client.db(dbName);
    const collectionName = "recipes";
    const database = client.db(dbName);
    const collection = database.collection(collectionName);

    // Insert documents
    const recipes = [
      {
        name: "elotes",
        ingredients: [
          "corn",
          "mayonnaise",
          "cotija cheese",
          "sour cream",
          "lime",
        ],
        prepTimeInMinutes: 35,
      },
      {
        name: "loco moco",
        ingredients: [
          "ground beef",
          "butter",
          "onion",
          "egg",
          "bread bun",
          "mushrooms",
        ],
        prepTimeInMinutes: 54,
      },
      {
        name: "patatas bravas",
        ingredients: [
          "potato",
          "tomato",
          "olive oil",
          "onion",
          "garlic",
          "paprika",
        ],
        prepTimeInMinutes: 80,
      },
      {
        name: "fried rice",
        ingredients: [
          "rice",
          "soy sauce",
          "egg",
          "onion",
          "pea",
          "carrot",
          "sesame oil",
        ],
        prepTimeInMinutes: 40,
      },
    ];

    const insertManyResult = await collection.insertMany(recipes);
    console.log(
      `${insertManyResult.insertedCount} documents successfully inserted.\n`
    );

    // Find documents
    const findQuery = { prepTimeInMinutes: { $lt: 45 } };
    const cursor = await collection.find(findQuery).sort({ name: 1 });
    await cursor.forEach((recipe) => {
      console.log(
        `${recipe.name} has ${recipe.ingredients.length} ingredients and takes ${recipe.prepTimeInMinutes} minutes to make.`
      );
    });
    console.log();

    // Find one document
    const findOneQuery = { ingredients: "potato" };
    const findOneResult = await collection.findOne(findOneQuery);
    if (findOneResult === null) {
      console.log(
        "Couldn't find any recipes that contain 'potato' as an ingredient.\n"
      );
    } else {
      console.log(
        `Found a recipe with 'potato' as an ingredient:\n${JSON.stringify(
          findOneResult
        )}\n`
      );
    }

    // Update a document
    const updateDoc = { $set: { prepTimeInMinutes: 72 } };
    const updateOptions = { returnOriginal: false };
    const updateResult = await collection.findOneAndUpdate(
      findOneQuery,
      updateDoc,
      updateOptions
    );
    console.log(
      `Here is the updated document:\n${JSON.stringify(updateResult.value)}\n`
    );

    // Delete documents
    const deleteQuery = { name: { $in: ["elotes", "fried rice"] } };
    const deleteResult = await collection.deleteMany(deleteQuery);
    console.log(`Deleted ${deleteResult.deletedCount} documents\n`);
  } catch (err) {
    console.error(`Something went wrong: ${err}\n`);
  } finally {
    await client.close();
  }
}
