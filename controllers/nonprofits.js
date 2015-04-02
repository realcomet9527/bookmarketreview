var async = require('async'),
    Nonprofit = require('./../models/Nonprofit'),
    resources = require('./resources'),
    secrets = require('./../config/secrets'),
    moment = require('moment'),
    debug = require('debug')('freecc:cntr:resources'),
    R = require('ramda');

exports.nonprofitsHome = function(req, res) {
    res.render('nonprofits/home', {
        title: 'A guide to our Nonprofit Projects'
    });
};

exports.areYouWithARegisteredNonprofit = function(req, res) {
    res.render('nonprofits/are-you-with-a-registered-nonprofit', {
        title: 'Are you with a with a registered nonprofit',
        step: 1
    });
};

exports.areTherePeopleThatAreAlreadyBenefitingFromYourServices = function(req, res) {
    res.render('nonprofits/are-there-people-that-are-already-benefiting-from-your-services', {
        title: 'Are there people already benefiting from your services',
        step: 2
    });
};

exports.okWithJavaScript = function(req, res) {
    res.render('nonprofits/ok-with-javascript', {
        title: 'Are you OK with us using JavaScript',
        step: 3
    });
};

exports.inExchangeWeAsk = function(req, res) {
    res.render('nonprofits/in-exchange-we-ask', {
        title: 'In exchange we ask that you ...',
        step: 4
    });
};

exports.howCanFreeCodeCampHelpYou = function(req, res) {
    res.render('nonprofits/how-can-free-code-camp-help-you', {
        title: 'Are you with a with a registered nonprofit',
        step: 5
    });
};

exports.whatDoesYourNonprofitDo = function(req, res) {
    res.render('nonprofits/what-does-your-nonprofit-do', {
        existingParams: req.params,
        title: 'What does your nonprofit do?',
        step: 6
    });
};

exports.linkUsToYourWebsite = function(req, res) {
    res.render('nonprofits/link-us-to-your-website', {
        title: 'Link us to your website',
        step: 7
    });
};

exports.tellUsYourEmail = function(req, res) {
    res.render('nonprofits/tell-us-your-email', {
        title: 'Tell us your name',
        step: 8
    });
};

exports.tellUsYourName = function(req, res) {
    res.render('nonprofits/tell-us-your-name', {
        title: 'Tell us your name',
        step: 9
    });
};

exports.finishApplication = function(req, res) {

};

exports.yourNonprofitProjectApplicationHasBeenSubmitted = function(req, res) {
    res.render('nonprofits/your-nonprofit-project-application-has-been-submitted', {
        title: 'Your Nonprofit Project application has been submitted!'
    });
};

exports.otherSolutions = function(req, res) {
    res.render('nonprofits/other-solutions', {
        title: 'Here are some other possible solutions for you'
    });
};

exports.returnIndividualNonprofit = function(req, res, next) {
    var dashedName = req.params.nonprofitName;

    var nonprofitName = dashedName.replace(/\-/g, ' ');

    Nonprofit.find({'name': new RegExp(nonprofitName, 'i')}, function(err, nonprofit) {
        if (err) {
            next(err);
        }

        if (nonprofit.length < 1) {
            req.flash('errors', {
                msg: "404: We couldn't find a nonprofit with that name. Please double check the name."
            });

            return res.redirect('/nonprofits');
        }

        nonprofit = nonprofit.pop();
        var dashedNameFull = nonprofit.name.toLowerCase().replace(/\s/g, '-');
        if (dashedNameFull != dashedName) {
            return res.redirect('../nonprofit/' + dashedNameFull);
        }
        res.render('nonprofits/show', {
            dashedName: dashedNameFull,
            title: nonprofit.name,
            logoUrl: nonprofit.logoUrl,
            estimatedHours: nonprofit.estimatedHours,
            projectDescription: nonprofit.projectDescription,
            approvedOther: nonprofit.approvedDeliverables.indexOf('other') > -1,
            approvedWebsite: nonprofit.approvedDeliverables.indexOf('website') > -1,
            approvedDonor: nonprofit.approvedDeliverables.indexOf('donor') > -1,
            approvedInventory: nonprofit.approvedDeliverables.indexOf('inventory') > -1,
            approvedVolunteer: nonprofit.approvedDeliverables.indexOf('volunteer') > -1,
            approvedForm: nonprofit.approvedDeliverables.indexOf('form') > -1,
            approvedCommunity: nonprofit.approvedDeliverables.indexOf('community') > -1,
            approvedELearning: nonprofit.approvedDeliverables.indexOf('eLearning') > -1,
            websiteLink: nonprofit.websiteLink,
            imageUrl: nonprofit.imageUrl,
            whatDoesNonprofitDo: nonprofit.whatDoesNonprofitDo,
            interestedCampers: nonprofit.interestedCampers
        });
    });
};

exports.showAllNonprofits = function(req, res) {
    var data = {};
    data.nonprofitsList = resources.allNonprofitNames();
    res.send(data);
};

exports.interestedInNonprofit = function(req, res) {

  if (req.user.uncompletedBonfires !== [] && req.user.uncompletedCoursewares !== []) {
    Nonprofit.find({name: req.params.nonprofitName.replace(/-/, ' ')}, function(err, nonprofit) {
      if (err) { return next(err); }
      nonprofit.interestedCampers.push({"name": req.user.username, "picture": req.user.picture, "timeOfInterest": Date.now()});
      req.flash('success', { msg: 'Thanks for expressing interest in this nonprofit project!' });
    });
  }
  res.redirect('back');
};
