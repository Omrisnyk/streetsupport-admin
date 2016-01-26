var ko = require('knockout')
var ajax = require('basic-ajax')
var Endpoints = require('../endpoint-builder')
var adminUrls = require('../admin-urls')
var cookies = require('../cookies')
var browser = require('../browser')

function AddServiceProvider () {
  var self = this

  self.endpoints = new Endpoints()

  self.name = ko.observable('')
  self.errors = ko.observableArray()
  self.hasErrors = ko.computed(function () {
    return self.errors().length > 0
  }, self)

  self.save = function () {
    var endpoint = self.endpoints.serviceProviders().build()
    var headers = {
      'content-type': 'application/json',
      'session-token': cookies.get('session-token')
    }
    var payload = {
      'Name': self.name()
    }
    ajax
      .post(endpoint, headers, JSON.stringify(payload))
      .then(function (result) {
        browser.redirect(adminUrls.dashboard)
      }, function (error) {
        console.log(error)
        self.errors(JSON.parse(error.response).messages)
        console.log(self.hasErrors())
      })
  }
}

module.exports = AddServiceProvider
