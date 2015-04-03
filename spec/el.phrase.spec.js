var Log = require("log");
var log = new Log(process.env.loglevel || "error");

var _ = require("lodash");
var Handlebars = require("handlebars");

var Phrase = require("handlebars.phrase");
Phrase.registerHelpers(Handlebars);

require("../handlebars.el").registerHelper(Handlebars);

Phrase.locale("en");
Phrase.addLanguages({
    "en": {
        "foo": "foo phrase"
    },
    "fr": {
        "foo": "phrase de foo"
    }
});


function template (tmpl, data) {
    var urtemplate = Handlebars.compile(tmpl);
    var output = urtemplate(data || {});
    log.info("\n================================", "\n"+tmpl, "\n---------------------------------\n", output, "\n");
    return output;
}

describe("Using handlebars.phrase in el templates", function () {

    it("should phraseify content", function () {
        expect(template('{{{el content="foo" el-content-phrase=true}}}')).toBe('<div>foo phrase</div>');
        expect(template('{{{el content="foo" el-content-phrase=true el-lang="fr"}}}')).toBe('<div>phrase de foo</div>');
    });



});


log.info("Tests described");
