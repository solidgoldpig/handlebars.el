var Log = require("log");
var log = new Log(process.env.loglevel || "error");

var Handlebars = require("handlebars");
require("../handlebars.el").registerHelper(Handlebars);


function template (tmpl, data) {
    var urtemplate = Handlebars.compile(tmpl);
    var output = urtemplate(data || {});
    log.info("\n================================", "\n"+tmpl, "\n---------------------------------\n", output, "\n");
    return output;
}

//TODO - el-reject, el-join

describe("El Templates", function () {

    it("should handle content correctly", function () {
        expect(template('{{#el}}foo{{/el}}')).toBe("<div>foo</div>");
        expect(template('{{{el "foo"}}}')).toBe("<div>foo</div>");
        expect(template('{{{el content="foo"}}}')).toBe("<div>foo</div>");
        expect(template('{{#el content="bar"}}foo{{/el}}')).toBe("<div>foo</div>");
        expect(template('{{#el}}{{fooVar}}{{/el}}', {fooVar: "foo"})).toBe("<div>foo</div>");
        expect(template('{{{el el-tag="meta" http-equiv="content-type" content="text/html;charset=UTF-8"}}}')).toBe('<meta content="text/html;charset=UTF-8" http-equiv="content-type">');
    });

    it("should escape content correctly", function () {
        expect(template('{{#el}}<i>foo</i>{{/el}}')).toBe("<div>&lt;i&gt;foo&lt;/i&gt;</div>");
        expect(template('{{#el el-escape=true}}<i>foo</i>{{/el}}')).toBe("<div>&lt;i&gt;foo&lt;/i&gt;</div>");
        expect(template('{{#el el-escape=false}}<i>foo</i>{{/el}}')).toBe("<div><i>foo</i></div>");
        expect(template('{{#el attributes=attrs}}<i>foo</i>{{/el}}', {attrs:{ "el-escape": false }})).toBe("<div><i>foo</i></div>");
    });

    it("should handle no content correctly", function () {
        expect(template('{{#el}}{{fooVar}}{{/el}}')).toBe("");
        expect(template('{{#el content="bar"}}{{fooVar}}{{/el}}')).toBe("");
        expect(template('{{#el}}     {{/el}}')).toBe("");
        expect(template('{{{el el-tag="textarea"}}}')).toBe("<textarea></textarea>");
    });

    it("should output attributes correctly", function () {
        expect(template('{{#el class="bar"}}foo{{/el}}')).toBe('<div class="bar">foo</div>');
        expect(template('{{#el id="bam" class="bar"}}foo{{/el}}')).toBe('<div class="bar" id="bam">foo</div>');
        expect(template('{{#el class="bar" id="bam"}}foo{{/el}}')).toBe('<div class="bar" id="bam">foo</div>');
        var attrs = {id: "bam"};
        for (var i = 0; i < 1; i++) {
            template('{{#el class="bar" attributes=attrs}}foo{{/el}}', {attrs:attrs});
        }
        expect(template('{{#el class="bar" attributes=attrs}}foo{{/el}}', {attrs:attrs})).toBe('<div class="bar" id="bam">foo</div>');
    });

    it("should handle empty elements correctly", function () {
        expect(template('{{{el el-tag="img" src="foo.gif"}}}')).toBe('<img alt="" src="foo.gif">');
    });

    it("should handle empty attributes correctly", function () {
        expect(template('{{#el class=""}}foo{{/el}}')).toBe("<div>foo</div>");
        expect(template('{{#el class=""}}foo{{/el}}')).toBe("<div>foo</div>");
        expect(template('{{#el el-tag="input" class="" value=""}}foo{{/el}}')).toBe('<input value="">');
        expect(template('{{#el el-tag="input" value=0}}foo{{/el}}')).toBe('<input value="0">');

    });

    it("should handle alt attribute correctly", function () {
        expect(template('{{{el el-tag="img" src="foo.gif" alt="bar"}}}')).toBe('<img alt="bar" src="foo.gif">');
        expect(template('{{{el el-tag="img" src="foo.gif" alt=baz}}}', {baz:"bar"})).toBe('<img alt="bar" src="foo.gif">');
        expect(template('{{{el el-tag="img" src="foo.gif" alt=baz}}}')).toBe('<img alt="" src="foo.gif">');
    });

    it("should handle value attribute correctly", function () {
        expect(template('{{{el el-tag="input"}}}')).toBe('<input>');
        expect(template('{{{el el-tag="input" value=""}}}')).toBe('<input value="">');
        expect(template('{{{el el-tag="input" value=0}}}')).toBe('<input value="0">');
        expect(template('{{{el el-tag="input" value=1}}}')).toBe('<input value="1">');
    });

    it("should handle boolean attributes correctly", function () {
        expect(template('{{{el el-tag="input" type="checkbox" checked=true}}}')).toBe('<input checked type="checkbox">');
        expect(template('{{{el el-tag="input" type="checkbox" checked=false}}}')).toBe('<input type="checkbox">');
        expect(template('{{{el el-tag="input" type="checkbox" checked="true"}}}')).toBe('<input checked type="checkbox">');
        expect(template('{{{el el-tag="input" type="checkbox" checked=""}}}')).toBe('<input type="checkbox">');
        expect(template('{{{el el-tag="input" type="checkbox" checked=0}}}')).toBe('<input type="checkbox">');
    });

    it("should escape attributes correctly", function () {
        expect(template('{{{el content="foo" class="\\"bar\\""}}}')).toBe('<div class="&quot;bar&quot;">foo</div>');
        expect(template('{{{el content="foo" class="&quot;bar&quot;" el-escape-class=false}}}')).toBe('<div class="&quot;bar&quot;">foo</div>');
        expect(template('{{{el content="foo" class="&quot;bar&quot;" el-escape-class=true}}}')).toBe('<div class="&amp;quot;bar&amp;quot;">foo</div>');
    });

    it("should handle classes correctly", function () {
        expect(template('{{{el content="foo" class="bar"}}}')).toBe('<div class="bar">foo</div>');
        expect(template('{{{el content="foo" class=bar}}}', {bar: ["klass1", "klass2"]})).toBe('<div class="klass1 klass2">foo</div>');
        expect(template('{{{el content="foo" class=bar}}}', {bar: ["klass2", "klass1"]})).toBe('<div class="klass1 klass2">foo</div>');
    });

    it("should handle urls correctly", function () {
        expect(template('{{{el el-tag="a" href="/foo/bar" content="foo"}}}')).toBe('<a href="/foo/bar">foo</a>');
        expect(template('{{{el el-tag="a" href="/foo/bar?bam=1&bim=2" content="foo"}}}')).toBe('<a href="/foo/bar?bam=1&amp;bim=2">foo</a>');
        expect(template('{{{el el-tag="a" href="//zed.com/foo/bar?bam=1&bim=2" content="foo"}}}')).toBe('<a href="//zed.com/foo/bar?bam=1&amp;bim=2">foo</a>');
        expect(template('{{{el el-tag="a" href="http://zed.com/foo/bar?bam=1&bim=2" content="foo"}}}')).toBe('<a href="http://zed.com/foo/bar?bam=1&amp;bim=2">foo</a>');
        expect(template('{{{el el-tag="a" href="https://zed.com:8080/foo/bar?bam=1&bim=2" content="foo"}}}')).toBe('<a href="https://zed.com:8080/foo/bar?bam=1&amp;bim=2">foo</a>');
    });

    it("should handle content arrays correctly", function () {
        expect(template('{{{el content=azza}}}', {azza:["foo", "bar", "baz"]})).toBe('<div>foobarbaz</div>');
        expect(template('{{{el "foo" "bar" "baz"}}}')).toBe('<div>foobarbaz</div>');
    });

    it("should handle contents correctly", function () {
        expect(template('{{{el contents=azza}}}', {azza:["foo", "bar", "baz"]})).toBe('<div>foo</div><div>bar</div><div>baz</div>');
        expect(template('{{{el "foo" "bar" "baz" contents=true}}}')).toBe('<div>foo</div><div>bar</div><div>baz</div>');
        expect(template('{{{el "foo" "bar" "baz" contents=true class="klass"}}}')).toBe('<div class="klass">foo</div><div class="klass">bar</div><div class="klass">baz</div>');
    });

    it("should handle splits correctly", function () {
        expect(template('{{#el}}foo\nbar\nbaz{{/el}}')).toBe('<div>foobarbaz</div>');
        expect(template('{{#el el-split=","}}foo,bar,baz{{/el}}')).toBe('<div>foobarbaz</div>');
        expect(template('{{#el el-split="," contents=true}}foo,bar,baz{{/el}}')).toBe('<div>foo</div><div>bar</div><div>baz</div>');
        expect(template('{{#el el-split=false}}foo\nbar\nbaz{{/el}}')).toBe('<div>foo\nbar\nbaz</div>');
    });

    it("should handle json attrs correctly", function () {
        var jsonbundle = "{bar:'true'}";
        expect(template('{{{el content="foo" el-escape-id=false id="' + jsonbundle + '"}}}', {azza:["foo", "bar", "baz"]})).toBe('<div id="{bar:\'true\'}">foo</div>');
    });

    it("should wrap content correctly", function () {
        expect(template('{{{el content="foo" el-wrap="p"}}}')).toBe('<div><p>foo</p></div>');
        expect(template('{{{el content="foo" el-wrap=wrap}}}', {wrap: {class:"bar", "el-tag":"p"}})).toBe('<div><p class="bar">foo</p></div>');
        expect(template('{{{el content="foo\nbaz" el-wrap=wrap}}}', {wrap: {class:"bar", "el-tag":"p"}})).toBe('<div><p class="bar">foo</p><p class="bar">baz</p></div>');
        expect(template('{{{el content="foo\nbaz" class="wham" el-wrap=wrap}}}', {wrap: {class:"bar", "el-tag":"p"}})).toBe('<div class="wham"><p class="bar">foo</p><p class="bar">baz</p></div>');
        expect(template('{{{el content="foo\nbaz" class="wham" el-wrap-all=wrap}}}', {wrap: {class:"bar", "el-tag":"p"}})).toBe('<div class="wham"><p class="bar">foobaz</p></div>');
        expect(template('{{{el contents="foo\nbaz" class="wham" el-wrap=wrap}}}', {wrap: {class:"bar", "el-tag":"p"}})).toBe('<div class="wham"><p class="bar">foo</p></div><div class="wham"><p class="bar">baz</p></div>');
        expect(template('{{{el content="foo" el-wrap-outer=wrap}}}', {wrap: {"el-tag": "section"}})).toBe('<section><div>foo</div></section>');
        expect(template('{{{el content="foo" el-wrap-outer="section"}}}')).toBe('<section><div>foo</div></section>');

        expect(template('{{{el contents="bar\nbaz" el-wrap-outer=wrap el-tag="p"}}}', {wrap: { "el-tag": "div", class: "display"} })).toBe('<div class="display"><p>bar</p><p>baz</p></div>');
        expect(template('{{{el content="zim\nzam" el-wrap=wrap class="display" el-tag="div"}}}', {wrap: { "el-tag": "p"} })).toBe('<div class="display"><p>zim</p><p>zam</p></div>');
    });

    it("should handle attrs passed as json strings", function () {
        var wrap = "{'el-tag':'p', class:'bar'}";
        expect(template('{{{el content="foo" el-wrap="' + wrap + '"}}}')).toBe('<div><p class="bar">foo</p></div>');
        var spanwrap = "{'el-tag':this.taggo}";
        expect(template('{{{el content="foo" el-wrap="{ \'el-tag\': context.taggo}" }}}', {taggo:"span"})).toBe('<div><span>foo</span></div>');
    });

    it("should handle content passed as a function", function () {
        var fn = function() {
            return "foo";
        };
        expect(template('{{{el content=fn}}}', {fn: fn})).toBe('<div>foo</div>');
        var fn2 = function(x) {
            return x === "a" ? "foo" : "bar";
        };
        expect(template('{{{el content=fn el-params-content="a"}}}', {fn: fn2})).toBe('<div>foo</div>');
        expect(template('{{{el content=fn el-params-content="b"}}}', {fn: [fn, fn2]})).toBe('<div>foobar</div>');
    });

    it("should handle attributes passed as functions", function () {
        var fn = function() {
            return "bar";
        };
        expect(template('{{{el content="foo" id=fn}}}', {fn: fn})).toBe('<div id="bar">foo</div>');
        var fn2 = function(x) {
            return x === "a" ? "bar" : "foo";
        };
        expect(template('{{{el content="foo" id=fn el-params-id="a"}}}', {fn: fn2})).toBe('<div id="bar">foo</div>');
    });

    it("should emit nothing when totally aborted", function () {
        expect(template('{{{el content="foo" el-abort-all=true}}}')).toBe('');
        expect(template('{{{el content="foo" el-abort-all=false}}}')).toBe('<div>foo</div>');
    });

    it("should emit only content when aborted", function () {
        expect(template('{{{el content="foo" el-abort=true}}}')).toBe('foo');
        expect(template('{{{el content="foo" el-abort=false}}}')).toBe('<div>foo</div>');
        expect(template('{{{el content="foo\nbar" el-abort=true}}}')).toBe('foobar');
        expect(template('{{{el content=azza el-abort=true}}}', {azza:["foo", "bar"]})).toBe('foobar');
    });

    it("should trim content", function () {
        expect(template('{{{el content=" foo "}}}')).toBe('<div>foo</div>');
        expect(template('{{{el content=" foo " el-trim=false}}}')).toBe('<div> foo </div>');
        expect(template('{{{el content=" \n foo \t   "}}}')).toBe('<div>foo</div>');
    });

    it("should use fallback content if provided", function () {
        expect(template('{{{el el-fallback="foo"}}}')).toBe('<div>foo</div>');
        expect(template('{{{el el-fallback=" foo "}}}')).toBe('<div>foo</div>');
        expect(template('{{{el content="foo" el-fallback="foo"}}}')).toBe('<div>foo</div>');
    });

    it("should use fallback class if provided", function () {
        expect(template('{{{el content="foo" el-fallback-class="bar"}}}')).toBe('<div class="bar">foo</div>');
        expect(template('{{{el content="foo" class="bar" el-fallback-class="baz"}}}')).toBe('<div class="bar">foo</div>');
        expect(template('{{{el content="foo" class=klass el-fallback-class=fallback}}}', {klass:[], fallback:["klass1", "klass2"]})).toBe('<div class="klass1 klass2">foo</div>');
    });

    it("should return first matched content", function () {
        expect(template('{{{el content=azza el-first-match=true}}}', {azza: ["", this.gzzzarn, "foo"]})).toBe('<div>foo</div>');
        expect(template('{{{el content=azza el-first-match=true}}}', {azza: ["", this.gzzzarn, 0]})).toBe('<div>0</div>');
        expect(template('{{{el content=azza el-first-match=true}}}', {azza: ["", this.gzzzarn, "0"]})).toBe('<div>0</div>');
    });

    it("should return ternary content", function () {
        expect(template('{{{el content=azza el-ternary=true}}}', {azza: ["foo", "bar"]})).toBe('<div>foo</div>');
        expect(template('{{{el content=azza el-ternary=false}}}', {azza: ["foo", "bar"]})).toBe('<div>bar</div>');
        expect(template('{{{el content=azza el-ternary=true}}}', {azza: ["foo", "bar", "baz"]})).toBe('<div>foobarbaz</div>');
    });

});


log.info("Described tests");
