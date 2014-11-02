/**
 * Module dependencies.
 */

var express = require('express');
var cookieParser = require('cookie-parser');
var compress = require('compression');
var session = require('express-session');
var bodyParser = require('body-parser');
var logger = require('morgan');
var errorHandler = require('errorhandler');
var csrf = require('lusca').csrf();
var methodOverride = require('method-override');

var _ = require('lodash');
var MongoStore = require('connect-mongo')({ session: session });
var flash = require('express-flash');
var path = require('path');
var mongoose = require('mongoose');
var passport = require('passport');
var expressValidator = require('express-validator');
var connectAssets = require('connect-assets');

/**
 * Controllers (route handlers).
 */

var homeController = require('./controllers/home');
var challengesController = require('./controllers/challenges')
var userController = require('./controllers/user');
var apiController = require('./controllers/api');
var contactController = require('./controllers/contact');

/**
 * API keys and Passport configuration.
 */

var secrets = require('./config/secrets');
var passportConf = require('./config/passport');

/**
 * Create Express server.
 */

var app = express();

/**
 * Connect to MongoDB.
 */

mongoose.connect(secrets.db);
mongoose.connection.on('error', function() {
    console.error('MongoDB Connection Error. Make sure MongoDB is running.');
});

var hour = 3600000;
var day = hour * 24;
var week = day * 7;

/**
 * CSRF whitelist.
 */

var csrfExclude = ['/url1', '/url2'];

/**
 * Express configuration.
 */

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(compress());
app.use(connectAssets({
    paths: [path.join(__dirname, 'public/css'), path.join(__dirname, 'public/js')],
    helperContext: app.locals
}));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(methodOverride());
app.use(cookieParser());
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: secrets.sessionSecret,
    store: new MongoStore({
        url: secrets.db,
        auto_reconnect: true
    })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(function(req, res, next) {
    // CSRF protection.
    if (_.contains(csrfExclude, req.path)) return next();
    csrf(req, res, next);
});
app.use(function(req, res, next) {
    // Make user object available in templates.
    res.locals.user = req.user;
    next();
});
app.use(function(req, res, next) {
    // Remember original destination before login.
    var path = req.path.split('/')[1];
    if (/auth|login|logout|signup|fonts|favicon/i.test(path)) {
        return next();
    }
    req.session.returnTo = req.path;
    next();
});
app.use(express.static(path.join(__dirname, 'public'), { maxAge: week }));

/**
 * Main routes.
 */

