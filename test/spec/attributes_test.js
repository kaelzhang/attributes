describe("attributes", function(){
    describe("attributes.my_method()", function(){
        it("should return 1", function(done){
            _use('attributes@latest', function(exports) {
                expect('my_method' in exports);
                done();
            });
        });
    });
});