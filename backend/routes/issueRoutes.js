const express =require("express");
const  { createIssue, deleteIssueById, getAllIssues, getIssueById, updateIssueById } =require( "../controllers/issueController")
const router = express.Router();
router.post("/", createIssue);
router.get("/", getAllIssues);
router.get("/:id",  getIssueById);
router.put(  "/:id",  updateIssueById);
router.delete(  "/:id",  deleteIssueById);

module.exports = router;