app.get('/', homeController.index);
app.get('/challenges/a-one-minute-introduction-to-free-code-camp', challengesController.aOneMinuteIntroToFreeCodeCamp);
app.get('/challenges/enter-the-free-code-camp-chat-room', challengesController.enterTheFreeCodeCampChatRoom);
app.get('/challenges/create-and-deploy-a-website', challengesController.createAndDeployAWebsite);
app.get('/challenges/install-github-atom-text-editor', challengesController.installGithubAtomTextEditor);
app.get('/challenges/modify-and-redeploy-your-website', challengesController.modifyAndRedeployYourWebsite);
app.get('/challenges/start-a-pair-programming-session', challengesController.startAPairProgrammingSession);
app.get('/challenges/add-dynamic-content-to-your-website', challengesController.addDynamicContentToYourWebsite);
app.get('/challenges/codecademy-html-and-css-track', challengesController.codecademyHtmlAndCssTrack)
app.get('/challenges/experiment-with-html-and-css-in-codepen', challengesController.experimentWithHtmlAndCssInCodepen)
app.get('/challenges/code-school-try-jquery-course', challengesController.codeSchoolTryJqueryCourse)
app.get('/challenges/complete-jquery-exercises', challengesController.completeJqueryExercises);
app.get('/challenges/code-school-discover-devtools-course', challengesController.codeSchoolDiscoverDevtoolsCourse)
app.get('/challenges/customize-bootstrap-with-bootswatch', challengesController.customizeBootstrapWithBootswatch);
app.get('/challenges/inject-life-with-css-transformations', challengesController.injectLifeWithCssTransformations);
app.get('/challenges/codecademy-javascript-track', challengesController.codecademyJavascriptTrack)
app.get('/challenges/get-help-the-hacker-way-with-rsap', challengesController.getHelpTheHackerWayWithRsap);
app.get('/challenges/easy-algorthim-scripting-challenges-on-coderbyte', challengesController.easyAlgorithmScriptingChallengesOnCoderbyte);
app.get('/challenges/harvard-introduction-to-computer-science-cs50-course', challengesController.harvardIntroductionToComputerScienceCs50Course)
app.get('/challenges/medium-algorthim-scripting-challenges-on-coderbyte', challengesController.mediumAlgorithmScriptingChallengesOnCoderbyte);
app.get('/challenges/stanfords-relational-databases-mini-course', challengesController.stanfordsRelationalDatabasesMiniCourse);
app.get('/challenges/stanfords-json-mini-course', challengesController.stanfordsJsonMiniCourse);
app.get('/challenges/build-a-text-based-adventure', challengesController.buildATextBasedAdventure);
app.get('/challenges/hard-algorthim-scripting-challenges-on-coderbyte', challengesController.hardAlgorithmScriptingChallengesOnCoderbyte);
app.get('/challenges/stanfords-sql-mini-course', challengesController.stanfordsSqlMiniCourse);
app.get('/challenges/build-an-interview-question-machine', challengesController.buildAnInterviewQuestionMachine);
app.get('/challenges/code-school-try-git-course', challengesController.codeSchoolTryGitCourse)
app.get('/challenges/install-node-js', challengesController.installNodeJs);
app.get('/challenges/clone-a-github-repo', challengesController.cloneAGithubRepo);
app.get('/challenges/deploy-an-app-to-heroku', challengesController.deployAnAppToHeroku);
app.get('/challenges/code-school-real-time-with-node-js-course', challengesController.codeSchoolRealTimeWithNodeJsCourse)
app.get('/challenges/try-mongodb', challengesController.tryMongoDb);
app.get('/challenges/explore-your-network-with-the-linkedin-api', challengesController.exploreYourNetworkWithTheLinkedInApi);
app.get('/challenges/build-your-first-api', challengesController.buildYourFirstApi);
app.get('/challenges/aggregate-data-with-chron-jobs-and-screen-scraping', challengesController.aggregateDataWithChronJobsAndScreenScraping);
app.get('/challenges/code-school-shaping-up-with-angular-js-course', challengesController.codeSchoolShapingUpWithAngularJsCourse);
app.get('/challenges/reverse-engineer-snapchat', challengesController.reverseEngineerSnapchat);
app.get('/challenges/reverse-engineer-reddit', challengesController.reverseEngineerReddit);
app.get('/challenges/reverse-engineer-pintrest', challengesController.reverseEngineerPintrest);
app.get('/challenges/help-a-nonprofit-team-project', challengesController.helpANonprofitTeamProject);
app.get('/challenges/help-a-nonprofit-solo-project', challengesController.helpANonprofitSoloProject);
app.get('/challenges/crack-the-coding-interview', challengesController.crackTheCodingInterview);
app.get('/login', userController.getLogin);
app.post('/login', userController.postLogin);
app.get('/logout', userController.logout);
app.get('/forgot', userController.getForgot);
app.post('/forgot', userController.postForgot);
app.get('/reset/:token', userController.getReset);
app.post('/reset/:token', userController.postReset);
app.get('/signup', userController.getSignup);
app.post('/signup', userController.postSignup);
app.get('/nonprofits', contactController.getContact);
app.post('/nonprofits', contactController.postContact);
app.get('/account', passportConf.isAuthenticated, userController.getAccount);
app.post('/account/profile', passportConf.isAuthenticated, userController.postUpdateProfile);
app.post('/account/password', passportConf.isAuthenticated, userController.postUpdatePassword);
app.post('/account/delete', passportConf.isAuthenticated, userController.postDeleteAccount);
app.get('/account/unlink/:provider', passportConf.isAuthenticated, userController.getOauthUnlink);
/**
 * API examples routes.
 */

