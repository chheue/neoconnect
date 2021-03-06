require("rootpath")();
require('dotenv').config();
const swaggerDocument =  require('./swagger/swagger.json'),
        swaggerUi =  require('swagger-ui-express'),
        express = require("express"),
        path = require('path'),
        bodyParser = require("body-parser"),
        cors = require("cors"),
        app = express(),
        db = require("./_helpers/db"),
        port = process.env.PORT || 8080,
        utils = require('./utils/createUser'),
        basicAuth = require('basic-auth');


//create and check db is create
db.sequelize.sync({force: false}).then(() => {
    console.log("DB Create");
});

//Middleware
let auth = function (req, res, next) {
    let user = basicAuth(req);
    if (!user || !user.name || !user.pass) {
        res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
        res.sendStatus(401);
    }
    if (user.name === 'amy' && user.pass === 'passwd123') {
        next();
    } else {
        res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
        res.sendStatus(401);
    }
};

app.all("/swagger/*", auth);
app.use('/image', express.static('image'));
app.use(bodyParser.json({limit: '10mb', extended: true}));
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}));
app.use(cors());


//set admin user
utils.registerTestAccounts().then(res => console.log(res));

console.log(process.env.EMAIL_ADDRESS);
console.log(process.env.EMAIL_PASSWORD);

//Create router
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/", require("./User/user.controller"));
app.use("/", require("./Contact/contact.controller"));
app.use("/", require("./ForgotPassword/forgotPassword.controller"));
app.use("/", require("./IA/ia.controller"));

//Middleware Check token in header
app.use("/", require("./utils/validation").checkToken);

app.use("/", require("./Shop/shop.controller"));
app.use("/", require("./Influencer/influencer.controller"));
app.use("/", require("./Offers/offres.controller"));
app.use("/", require("./CommentMark/commentMark.controller"));
app.use("/", require("./Stat/stat.controller"));
app.use("/", require("./Message/message.controller"));

//Start server
app.listen(port, function() {
    console.log(`Running on port ${port}`);
});