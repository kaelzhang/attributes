'use strict';

var expect = require('chai').expect;
var attributes = require('../');

var util = require('util');


describe("presets", function(){
    it('will unlink the attributes of a instance with the presets', function(){
        function A(options){
            this.set(options);
        }

        attributes.patch(A, {
                a: {
                    value: 1
                },
                
                b: {
                    value: 2
                }
            });
        
        var ins = new A({a: 5}),
            ins2;
            
        expect(ins.get('a')).to.equal(5);
        
        ins.set('a', 10);
        ins2 = new A();
        
        expect(ins2.get('a')).to.equal(1);
    });
});

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

    describe("ins.get()", function(){
        it("could get the shadow copy of all attribute values", function(){
            function A(){}

            attributes.patch(A, {
                a: {
                    value: 1
                },
                
                b: {
                    value: 2
                },
                
                c: {
                    value: 3
                }
            });
                
            var obj = new A(),
                attrs = obj.get();
        
            expect(attrs.a).to.equal(1);
            expect(attrs.b).to.equal(2);
            expect(attrs.c).to.equal(3);
            
            attrs.c = 5;
            expect(obj.get('c')).to.equal(3);
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

        it('could specify a setter(instance method as a setter)', function(){
            function A(){}

            A.prototype._setA = function(n){
                    this.b = n * 10;
                }

            attributes.patch(A, {
                a: {
                    setter: '_setA'
                }
            });
            
            var my = new A();
            
            expect(my.get('a')).to.equal(undefined);
            expect(my.b).to.equal(undefined);
            expect(my.set('a', 2)).to.equal(true);
            expect(my.get('a')).to.equal(undefined);
            expect(my.b).to.equal(20);
        });
    });

    describe(".addAttr()", function(){
        function A(){}

        attributes.patch(A, {});
            
        var attr = {
                a: {
                    value: 1
                }
            };

        var obj = new A();
        obj.addAttr(attr);
        
        it("could add a new attribute", function(){
            expect(obj.get('a')).to.equal(1);
        });
    
        it("would not ruin the reference of attr object", function(){
            obj.set('a', 123);
        
            expect(attr.a.value).to.equal(1);
        });
    });


     describe(".removeAttr(key)", function(){
        function A(){}

        attributes.patch(A, {
            a: {
                value: 1
            }
        });
            
        var obj = new A();
            
        obj.removeAttr('a');
            
        it("could remove attr by a specified key", function(){
            expect(obj.get('a')).to.equal(undefined);
        });
    });
});


describe("controllers", function(){
    function myClass (options) {
        this.set(options);
    }

    attributes.patch(myClass, {
        a: {
            value: 1,
            readOnly: true
        },
        
        b: {
            value: 1,
            writeOnce: true
        }
    });
        
    var my = new myClass({b: 2});


    it('controller: readOnly', function(){
        expect(my.get('a')).to.equal(1);
        
        expect(my.set('a', 3)).to.equal(false);
        
        expect(my.get('a')).to.equal(1);
    });
        
    it('controller: writeOnce', function(){
        expect(my.get('b')).to.equal(2);

        my.set('b', 3);
        // expect(my.set('b', 3)).to.equal(false);
        
        expect(my.get('b')).to.equal(2);
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