app.get('/api', apiController.getApi);
app.get('/api/lastfm', apiController.getLastfm);
app.get('/api/nyt', apiController.getNewYorkTimes);
app.get('/api/aviary', apiController.getAviary);
app.get('/api/steam', apiController.getSteam);
app.get('/api/stripe', apiController.getStripe);
app.post('/api/stripe', apiController.postStripe);
app.get('/api/scraping', apiController.getScraping);
app.get('/api/twilio', apiController.getTwilio);
app.post('/api/twilio', apiController.postTwilio);
app.get('/api/clockwork', apiController.getClockwork);
app.post('/api/clockwork', apiController.postClockwork);
app.get('/api/foursquare', passportConf.isAuthenticated, passportConf.isAuthorized, apiController.getFoursquare);
app.get('/api/tumblr', passportConf.isAuthenticated, passportConf.isAuthorized, apiController.getTumblr);
app.get('/api/facebook', passportConf.isAuthenticated, passportConf.isAuthorized, apiController.getFacebook);
app.get('/api/github', passportConf.isAuthenticated, passportConf.isAuthorized, apiController.getGithub);
app.get('/api/twitter', passportConf.isAuthenticated, passportConf.isAuthorized, apiController.getTwitter);
app.post('/api/twitter', passportConf.isAuthenticated, passportConf.isAuthorized, apiController.postTwitter);
app.get('/api/venmo', passportConf.isAuthenticated, passportConf.isAuthorized, apiController.getVenmo);
app.post('/api/venmo', passportConf.isAuthenticated, passportConf.isAuthorized, apiController.postVenmo);
app.get('/api/linkedin', passportConf.isAuthenticated, passportConf.isAuthorized, apiController.getLinkedin);
app.get('/api/instagram', passportConf.isAuthenticated, passportConf.isAuthorized, apiController.getInstagram);
app.get('/api/yahoo', apiController.getYahoo);

/**
 * OAuth sign-in routes.
 */

app.get('/auth/instagram', passport.authenticate('instagram'));
app.get('/auth/instagram/callback', passport.authenticate('instagram', { successRedirect: '/challenges/a-one-minute-introduction-to-free-code-camp',failureRedirect: '/login' }), function(req, res) {
    res.redirect(req.session.returnTo || '/');
});
app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email', 'user_location'] }));
app.get('/auth/facebook/callback', passport.authenticate('facebook', { successRedirect: '/challenges/a-one-minute-introduction-to-free-code-camp',failureRedirect: '/login' }), function(req, res) {
    res.redirect(req.session.returnTo || '/');
});
app.get('/auth/github', passport.authenticate('github'));
app.get('/auth/github/callback', passport.authenticate('github', { successRedirect: '/challenges/a-one-minute-introduction-to-free-code-camp',failureRedirect: '/login' }), function(req, res) {
    res.redirect(req.session.returnTo || '/');
});
app.get('/auth/google', passport.authenticate('google', { scope: 'profile email' }));
app.get('/auth/google/callback', passport.authenticate('google', { successRedirect: '/challenges/a-one-minute-introduction-to-free-code-camp',failureRedirect: '/login' }), function(req, res) {
    res.redirect(req.session.returnTo || '/');
});
app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/twitter/callback', passport.authenticate('twitter', { successRedirect: '/challenges/a-one-minute-introduction-to-free-code-camp',failureRedirect: '/login' }), function(req, res) {
    res.redirect(req.session.returnTo || '/');
});
app.get('/auth/linkedin', passport.authenticate('linkedin', { state: 'SOME STATE' }));
app.get('/auth/linkedin/callback', passport.authenticate('linkedin', { successRedirect: '/challenges/a-one-minute-introduction-to-free-code-camp',failureRedirect: '/login' }), function(req, res) {
    res.redirect(req.session.returnTo || '/');
});

/**
 * OAuth authorization routes for API examples.
 */

app.get('/auth/foursquare', passport.authorize('foursquare'));
app.get('/auth/foursquare/callback', passport.authorize('foursquare', { failureRedirect: '/api' }), function(req, res) {
    res.redirect('/api/foursquare');
});
app.get('/auth/tumblr', passport.authorize('tumblr'));
app.get('/auth/tumblr/callback', passport.authorize('tumblr', { failureRedirect: '/api' }), function(req, res) {
    res.redirect('/api/tumblr');
});
app.get('/auth/venmo', passport.authorize('venmo', { scope: 'make_payments access_profile access_balance access_email access_phone' }));
app.get('/auth/venmo/callback', passport.authorize('venmo', { failureRedirect: '/api' }), function(req, res) {
    res.redirect('/api/venmo');
});

/**
 * 500 Error Handler.
 */

app.use(errorHandler());

/**
 * Start Express server.
 */

app.listen(app.get('port'), function() {
    console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
});

module.exports = app;