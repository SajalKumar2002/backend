const Job = require("../SQLmodel/job.model");

const displayJobDetails = async (req, res) => {
    try {
        const job_details = await Job.findAll({ where: { userid: req.user.id } });
        // const job_details = await Job.findAll();
        res.status(201).send({ success: true, job_details })
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
    return  charResult;
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
        res.send({ success: true, job: newJob })
    } catch (error) {
        console.error(error);
        res.send({ success: false, message: "Service Error", error })
    }
}

module.exports = {
    displayJobDetails,
    generateJob
};