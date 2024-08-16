const { createConnection, sequelize } = require('./config/SQLconnection.js');
const bcrypt = require('bcrypt');

const JOB = require('./SQLmodel/job.model.js')
const USER = require('./SQLmodel/user.model.js')
const MODEL = require('./SQLmodel/model.model.js')

const importData = async () => {
    try {
        createConnection()

        await JOB.drop();
        await MODEL.drop();
        await USER.drop();
        console.log('All tables dropped!');

        await sequelize.sync({ force: true });
        console.log('All models were synchronized successfully.');

        const hash = await bcrypt.hash("password", 10)
        const createdUsers = await USER.create(
            {
                email: "admin@gmail.com",
                password: hash
            }
        );

        const models = [
            {
                model_name: "Arion_gemini",
                base_model: "gemini"
            },
            {
                model_name: "Arion_llama2",
                base_model: "llama2"
            }
        ]

        const sampleModel = models.map((model) => {
            return { ...model, userid: createdUsers.id };
        });
        await MODEL.bulkCreate(sampleModel);

        console.log("Data Imported");
        process.exit();
    } catch (error) {
        console.error(`${error.message}`);
        process.exit(1);
    }
}

const destroyData = async () => {
    try {
        createConnection()

        await JOB.drop();
        await USER.drop();
        await MODEL.drop();
        console.log('All tables dropped!');

        process.exit();
    } catch (error) {
        console.log(error.message);
        process.exit(1);
    }
}

if (process.argv[2] === "-d") {
    destroyData();
} else {
    importData();
}