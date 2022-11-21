const helpers = require("./helpers");

describe("helpers", () => {

    it('createId', () => {
        const id = helpers.createId();
        expect(id).toBeDefined();
    });

});
