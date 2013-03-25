var metric = require("..")
  , should = require("should");

describe("metric-log", function(){

  var log, str;

  beforeEach(function() {
    log = console.log;
    console.log = function(fmt) {
      str = fmt;
    };
  });

  afterEach(function() {
    console.log = log;
  });

  describe("metric(metric, value)", function(){
    it("should work", function() {
      metric("request", 1);
      str.should.eql("metric=request val=1");
    });

    it('should surround \' \' with "', function() {
      metric("request", "this is a test");
      str.should.eql('metric=request val="this is a test"');
    });

    it('should escape "', function() {
      metric("request", 'this is a "test"');
      str.should.eql('metric=request val="this is a \"test\""');
    });
  });

  describe("metric(metric, value, units)", function(){
    it("should work", function() {
      metric("response_time", 1, "ms");
      str.should.eql("metric=response_time val=1 units=ms");
    });
  });

  describe("metric(obj)", function(){
    it("should work", function() {
      metric({testing: 123, hello: "world"});
      str.should.eql("testing=123 hello=world");
    });
  });

  describe("metric(deepObj)", function(){
    it("should work", function() {
      metric({testing: 123, hello: "world", deep: {test: 456}});
      str.should.eql('testing=123 hello=world deep="{\"test\":456}"');
    });
  });

  describe("context(obj)", function(){

    var context;

    beforeEach(function() {
      context = metric.context({host: "my.host.com"});
    });

    describe("context(metric, value)", function(){
      it("should work", function(){
        context("request", 1);
        str.should.eql("host=my.host.com metric=request val=1");
      });

      it('should surround \' \' with "', function() {
        context("request", "this is a test");
        str.should.eql('host=my.host.com metric=request val="this is a test"');
      });

      it('should escape "', function() {
        context("request", 'this is a "test"');
        str.should.eql('host=my.host.com metric=request val="this is a \"test\""');
      });
    });

    describe("context(metric, value, units)", function(){
      it("should work", function(){
        context("response_time", 1, "ms");
        str.should.eql("host=my.host.com metric=response_time val=1 units=ms");
      });
    });

    describe("metric(obj)", function(){
      it("should work", function() {
        context({testing: 123, hello: "world"});
        str.should.eql("host=my.host.com testing=123 hello=world");
      });
    });

    describe("metric(deepObj)", function(){
      it("should work", function() {
        context({testing: 123, hello: "world", deep: {test: 456}});
        str.should.eql('host=my.host.com testing=123 hello=world deep="{\"test\":456}"');
      });
    });

  });

});