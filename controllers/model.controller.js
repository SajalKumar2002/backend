const LLMModel = require("../SQLmodel/model.model")

const displayModel = async (req, res) => {
    try {
        const models = await LLMModel.findAll();
        res.send(models);
    } catch (error) {
        console.error(error);
        res.send({ success: false, message: "Service Error", error })
    }
}

const addModel = async (req, res) => {
    try {
        const models = await LLMModel.findOne({ where: { model_name: req.body.model_name } });
        if (models) {
            res.status(409).send({ success: false, message: "Model with same name exists" })
        } else {
            await LLMModel.create(req.body);
            res.status(201).send({ mesage: "Successfully created" })
        }
    } catch (error) {
        console.error(error);
        res.send({ success: false, message: "Service Error", error })
    }
}

module.exports = {
    displayModel,
    addModel
}