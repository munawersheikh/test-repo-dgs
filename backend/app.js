require('dotenv').config();
const express = require('express');
const sequelize = require('./config/dbConfig');
const organizationRoutes = require('./routes/organizationRoutes');
const userRoutes = require('./routes/userRoutes');
const siteRoutes = require('./routes/siteRoutes');
const nodeRoutes = require('./routes/nodeRoutes');
const userSiteRoutes = require('./routes/userSiteRoutes');
const userNodeRoutes = require('./routes/userNodeRoutes');
const userPreferenceRoutes = require('./routes/userPreferenceRoutes');
const screenRoutes = require('./routes/screenRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const userScreenRoutes = require('./routes/userScreenRoutes');
const userApplicationRoutes = require('./routes/userApplicationRoutes');
const collectionsRoutes = require('./routes/collectionsRoutes');
const chopRoutes = require('./routes/chopRoutes');
const psdRoutes = require('./routes/psdRoutes');

const psd277Data = require("./apiresponses/277_PsdData.json.json");
const psd671Data = require("./apiresponses/671_PsdData.json.json");
const psd295Data = require("./apiresponses/295_SpectralData.json");
const psd117Data = require("./apiresponses/117_PsdData.json");
const psd121Data = require("./apiresponses/121_PsdData.json");
const psd125Data = require("./apiresponses/125_PsdData.json");
const psd415Data = require("./apiresponses/415_PsdData.json");
const psd_415_1_min_Data = require("./apiresponses/415_1_min_PsdData.json");
const psd_415_3_min_Data = require("./apiresponses/415_3_mins_PsdData.json");
const psd417Data = require("./apiresponses/417_PsdData.json");
const psd_417_1_min_Data = require("./apiresponses/417_1_min_PsdData.json");
const psd_417_3_min_Data = require("./apiresponses/417_3_mins_PsdData.json");
const checking = require("./apiresponses/checking.json");
const collectionListing = require("./apiresponses/newProdCollectionListing.json");

const cors = require('cors'); // Import the cors package

const app = express();
const corsOptions = {
    origin: ['http://localhost:3001', 'http://localhost:8081','http://localhost:3000'], // Replace with your allowed origins
    optionsSuccessStatus: 200 // Some legacy browsers choke on 204
};
app.use(cors(corsOptions));
app.use(express.json());

app.use('/organizations', organizationRoutes);
app.use('/users', userRoutes);
app.use('/sites', siteRoutes);
app.use('/nodes', nodeRoutes);
app.use('/user-sites', userSiteRoutes);
app.use('/user-nodes', userNodeRoutes);
app.use('/user-preferences', userPreferenceRoutes);
app.use('/screens', screenRoutes);
app.use('/applications', applicationRoutes);
app.use('/user-screens', userScreenRoutes);
app.use('/user-applications', userApplicationRoutes);
app.use( collectionsRoutes);
app.use( chopRoutes);
app.use( psdRoutes);


const PORT = process.env.PORT || 3000;

sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch(err => {
    console.error('Unable to connect to the database:', err);
});
