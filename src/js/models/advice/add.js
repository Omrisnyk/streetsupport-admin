const ko = require('knockout')

const ajax = require('../../ajax')
const auth = require('../../auth')
const browser = require('../../browser')
const endpoints = require('../../api-endpoints')

const BaseViewModel = require('../BaseViewModel')

const Model = function () {
  const self = this

  self.itemCreated = ko.observable(false)
  self.title = ko.observable()
  self.body = ko.observable()
  self.tags = ko.observable('')
  self.sortPosition = ko.observable()
  self.locationKey = ko.observable()
  self.locations = ko.observableArray()

  self.save = function () {
    browser.loading()
    const payload = {
      title: self.title(),
      body: self.body(),
      tags: self.tags().length
        ? self.tags().split(',').map((t) => t.trim())
        : [],
      locationKey: self.locationKey(),
      sortPosition: self.sortPosition()
    }
    ajax
      .post(endpoints.faqs, payload)
      .then((result) => {
        if (result.statusCode === 201) {
          self.itemCreated(true)
        } else {
          self.handleError(result)
        }
        browser.loaded()
      }, (err) => {
        self.handleError(err)
      })
  }

  self.init = function () {
    self.locations(auth.getLocationsForUser([{ id: 'general', name: 'General Advice' }]))
  }
}

Model.prototype = new BaseViewModel()

module.exports = Model
