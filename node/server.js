import express from "express";
import cors from "cors";
import { MongoClient, ObjectId } from "mongodb";

const app = express();
app.use(express.json());
app.use(cors());

// 🔹 MongoDB Connection (Native Driver)
const url = "mongodb://localhost:27017";
const client = new MongoClient(url);
let db, Teams, Players, Matches, Umpires;

(async () => {
  await client.connect();
  console.log("✅ MongoDB Connected (Native Driver)");

  db = client.db("collegeDB"); // Same DB name you used
  Teams = db.collection("teams");
  Players = db.collection("players");
  Matches = db.collection("matches");
  Umpires = db.collection("umpires");
})();

// 🔹 Route: One API for All Queries
app.post("/api/query", async (req, res) => {
  const { question } = req.body;
  let result = "No result found.";

  try {
    switch (question) {
      case "List matches played at 'Chinnaswamy Stadium.'":
        result = await Matches.find({ stadium: "Chinnaswamy Stadium" }).toArray();
        break;

      case "Find the player with the highest total runs.":
        result = await Players.find().sort({ runs: -1 }).limit(1).toArray();
        break;

      case "Show the bowler who took the most wickets in the tournament.":
        result = await Players.find().sort({ wickets: -1 }).limit(1).toArray();
        break;

      case "Retrieve teams with the most match wins.":
        result = await Teams.find().sort({ wins: -1 }).limit(3).toArray();
        break;

      case "Identify umpires who officiated more than 10 matches.":
        result = await Umpires.find({ matchesOfficiated: { $gt: 10 } }).toArray();
        break;

      case "Calculate the average runs scored per match.":
        result = await Matches.aggregate([
          { $group: { _id: null, averageRuns: { $avg: "$totalRuns" } } },
        ]).toArray();
        break;

      case "Find players who won both 'Best Batsman' and 'Man of the Match.'":
        result = await Players.find({
          awards: { $all: ["Best Batsman", "Man of the Match"] },
        }).toArray();
        break;

      case "Show matches that ended in a tie.":
        result = await Matches.find({ result: "Tie" }).toArray();
        break;

      case "Retrieve players who contributed in both batting and bowling.":
        result = await Players.find({
          runs: { $gt: 0 },
          wickets: { $gt: 0 },
        }).toArray();
        break;

      case "Find the team with the highest number of catches.":
        result = await Teams.find().sort({ catches: -1 }).limit(1).toArray();
        break;

      case "Identify semifinal and final match winners.":
        result = await Matches.aggregate([
          { $match: { round: { $in: ["Semifinal", "Final"] } } },
          {
            $lookup: {
              from: "teams",
              localField: "winner",
              foreignField: "_id",
              as: "winnerDetails"
            }
          },
          { $unwind: "$winnerDetails" },
          { $project: { round: 1, winner: "$winnerDetails.name" } }
        ]).toArray();
        break;

      case "List teams that did not qualify for knockouts.":
        result = await Teams.find({ wins: { $lt: 3 } }).toArray();
        break;

      default:
        result = [{ message: "Query not implemented!" }];
    }

    res.json({ result });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Start Server
app.listen(5000, () => console.log("🚀 Server running on port 5000"));