const { MongoClient } = require('mongodb');
require('dotenv').config();

/**
 * MIGRATION SCRIPT
 * Copies all data from a Source MongoDB to a Destination MongoDB
 */

// --- CONFIGURATION ---
// You can either paste your URIs here or make sure they are in .env
const SOURCE_URI = "mongodb+srv://NusratInternationalAndTravels:hbbnH8AChl4wLHvu@nusratinternationalandt.3snol9x.mongodb.net/nusrat_travels";
const DESTINATION_URI = "mongodb+srv://nusrattravels1429_db_user:T7Q6PcOMiVqYkt55@nusrat-internationa.6ot9urw.mongodb.net/nusrat_travels?retryWrites=true&w=majority&appName=nusrat-internationa";

async function migrate() {
    if (SOURCE_URI.includes("PASTE_YOUR") || DESTINATION_URI.includes("PASTE_YOUR")) {
        console.error("❌ ERROR: Please paste your real MongoDB URIs into the script or .env file.");
        process.exit(1);
    }

    const sourceClient = new MongoClient(SOURCE_URI);
    const destClient = new MongoClient(DESTINATION_URI);

    try {
        console.log("Connecting to Source DB...");
        await sourceClient.connect();
        console.log("✅ Connected to Source DB.");

        console.log("Connecting to Destination DB...");
        await destClient.connect();
        console.log("✅ Connected to Destination DB.");

        // Extract DB name from URIs (or specify manually)
        const sourceDbName = sourceClient.options.dbName || "nusrat_travels";
        const destDbName = destClient.options.dbName || "nusrat_travels";

        const sourceDb = sourceClient.db(sourceDbName);
        const destDb = destClient.db(destDbName);

        // Get all collections from source
        const collections = await sourceDb.listCollections().toArray();
        
        for (const collInfo of collections) {
            const collName = collInfo.name;
            
            // Skip system collections if any
            if (collName.startsWith('system.')) continue;

            console.log(`\n📦 Migrating collection: [${collName}]`);
            
            const sourceColl = sourceDb.collection(collName);
            const destColl = destDb.collection(collName);

            // Find all documents
            const docs = await sourceColl.find({}).toArray();

            if (docs.length === 0) {
                console.log(`   - Skipping: No documents found in [${collName}]`);
                continue;
            }

            console.log(`   - Found ${docs.length} documents. Copying...`);

            // Clear destination collection first (Optional, but safer for a clean migration)
            // await destColl.deleteMany({}); 

            // Insert into destination
            const result = await destColl.insertMany(docs);
            console.log(`   - ✅ Successfully copied ${result.insertedCount} documents.`);
        }

        console.log("\n==========================================");
        console.log("🎉 DATABASE MIGRATION COMPLETE!");
        console.log("==========================================");

    } catch (err) {
        console.error("❌ MIGRATION FAILED:");
        console.error(err);
    } finally {
        await sourceClient.close();
        await destClient.close();
    }
}

migrate();
