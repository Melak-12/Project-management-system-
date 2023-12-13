const  Issue =require( "../models/issueModel")


 const createIssue = async (req, res) => {
    try {
        const { assignedTo, description, status, priority } =
            req.body;

        const newIssue = new Issue({
            assignedTo,
            description,
            status,
            priority,
        });

        const savedIssue = await newIssue.save();
        res.status(201).json(savedIssue);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}

 const getAllIssues = async (req, res) => {
    try {
        const issues = await Issue.find();
        res.status(200).json(issues);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}

 const getIssueById = async (req, res) => {
    try {
        const { id } = req.params;
        const issue = await Issue.findById(id);

        if (!issue) {
            return res.status(404).json({ error: "Tracking issue not found" });
        }

        res.status(200).json(issue);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}

 const updateIssueById = async (req, res) => {
    try {
        const { id } = req.params;
        const { assignedTo, description, status, priority } =
            req.body;
        const updatedIssue = await Issue.findByIdAndUpdate(
            id,
            { assignedTo, description, status, priority },
            { new: true }
        );

        if (!updatedIssue) {
            return res.status(404).json({ error: "Tracking issue not found" });
        }

        res.status(200).json(updatedIssue);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}

// Delete by id
 const deleteIssueById = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedIssue = await Issue.findByIdAndDelete(id);

        if (!deletedIssue) {
            return res.status(404).json({ error: "Tracking issue not found" });
        }

        res.status(204).json();
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }

};

module.exports ={
    createIssue,
    getAllIssues,
    updateIssueById,
    deleteIssueById,
    getIssueById,
};