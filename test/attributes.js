'use strict';

var expect = require('chai').expect;
var attributes = require('../');

var util = require('util');

describe("instance methods", function(){
    describe("ins.get(key)", function(){
        function A(){}

        attributes.patch(A, {
            a: {
            },

            b: {
                value: 1
            },

            c: {
                value: 1,
                getter: function (v) {
                    return v + 1;
                }
            }
        });

        it("default to undefined", function(){
            var a = new A;

            expect(a.get('a')).to.equal(undefined);
        });

        it("no getter", function(){
            var a = new A;
            expect(a.get('b')).to.equal(1);
        });

        it("getter", function(){
            var a = new A;
            expect(a.get('c')).to.equal(2);
        });
    });

    describe("ins.set(key, value)", function(){
        function A(){}

        attributes.patch(A, {
            a: {
            },

            b: {
                value: 1,
                setter: function (v) {
                    return v + 1;
                }
            },

            c: {
                validator: function (v) {
                    return typeof v === 'string';
                }
            }
        });

        it("normal case", function(){
            var a = new A;
            expect(a.set('a', 1)).to.equal(true);
            expect(a.get('a')).to.equal(1);
        });

        it("setter function", function(){
            var a = new A;
            expect(a.set('b', 1)).to.equal(true);
            expect(a.get('b')).to.equal(2);
        });

        it("validator", function(){
            var a = new A;
            expect(a.set('c', 1)).to.equal(false);
            expect(a.get('c')).to.equal(undefined);
        });
    });

    describe("ins.set(key_map)", function(){
        function A(){}

        attributes.patch(A, {
            a: {
            },

            b: {
                value: 1,
                setter: function (v) {
                    return v + 1;
                }
            },

            c: {
                validator: function (v) {
                    return typeof v === 'string';
                }
            }
        });

        it("batch setter, success", function(){
            var a = new A;
            expect(a.set({
                a: 1,
                b: 2
            })).to.equal(true);
            expect(a.get('a')).to.equal(1);
            expect(a.get('b')).to.equal(3);
        });

        it("batch setter, failure", function(){
            var a = new A;
            expect(a.set({
                c: 1,
                b: 2
            })).to.equal(false);
            expect(a.get('c')).to.equal(undefined);

            // should not skip
            expect(a.get('b')).to.equal(3);
        });
    });
});

describe("attr.patch()", function(){
    it("normal cases", function(){
        
    });

    it("chould inherit from superClass", function(){
        function A(){}

        attributes.patch(A, {
            a: {
            },

            b: {
                value: 1,
                setter: function (v) {
                    return v + 1;
                }
            },

            c: {
                validator: function (v) {
                    return typeof v === 'string';
                }
            }
        });

        function B(){}

        util.inherits(B, A);

        var a = new B;

        expect(a.set({
            c: 1,
            b: 2
        })).to.equal(false);
        expect(a.get('c')).to.equal(undefined);

        // should not skip
        expect(a.get('b')).to.equal(3);
    });
});