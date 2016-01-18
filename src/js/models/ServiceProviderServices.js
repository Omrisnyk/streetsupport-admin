var ajax = require('basic-ajax')
var Endpoints = require('../endpoint-builder')
var adminUrls = require('../admin-urls')
var cookies = require('../cookies')
var Address = require('./Address')
var Service = require('./Service')
var getUrlParameter = require('../get-url-parameter')
var ko = require('knockout')
var _ = require('lodash')
var guid = require('node-uuid')

function ServiceProvider (data) {
  var self = this

  self.key = ko.observable(data.key)
  self.name = ko.observable(data.name)
  self.addresses = ko.observableArray(_.map(data.addresses, function (address) {
    return new Address(address)
  }))
  console.log(data.services)
  self.services = ko.observableArray(_.map(data.providedServices, function (service) {
    return new Service(service)
  }))

  // self.addAddress = function () {
  //   var tempKey = guid.v4()

  //   var addresses = self.addresses()
  //   var newAddress = new Address({
  //     'openingTimes': [],
  //     'tempKey': tempKey
  //   })
  //   newAddress.addListener(self)
  //   newAddress.edit()
  //   addresses.push(newAddress)
  //   self.addresses(addresses)
  // }

  // self.cancelAddress = function (cancelledAddress) {
  //   var remainingAddresses = _.filter(self.addresses(), function (address) {
  //     var isNew = address.tempKey() === undefined

  //     if (isNew) return true

  //     var isNotTheAddressWeAreLookingFor = address.tempKey() !== cancelledAddress.tempKey()

  //     return isNotTheAddressWeAreLookingFor
  //   })
  //   self.addresses(remainingAddresses)
  // }

  // self.deleteAddress = function (deleteAddress) {
  //   var remainingAddresses = _.filter(self.addresses(), function (address) {
  //     return address.key() !== deleteAddress.key()
  //   })
  //   self.addresses(remainingAddresses)
  // }
}

function ServiceProviderServices () {
  var self = this
  self.serviceProvider = ko.observable()
  self.endpoints = new Endpoints()

  self.init = function () {
    var endpoint = self.endpoints.serviceProviders(getUrlParameter.parameter('key')).build()
    ajax.get(endpoint,
      {
        'content-type': 'application/json',
        'session-token': cookies.get('session-token')
      },
      {})
      .then(function (result) {
        self.serviceProvider(new ServiceProvider(result.json))
      },
      function (error) {
      })
  }

  self.init()
}

module.exports = ServiceProviderServices
