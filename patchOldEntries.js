
// patchOldEntries.js

const { MongoClient } = require("mongodb");
require("dotenv").config();

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

async function patchEntries() {
  try {
    await client.connect();
    console.log("✅ Connected to MongoDB");

    const db = client.db("clinicalmetrics"); // <-- CHANGE if different
    const entries = db.collection("entries");

    const missingFacilityCount = await entries.countDocuments({ facility: { $exists: false } });
    const missingSWLCount = await entries.countDocuments({ swlUnplanned: { $exists: false } });

    console.log(`🔎 Entries missing facility: ${missingFacilityCount}`);
    console.log(`🔎 Entries missing swlUnplanned: ${missingSWLCount}`);

    if (missingFacilityCount > 0) {
      const res1 = await entries.updateMany(
        { facility: { $exists: false } },
        { $set: { facility: "Unknown Facility" } }
      );
      console.log(`✅ Updated ${res1.modifiedCount} entries with missing facility`);
    }

    if (missingSWLCount > 0) {
      const res2 = await entries.updateMany(
        { swlUnplanned: { $exists: false } },
        { $set: { swlUnplanned: 0 } }
      );
      console.log(`✅ Updated ${res2.modifiedCount} entries with missing swlUnplanned`);
    }

    if (missingFacilityCount === 0 && missingSWLCount === 0) {
      console.log("✅ No entries needed patching");
    }

  } catch (error) {
    console.error("❌ Patch failed:", error);
  } finally {
    await client.close();
  }
}

patchEntries();
