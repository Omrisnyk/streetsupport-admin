/*
global describe, beforeEach, afterEach, it, expect
*/

'use strict'

const sinon = require('sinon')
const jsRoot = '../../../../src/js/'
const ajax = require(`${jsRoot}ajax`)
const endpoints = require(`${jsRoot}api-endpoints`)
const browser = require(`${jsRoot}browser`)
const cookies = require(`${jsRoot}cookies`)
const querystring = require(`${jsRoot}get-url-parameter`)
const validation = require(`${jsRoot}validation`)

const testData = require('../testData')

describe('Temporary Accommodation - Edit Contact Information - invalid email set', () => {
  const Model = require(`${jsRoot}models/temporary-accommodation/edit`)
  const headers = {
    'content-type': 'application/json',
    'session-token': 'stored-session-token'
  }
  let sut = null
  let validationStub = null
  let ajaxPatchStub = null

  beforeEach(() => {
    sinon.stub(browser, 'loading')
    sinon.stub(browser, 'loaded')
    sinon.stub(ajax, 'get')
      .withArgs(`${endpoints.temporaryAccommodation}/${testData.id}`, headers)
      .returns({
        then: function (success, error) {
          success({
            'statusCode': 200,
            'data': testData
          })
        }
      })
    validationStub = sinon.stub(validation, 'showErrors')

    sinon.stub(cookies, 'get')
      .withArgs('session-token')
      .returns('stored-session-token')

    sinon.stub(querystring, 'parameter')
      .withArgs('id')
      .returns(testData.id)

    sut = new Model()
    sut.init()

    ajaxPatchStub = sinon.stub(ajax, 'patch')

    sut.contactDetails().edit()

    sut.contactDetails().formFields().name('new name')
    sut.contactDetails().formFields().additionalInfo('new additional info')
    sut.contactDetails().formFields().email('invalid email')
    sut.contactDetails().formFields().telephone('new telephone')

    sut.contactDetails().save()
  })

  afterEach(() => {
    browser.loading.restore()
    browser.loaded.restore()
    ajax.get.restore()
    cookies.get.restore()
    querystring.parameter.restore()
    validation.showErrors.restore()
    ajax.patch.restore()
  })

  it('- should not patch new data', () => {
    expect(ajaxPatchStub.called).toBeFalsy()
  })

  it('- should show errors', () => {
    expect(validationStub.calledOnce).toBeTruthy()
  })
})
