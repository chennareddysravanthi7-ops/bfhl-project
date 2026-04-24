// controllers/bfhlController.js

const { validateAndProcessData } = require('../utils/validation');
const { processHierarchies, getSummary } = require('../utils/treeLogic');

const handleBfhl = (req, res) => {
  console.log("Handling BFHL request", req.body);
  try {
    const { data } = req.body;
    if (!Array.isArray(data)) {
      return res.status(400).json({ error: "data must be an array" });
    }

    const { graph, parents_full, parents, invalid_entries, duplicate_edges } = validateAndProcessData(data);

    const hierarchies = processHierarchies(graph, parents_full, parents);

    const summary = getSummary(hierarchies);

    res.json({
      user_id: "john_doe_17091999",
      email_id: "john@xyz.com",
      college_roll_number: "ABCD123",
      hierarchies,
      invalid_entries,
      duplicate_edges,
      summary
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { handleBfhl };