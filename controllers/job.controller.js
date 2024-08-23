const Job = require("../SQLmodel/job.model");

const displayJobDetails = async (req, res) => {
    try {
        // const job_details = await Job.findAll({ where: { userid: req.user.id } });
        const job_details = await Job.findAll();
        res.status(201).send(job_details)
    } catch (error) {
        console.error(error);
        res.send({ success: false, message: "Service Error", error })
    }
}

const generateID = (limit) => {
    const characters = 'abcdefghijklmopqrstuvwxyz123456789';
    let charResult = '';
    for (let i = 0; i < limit; i++) {
        charResult += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return charResult;
}

const generateJob = async (req, res) => {
    try {
        let code, codeAlreadyExists;
        do {
            code = generateID(9);
            codeAlreadyExists = await Job.findOne({ where: { id: code } });
        } while (codeAlreadyExists);

        const newJob = await Job.create({
            userid: req.user.id,
            id: code
        })
        res.send({ job: newJob })
    } catch (error) {
        console.error(error);
        res.send({ success: false, message: "Service Error", error })
    }
}

const switchJobStatus = async (req, res) => {
    try {
        const { id } = req.query;
        const job = await Job.findByPk(id);
        job.status = "completed";
        const date = new Date();
        job.completedTime = date.toLocaleDateString('en-GB') + " - " + date.toLocaleTimeString("en-US");
        job.save();
        res.send(job);
    } catch (error) {
        console.error(error);
        res.send({ success: false, message: "Service Error", error })
    }
}

const deleteJob = async (req, res) => {
    try {
        const { id } = req.query;
        await Job.destroy({
            where: {
                id: id
            }
        });
        res.send({ success: true });
    } catch (error) {
        console.error(error);
        res.send({ success: false, message: "Service Error", error })
    }
}

module.exports = {
    displayJobDetails,
    generateJob,
    switchJobStatus,
    deleteJob
};