# handlebars.el

    {{#el}}content{{/el}}

Content helper providing html elements for [Handlebars](http://handlebarsjs.com)

### Version

1.0.0

### Installation

    npm install handlebars.el

### Registering the helper

     var Handlebars = require("handlebars");
     var ElHelper = require("handlebars.el");
     ElHelper.registerHelper(Handlebars);

### Using the helper

Content handling

    {{#el}}foo{{/el}}                           → «<div>foo</div>»

    {{{el "foo"}}}                              → «<div>foo</div>»

    {{{el content="foo"}}}                      → «<div>foo</div>»

    {{#el content="bar"}}foo{{/el}}             → «<div>foo</div>»

    {{#el}}{{fooVar}}{{/el}}
    Context {fooVar: "foo"}                     → «<div>foo</div>»

 Attribute handling

    {{#el class="bar"}}foo{{/el}}               → «<div class="bar">foo</div>»

    {{#el id="bam" class="bar"}}foo{{/el}}      → «<div class="bar" id="bam">foo</div>»

    {{#el class="bar" id="bam"}}foo{{/el}}      → «<div class="bar" id="bam">foo</div>»

    {{#el class="bar" attributes=attrs}}foo{{/el}}
    Context {attrs:attrs}                       → «<div class="bar" id="bam">foo</div>»

Content escaping

    {{#el}}<i>foo</i>{{/el}}                    → «<div>&lt;i&gt;foo&lt;/i&gt;</div>»

    {{#el el-escape=true}}<i>foo</i>{{/el}}     → «<div>&lt;i&gt;foo&lt;/i&gt;</div>»

    {{#el el-escape=false}}<i>foo</i>{{/el}}    → «<div><i>foo</i></div>»

    {{#el attributes=attrs}}<i>foo</i>{{/el}}
    Context {attrs:{ "el-escape": false }}      → «<div><i>foo</i></div>»

Trimming content

    {{{el content=" foo "}}}                    → «<div>foo</div>»

    {{{el content=" foo " el-trim=false}}}      → «<div> foo </div>»

    {{{el content=" \n foo \t   "}}}            → «<div>foo</div>»

Suppressing output when no content

    {{#el}}{{fooVar}}{{/el}}                    → «»

    {{#el content="bar"}}{{fooVar}}{{/el}}      → «»

    {{#el}}     {{/el}}                         → «»

    {{{el el-tag="textarea"}}}                  → «<textarea></textarea>»

Empty elements

    {{{el el-tag="img" src="foo.gif"}}}         → «<img alt="" src="foo.gif">»

Empty attributes

    {{#el class=""}}foo{{/el}}                  → «<div>foo</div>»

    {{#el class=""}}foo{{/el}}                  → «<div>foo</div>»

    {{#el el-tag="input" class="" value=""}}foo{{/el}}
        → «<input value="">»

    {{#el el-tag="input" value=0}}foo{{/el}}    → «<input value="0">»

Alt attribute

    {{{el el-tag="img" src="foo.gif" alt="bar"}}}
        → «<img alt="bar" src="foo.gif">»

    {{{el el-tag="img" src="foo.gif" alt=baz}}}
    Context {baz:"bar"}
        → «<img alt="bar" src="foo.gif">»

    {{{el el-tag="img" src="foo.gif" alt=baz}}}
        → «<img alt="" src="foo.gif">»

Value attribute

    {{{el el-tag="input"}}}                     → «<input>»

    {{{el el-tag="input" value=""}}}            → «<input value="">»

    {{{el el-tag="input" value=0}}}             → «<input value="0">»

    {{{el el-tag="input" value=1}}}             → «<input value="1">»

Boolean attributes

    {{{el el-tag="input" type="checkbox" checked=true}}}
        → «<input checked type="checkbox">»

    {{{el el-tag="input" type="checkbox" checked=false}}}
        → «<input type="checkbox">»

    {{{el el-tag="input" type="checkbox" checked="true"}}}
        → «<input checked type="checkbox">»

    {{{el el-tag="input" type="checkbox" checked=""}}}
        → «<input type="checkbox">»

    {{{el el-tag="input" type="checkbox" checked=0}}}
        → «<input type="checkbox">»

Attribute escaping

    {{{el content="foo" class="\\"bar\\""}}}
        → «<div class="&quot;bar&quot;">foo</div>»

    {{{el content="foo" class="&quot;bar&quot;" el-escape-class=false}}}
        → «<div class="&quot;bar&quot;">foo</div>»

    {{{el content="foo" class="&quot;bar&quot;" el-escape-class=true}}}
        → «<div class="&amp;quot;bar&amp;quot;">foo</div>»

Element classes

    {{{el content="foo" class="bar"}}}          → «<div class="bar">foo</div>»

    {{{el content="foo" class=bar}}}
    Context {bar: ["klass1", "klass2"]}         → «<div class="klass1 klass2">foo</div>»

    {{{el content="foo" class=bar}}}
    Context {bar: ["klass2", "klass1"]}         → «<div class="klass1 klass2">foo</div>»

URL handling

    {{{el el-tag="a" href="/foo/bar" content="foo"}}}
        → «<a href="/foo/bar">foo</a>»

    {{{el el-tag="a" href="/foo/bar?bam=1&bim=2" content="foo"}}}
        → «<a href="/foo/bar?bam=1&amp;bim=2">foo</a>»

    {{{el el-tag="a" href="//rom.com/foo/bar?bam=1&bim=2" content="foo"}}}
        → «<a href="//rom.com/foo/bar?bam=1&amp;bim=2">foo</a>»

    {{{el el-tag="a" href="http://rom.com/foo/bar?bam=1&bim=2" content="foo"}}}
        → «<a href="http://rom.com/foo/bar?bam=1&amp;bim=2">foo</a>»

    {{{el el-tag="a" href="https://rom.com:8080/foo/bar?bam=1&bim=2" content="foo"}}}
        → «<a href="https://rom.com:8080/foo/bar?bam=1&amp;bim=2">foo</a>»

#### Arrays, splitting and contents

Passing content as an array

    {{{el content=azza}}}
    Context {azza:["foo", "bar", "baz"]}        → «<div>foobarbaz</div>»

    {{{el "foo" "bar" "baz"}}}                  → «<div>foobarbaz</div>»

Passing multiple content items

    {{{el contents=azza}}}
    Context {azza:["foo", "bar", "baz"]}
        → «<div>foo</div><div>bar</div><div>baz</div>»

    {{{el "foo" "bar" "baz" contents=true}}}
        → «<div>foo</div><div>bar</div><div>baz</div>»

    {{{el "foo" "bar" "baz" contents=true class="klass"}}}
        → «<div class="klass">foo</div><div class="klass">bar</div><div class="klass">baz</div>»

Splitting delimited content

    {{#el}}foo\nbar\nbaz{{/el}}                 → «<div>foobarbaz</div>»

    {{#el el-split=","}}foo,bar,baz{{/el}}      → «<div>foobarbaz</div>»

    {{#el el-split="," contents=true}}foo,bar,baz{{/el}}
        → «<div>foo</div><div>bar</div><div>baz</div>»

    {{#el el-split=false}}foo\nbar\nbaz{{/el}}
        → «<div>foo\nbar\nbaz</div>»

#### Wrapping output

Wrapping content

    {{{el content="foo" el-wrap="p"}}}          → «<div><p>foo</p></div>»

    {{{el content="foo" el-wrap=wrap}}}
    Context {wrap: {class:"bar", "el-tag":"p"}}
        → «<div><p class="bar">foo</p></div>»

    {{{el content="foo\nbaz" el-wrap=wrap}}}
    Context {wrap: {class:"bar", "el-tag":"p"}}
        → «<div><p class="bar">foo</p><p class="bar">baz</p></div>»

    {{{el content="foo\nbaz" class="wham" el-wrap=wrap}}}
    Context {wrap: {class:"bar", "el-tag":"p"}}
        → «<div class="wham"><p class="bar">foo</p><p class="bar">baz</p></div>»

    {{{el content="foo\nbaz" class="wham" el-wrap-all=wrap}}}
    Context {wrap: {class:"bar", "el-tag":"p"}}
        → «<div class="wham"><p class="bar">foobaz</p></div>»

    {{{el contents="foo\nbaz" class="a" el-wrap=wrap}}}
    Context {wrap: {class:"b", "el-tag":"p"}}
        → «<div class="a"><p class="b">foo</p></div><div class="a"><p class="b">baz</p></div>»

Wrapping element

    {{{el content="foo" el-wrap-outer=wrap}}}
    Context {wrap: {"el-tag": "section"}}
        → «<section><div>foo</div></section>»

    {{{el content="foo" el-wrap-outer="section"}}}
        → «<section><div>foo</div></section>»

    {{{el contents="bar\nbaz" el-wrap-outer=wrap el-tag="p"}}}
    Context {wrap: { "el-tag": "div", class: "display"}}
        → «<div class="display"><p>bar</p><p>baz</p></div>»

    {{{el content="zim\nzam" el-wrap=wrap class="display" el-tag="div"}}}
    Context {wrap: { "el-tag": "p"}}
        → «<div class="display"><p>zim</p><p>zam</p></div>»

#### Aborting output

Aborting element generation (but outputting content)

    {{{el content="foo" el-abort=true}}}        → «foo»

    {{{el content="foo" el-abort=false}}}       → «<div>foo</div>»

    {{{el content="foo\nbar" el-abort=true}}}   → «foobar»

    {{{el content=azza el-abort=true}}}
    Context {azza:["foo", "bar"]}               → «foobar»

Aborting element and content

    {{{el content="foo" el-abort-all=true}}}    → «»

    {{{el content="foo" el-abort-all=false}}}   → «<div>foo</div>»

#### Fallbacks

Providing fallback content

    {{{el el-fallback="foo"}}}                  → «<div>foo</div>»

    {{{el el-fallback=" foo "}}}                → «<div>foo</div>»

    {{{el content="foo" el-fallback="foo"}}}    → «<div>foo</div>»

Providing a fallback class

    {{{el content="foo" el-fallback-class="bar"}}}
        → «<div class="bar">foo</div>»

    {{{el content="foo" class="bar" el-fallback-class="baz"}}}
        → «<div class="bar">foo</div>»

    {{{el content="foo" class=klass el-fallback-class=fallback}}}
    Context {klass:[], fallback:["klass1", "klass2"]}
        → «<div class="klass1 klass2">foo</div>»

#### Conditional output

Outputting first matched content

    {{{el content=azza el-first-match=true}}}
    Context {azza: ["", this.gzzzarn, "foo"]}   → «<div>foo</div>»

    {{{el content=azza el-first-match=true}}}
    Context {azza: ["", this.gzzzarn, 0]}       → «<div>0</div>»

    {{{el content=azza el-first-match=true}}}
    Context {azza: ["", this.gzzzarn, "0"]}     → «<div>0</div>»

Outputting ternary content

    {{{el content=azza el-ternary=true}}}
    Context {azza: ["foo", "bar"]}              → «<div>foo</div>»

    {{{el content=azza el-ternary=false}}}
    Context {azza: ["foo", "bar"]}              → «<div>bar</div>»

    {{{el content=azza el-ternary=true}}}
    Context {azza: ["foo", "bar", "baz"]}       → «<div>foobarbaz</div>»
    // more than 2 values

#### Advanced methods of passing content and attributes

Passing attributes as JSON strings

    {{{el content="foo" el-wrap="{'el-tag':'p', class:'bar'}"}}}
        → «<div><p class="bar">foo</p></div>»

    {{{el content="foo" el-wrap="{ \'el-tag\': context.taggo}" }}}
    Context {taggo:"span"}
        → «<div><span>foo</span></div>»

Passing content as a function

    var fn = function () {
        return "foo";
    };
    {{{el content=fn}}}
    Context {fn: fn}                            → «<div>foo</div>»

    var fn2 = function (x) {
        return x === "a" ? "foo" : "bar";
    };
    {{{el content=fn el-params-content="a"}}}
    Context {fn: fn2}                           → «<div>foo</div>»

    {{{el content=fn el-params-content="b"}}}
    Context {fn: [fn, fn2]}                     → «<div>foobar</div>»

Passing attributes as functions

    var fn = function() {
        return "bar";
    };
    {{{el content="foo" id=fn}}}
    Context {fn: fn}                            → «<div id="bar">foo</div>»

    var fn2 = function(x) {
        return x === "a" ? "bar" : "foo";
    };
    {{{el content="foo" id=fn el-params-id="a"}}}
    Context {fn: fn2}                           → «<div id="bar">foo</div>»

#### Miscellaneous

JSON in attributes

    {{{el content="foo" el-escape-id=false id="{bar:'true'}"}}}
    Context {azza:["foo", "bar", "baz"]}        → «<div id="{bar:\'true\'}">foo</div>»

Meta element may take content as an attribute

    {{{el el-tag="meta" http-equiv="content-type" content="text/html;charset=UTF-8"}}}
        → «<meta content="text/html;charset=UTF-8" http-equiv="content-type">»

### Tests

To run the tests, cd to the handlebars.el directory

    npm install && npm test

### Unlicense

Handlebars Element Helper is free and unencumbered software released into 
the public domain.

Anyone is free to copy, modify, publish, use, compile, sell, or
distribute this software, either in source code form or as a compiled
binary, for any purpose, commercial or non-commercial, and by any
means.

In jurisdictions that recognize copyright laws, the author or authors
of this software dedicate any and all copyright interest in the
software to the public domain. We make this dedication for the benefit
of the public at large and to the detriment of our heirs and
successors. We intend this dedication to be an overt act of
relinquishment in perpetuity of all present and future rights to this
software under copyright law.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR
OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

For more information, please refer to <http://unlicense.org/>