(function (moduleFactory) {
    if(typeof exports === "object") {
        module.exports = moduleFactory(require("lodash"), require("handlebars.phrase"));
    } else if (typeof define === "function" && define.amd) {
        define(["lodash", "handlebars.phrase"], moduleFactory);
    }
}(function (_, Phrase) {
/**
 * @module handlebars%el
 * @description  Provides helper to generate html elements
 * 
 *      var Handlebars = require("handlebars");
 *      var ElHelper = require("handlebars.el");
 *      ElHelper.registerHelper(Handlebars);
 *      
 * @returns {object} ElHelper instance
 */

    //TODO?
    /*
        allow aliasing of tag to el-tag
        xmlify empty tags (if desired)
    */

    var Handlebars;

    var defaults = {
        "el-escape": true,
        "el-tag": "div",
        "el-join": '',
        "el-reject": /^\s*$/,
        "el-split": /(\r\n|\n\r|\n|\r)+/g,
        "el-trim": true
    };

    var elementIsEmpty = {
        area: true,
        base: true,
        br: true,
        col: true,
        hr: true,
        img: true,
        input: true,
        link: true,
        meta: true,
        param: true
    };

    var elementCanHaveNoContent = {
        textarea: true,
        script: true
    };

    var elementHasContentAttribute = {
        meta: true
    };

    var attributeCanHaveNoValue = {
        alt: true,
        value: true
    };

    var attributeIsBoolean = {
        checked: true,
        disabled: true,
        selected: true
    };

    var attributeIsEnumerate = {
        dir: ["rtl", "ltr"]
    };

    /**
     * @template el
     * @block helper
     * @param {content} [0] Element’s content
     * @param {...string} [n] Further element content - concatenated with first content param
     * @param {content} [content] Alternative content param
     * @param {content} [el-content] Alternative content param
     * @param {string|array|boolean} [contents] Multiple content items
     *
     * If passed as true, the value of content is used
     *
     * Otherwise, the value of contents is assigned to content if content has no value
     * @param {string|array} [class] Element class
     *
     * If passed as an array, its values are joined with a space
     * @param {object|string} [attributes] Element attributes
     *
     * Merged with any other params passed - with the other params taking precedence
     *
     * If passed as a string, coerced into an object with its value set on the el-tag property 
     * @param {string|object} [el-tag=div] Tag name for element
     * @param {boolean} [el-escape=true] Whether to escape the element’s content
     * @param {string|object} [el-wrap] Tag name or attributes for wrapping content
     * @param {string} [el-wrap-all] Tag name or attributes for wrapping multiple content items
     * @param {string} [el-wrap-outer] Tag name or attributes for wrapping element
     * @param {string} [el-join=] String to join content if it is an array but multiple content items have not been specified
     * @param {regex} [el-reject=/^\s*$/] Pattern to match whether attribute’s value should cause the attribute to be skipped 
     * @param {regex|string} [el-split=/(\r\n|\n\r|\n|\r)+/g] Pattern to use to split content
     * @param {boolean} [el-first-match=false] Whether to output just the first non-empty content value
     * @param {boolean} [el-ternary=undefined] Whether to output the value corresponding to the ternary value 
     *
     * NB. only two content values should be provided
     * @param {boolean} [el-force=false] Force the output of an element even when it has no content
     * @param {boolean} [el-abort=false] Whether to output just the content
     * @param {boolean} [el-abort-all=false] Whether to output nothing at all
     * @param {boolean} [el-trim=true] Whether to trim leading and trailing whitespace
     * @param {string} [el-fallback] Fallback content to use if provided content has no value
     * @param {string} [el-fallback-class] Fallback class to use if provided class has no value
     * @param {string} [el-fallback-{{prop}}] Fallback property value to use if provided property has no value
     * @param {string} [el-content-before] Additional content to insert before content
     *
     * NB. this is inserted between the element and any wrapping element on the content
     * @param {string} [el-content-after]  Additional content to insert after content
     *
     * NB. this is inserted between the element and any wrapping element on the content
     * @param {*} [el-params-content] If content is a function, allows additional params to be passed to the function
     * @param {*} [el-content-params] If content is an array and any of its elements is a function, allows additional params to be passed to the function
     * @param {*} [el-params-{{prop}}] If attr {{prop}} is a function, this value is passed to the function
     * @param {boolean} [el-escape-{{prop}}=undefined] Allows escaping to be performed at the individual attribute level
     * @param {boolean} [el-content-phrase=false] Whether or not to use the content as a lookup key for handlebars.phrase
     *
     * If passed, takes precedence over any existing escaping value
     * @description  Outputs html elements
     *
     *     {{#el}}content{{/el}}
     *     {{{el content}}}
     *     {{{el content=content}}}
     *
     *
     * Content is determined in the following way, stopping when it has a value
     *
     * 1. Captured content
     *    If options.fn exists then the search stops here, even if the resulting value is empty
     * 2. Single positional params
     * 3. Multiple positional params
     *    Concatenated and assigned to content as an array
     * 4. content param
     * 5. el-content param
     * 6. contents param when passed as a string or array
     * 7. fallback param
     */
    var Element = function () {
        var args = Array.prototype.slice.call(arguments);
        var options = args.pop();

        var attributes = _.extend({}, options.hash || {});
        if (attributes.attributes) {
            if (typeof attributes.attributes !== "object") {
                attributes.attributes = {
                    "el-tag": attributes.attributes
                };
            }
            attributes = _.extend({}, attributes.attributes, attributes);
            delete attributes.attributes;
        }
        attributes = _.extend({}, defaults, attributes);

        function getAttr (name) {
            var attr = attributes[name];
            delete attributes[name];
            return attr;
        }

        if (getAttr("el-abort-all")) {
            return;
        }

        var output = "";

        var context = this;

        var tagName = getAttr("el-tag").toLowerCase();
        var escape = getAttr("el-escape");
        var wrap = getAttr("el-wrap");
        var wrapAll = getAttr("el-wrap-all");
        var wrapOuter = getAttr("el-wrap-outer");
        var join = getAttr("el-join");
        var split = getAttr("el-split");
        var reject = getAttr("el-reject");
        var firstMatch = getAttr("el-first-match");
        var ternary = getAttr("el-ternary");
        var abort = getAttr("el-abort");
        var trim = getAttr("el-trim");
        var fallback = getAttr("el-fallback");
        var fallbackClass = getAttr("el-fallback-class");
        var contentBefore = getAttr("el-content-before");
        var contentAfter = getAttr("el-content-after");
        var lang = getAttr("el-lang");

        for (var elfallbackprop in attributes) {
            if (elfallbackprop.indexOf("el-fallback-") === 0) {
                var matchprop = elfallbackprop.match(/^el-fallback-(.*)/)[1];
                if (attributes[matchprop] === undefined) {
                    attributes[matchprop] = attributes[elfallbackprop];
                }
                delete attributes[elfallbackprop];
            }
        }

        var empty = elementIsEmpty[tagName];

        var contents = getAttr("contents");
        var content = args.shift();

        if (args.length) {
            content = [content].concat(args);
        }

        if (options.fn) {
            content = options.fn(this);
        }

        if (content === undefined) {
            if (!elementHasContentAttribute[tagName]) {
                content = attributes.content;
            }
            if (content === undefined) {
                content = attributes["el-content"];
            }
        }
        if (!elementHasContentAttribute[tagName]) {
            delete attributes["content"];
        }
        delete attributes["el-content"];

        if (!content && contents && typeof contents !== "boolean") {
            content = contents;
            contents = true;
        }

        if (tagName === "img" && !attributes.alt) {
            attributes.alt = "";
        }

        /* http://blog.stevenlevithan.com/archives/faster-trim-javascript */
        function trim12 (str) {
            var str2 = str.replace(/^\s\s*/, '');
            var ws = /\s/;
            var i = str2.length;
            while (ws.test(str2.charAt(--i)));
            return str2.slice(0, i + 1);
        }

        function jsonifyAttr(attr) {
            // Er, why not just use JSON.parse?
            if (typeof attr === "string") {
                if (attr.indexOf("{") === 0 || attr.indexOf("[") === 0) {
                    try {
                        eval('attr = ' + attr + ';');
                    } catch(e) {}
                }
            }
            return attr;
        }

        function wrapInner(text, wrapAttr) {
            wrapAttr = jsonifyAttr(wrapAttr);
            var wrapAttrUse = typeof wrapAttr === "object" ? _.cloneDeep(wrapAttr) : {"el-tag": wrapAttr};
            text = Handlebars.helpers.el(text, {hash: wrapAttrUse});
            return text;
        }

        var chunks = [""];
        if (!content && fallback) {
            content = fallback;
        }
        if (content) {
            if (typeof content === "function") {
                content = content(attributes["el-params-content"], context);
            }
            if (_.isArray(content)) {
                chunks = content;
            } else {
                if (split) {
                    if (typeof content === "number") {
                        content = content.toString();
                    }
                    if (!content.split) {
                        console.log("no split for content", content);
                    }
                    var tmpChunks = content.split(split);
                    for (var tmpChunk = 0; tmpChunk < tmpChunks.length; tmpChunk++) {
                        if (tmpChunks[tmpChunk] && !tmpChunks[tmpChunk].match(split)) {
                            chunks.push(tmpChunks[tmpChunk]);
                        }
                    }
                } else {
                    chunks = [content];
                }
            }

            if (ternary !== undefined && chunks.length === 2) {
                var ternaryChunk = ternary ? 0 : 1;
                chunks = [chunks[ternaryChunk]];
            }

            if (firstMatch) {
                for (var fchunk in chunks) {
                    if (chunks[fchunk] || chunks[fchunk] === 0) {
                        chunks = [chunks[fchunk]];
                        break;
                    }
                }
            }

            for (var cchunk in chunks) {
                if (!chunks[cchunk]) {
                    continue;
                }
                if (attributes["el-content-phrase"]) {
                    chunks[cchunk] = Phrase.get(chunks[cchunk], {}, context, lang);
                } else if (typeof chunks[cchunk] === "function") {
                    chunks[cchunk] = chunks[cchunk](attributes["el-content-params"], context);
                }
            }
            if (wrap && !contents && !abort) {
                for (var chunk in chunks) {
                    chunks[chunk] = wrapInner(chunks[chunk], wrap);
                }
                chunks = [chunks.join("")];
                escape = false;
                wrap = null;
            }

            if (!contents) {
                chunks = [chunks.join(join)];
            }

            if (wrapAll && !abort) {
                chunks[0] = wrapInner(chunks[0], wrapAll);
                escape = false;
                wrapAll = null;
            }
            /*chunks = _.reject(chunks, function(val){
                return val.match(reject);
            });*/
        }

        if (abort) {
            // should this be escaped by default?
            return chunks.join("");
        }

        if (fallbackClass && _.isEmpty(attributes["class"])) {
            attributes["class"] = fallbackClass;
        }

        if (elementCanHaveNoContent[tagName]) {
            attributes["el-force"] = true;
        }

        for (var i = 0, clength = chunks.length; i < clength; i++) {
            var contentChunk = chunks[i];
            if (trim) {
                if (typeof contentChunk === "number") {
                    contentChunk = contentChunk.toString();
                }
                contentChunk = trim12(contentChunk);
            }
            if (empty || attributes["el-force"] || !contentChunk.match(reject)) {
                var attrStr = "";
                var keys = _.keys(attributes).sort();
                for (var key in keys) {
                    var prop = keys[key];
                    if (prop.indexOf("el-") !== 0) {
                        var attr = attributes[prop];
                        var escapeAttr = true;
                        var escapeFlag = attributes["el-escape-"+prop];
                        if (escapeFlag !== undefined && !escapeFlag) {
                            escapeAttr = false;
                        }
                        if (typeof attr === "function") {
                            attr = attr(attributes["el-params-"+prop]);
                        }
                        if (prop === "class") {
                            if (attr.join) {
                                attr = attr.sort().join(" ");
                            }
                        } else if (prop === "href" || prop === "src") {
                            // TODO: allow url params to be passed
                            // encodeURIComponent each param
                        }
                        if (attr || attributeCanHaveNoValue[prop]) {
                            attrStr += " " + prop;
                            if (!attributeIsBoolean[prop]) {
                                if (escapeAttr) {
                                    attr = Handlebars.Utils.escapeExpression(attr);
                                }
                                attrStr += "=\"" + attr + "\"";
                            }
                        }
                    }
                }
                if (escape !== false) {
                    contentChunk = Handlebars.Utils.escapeExpression(contentChunk);
                    //contentChunk = contentChunk.toString();
                }
                /*contentChunk = new Handlebars.SafeString(contentChunk); */
                output += "<" + tagName + attrStr + ">";
                if (!empty) {
                    if (wrap) {
                        contentChunk = wrapInner(contentChunk, wrap);
                    }
                    if (contentBefore) {
                        output += contentBefore;
                    }
                    output +=  contentChunk;
                    if (contentAfter) {
                        output += contentAfter;
                    }
                    output += "</" + tagName + ">";
                }
            }
        }
    if (output && wrapOuter) {
        var wrapOuterOptions = {
            hash: {
                attributes: wrapOuter,
                content: output,
                "el-escape": false
            }
        };
        output = Handlebars.helpers.el(wrapOuterOptions);
    }

    return output;

    };

    /**
     * @method registerHelper
     * @static
     * @param {object} hbars Handlebars instance
     * @param {string} [helperName=el] Helper name
     * @description Register Phrase helper with Handlebars
     *
     * - {@link template:el}
     */
    function registerHelper (hbars, helperName) {
        Handlebars = hbars;
        helperName = helperName || "el";
        Handlebars.registerHelper(helperName, Element);
    }
    return {
        registerHelper: registerHelper,
        registerHelpers: registerHelper
    };
}));
