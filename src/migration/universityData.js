import { readFileSync } from 'fs'
import { mongoose } from 'mongoose'

// MongoDB Connection URI (Replace with your MongoDB URI)
const MONGO_URI = 'mongodb+srv://bacpactech:BACPAC2023@bacpac.e1tsleh.mongodb.net/bacpac'
const DB_NAME = 'bacpac'
const COLLECTION_NAME = 'university'

// Connect to MongoDB
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ Connection error:', err))

// Create a Mongoose model without a strict schema
const University = mongoose.model('university', new mongoose.Schema({}, { strict: false }))

// Read JSON file
const jsonData = JSON.parse(readFileSync('merged_universities_2.json', 'utf8'))

const universities = Object.entries(jsonData).map(([name, data]) => ({
  name,
  ...data, // Spread all other properties from the object
}))

// Perform bulk insert/update
async function migrateData() {
  const startTime = performance.now()
  try {
    const bulkOps = universities.map((uni) => ({
      updateOne: {
        filter: { name: uni.name },
        update: { $set: uni },
        upsert: true, // Insert if not exists
      },
    }))

    const result = await University.bulkWrite(bulkOps)

    console.log(`✅ ${result.upsertedCount} new universities inserted`)
    console.log(`✅ ${result.modifiedCount} universities updated`)
    const endTime = performance.now()
    console.log(`Call to insert took ${endTime - startTime} milliseconds`)
  } catch (error) {
    console.error('❌ Migration failed:', error)
  } finally {
    mongoose.disconnect().then(() => console.log('🔴 Disconnected from MongoDB'))
  }
}

// Run migration
migrateData()

//// Read JSON file
//const jsonData = JSON.parse(readFileSync('merged_universities_2.json', 'utf8'));

//// Convert JSON to array of documents
//const universities = Object.entries(jsonData).map(([name, data]) => ({
//    name,
//    ...data, // Spread all other properties from the object
//}));

//async function migrateData() {
//    const client = new MongoClient(MONGO_URI, {
//        useNewUrlParser: true,
//        useUnifiedTopology: true,
//    });

//    try {
//        await client.connect();
//        console.log('✅ Connected to MongoDB');

//        const db = client.db(DB_NAME);
//        const collection = db.collection(COLLECTION_NAME);

//        // Convert data into bulk write format for efficient insertion
//        const bulkOps = universities.map((uni) => ({
//            updateOne: {
//                filter: {name: uni.name}, // Prevent duplicates
//                update: {$set: uni},
//                upsert: true, // If the document doesn't exist, create a new one
//            },
//        }));

//        // Perform bulk write operation
//        const result = await collection.bulkWrite(bulkWriteOps);

//        console.log(`✅ ${result.upsertedCount} new universities inserted`);
//        console.log(`✅ ${result.modifiedCount} universities updated`);

//    } catch (error) {
//        console.error('❌ Migration failed:', error);
//    } finally {
//        await client.close();
//        console.log('🔴 Disconnected from MongoDB');
//    }
//}

//// Run the migration
//migrateData();
