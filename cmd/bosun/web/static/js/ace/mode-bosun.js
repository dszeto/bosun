ace.define("ace/mode/bosun_highlight_rules",["require","exports","module","ace/lib/oop","ace/mode/text_highlight_rules"], function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var BosunHighlightRules = function() {

	var globals = "checkFrequency|tsdbHost|graphiteHost|logstashElasticHosts|httpListen|" +
		"hostname|relayListen|smtpHost|smtpUsername|smtpPassword|emailFrom|stateFile|ping|" +
		"pingDuration|noSleep|blockedPutIPs|allowedPutIPs|unknownThreshold|timeAndDate|" +
		"responseLimit|searchSince|unknownTemplate|squelch|shortURLKey";

	var inAlertKeywords = "macro|template|crit|warn|depends|squelch|critNotification|" +
	"warnNotification|unknown|unjoinedOk|ignoreUnknown|log"

	var inNotificationKeywords = "email|post|get|print|contentType|next|timeout|body";

	var inTemplateKeywords = "subject|body";

	var inSectionKeywords = [inAlertKeywords, inNotificationKeywords, inTemplateKeywords].join("|");
_
	var confFuncs = "alert|lookup|lookupSeries";

	var graphiteFuncs = "graphiteBand|graphite";

	var tsdbFuncs = "band|change|count|diff|q";

	var builtinFuncs = "avg|dev|first|forecastlr|last|len|max|median|min|" +
	"percentile|since|sum|streak|rename|t|ungroup|abs|d|epoch|dropge|drople|dropna|des|nv";

	var logstashFuncs = "lsstat|lscount";

	var exprFuncs = [confFuncs, graphiteFuncs, tsdbFuncs, builtinFuncs, logstashFuncs].join("|")

	this.$rules = {
		"start" : [
			{
				token: "keyword",
				regex: "^(" + globals + ")",
				next: "consumeLine"
			},
			{
				token: "variable.instance",
				regex: "[$]",
				next: "variable"
			},
			{
				token: ["keyword", "space", "variable", "space", "paren.lparent"],
				regex: "^(alert|notification|lookup|macro|template)(\\s+)([-a-zA-Z0-9._]+)(\\s)+([{])",
			},
			{
				token: ["space", "keyword", "space", "regexp", "space", "paren.lparen"],
				regex: "(\\s*)(entry)(\\s*)(.*)(\\s)([{])",
			},
			{
				token: ["space", "keyword", "space", "keyword.operator", "regexp"],
				regex: "(\\s*)(squelch)(\\s*)(=)(.*)",
			},
			{
				token: ["space", "keyword", "space", "equals"],
				regex: "(\\s*)(" + inSectionKeywords + ")(\\s*)(=)",
			},
			{
				token: "string",
				regex: '"',
				next: "qqstring"
			},
			{
				token: "string",
				regex : "[']" + '(?:(?:\\\\.)|(?:[^' + "'" + '\\\\]))*?' + "[']"},
			{
				token: "string",
				regex : '[`](?:[^`]*)[`]'}, // single line
			{
				token: "string", merge : true,
				regex : '[`](?:[^`]*)$', next : "bqstring"
			},
			{
				token: "doc.comment",
				regex : /^\s*#.*/},
			{
				token: "constant.numeric",
				regex: "[+-]?[0-9.]+e?[0-9.]*\\b"},
			{
				token: "keyword.operator",
				regex: "\\+|\\-|\\*|\\*\\*|\\/|\\/\\/|%|<<|>>|&|!|\\||\\^|~|<|>|<=|=>|==|!=|<>|="},
			{
				token: "paren.lparen",
				regex : "[\\[({]"},
			{
				token: "paren.rparen",
				regex : "[\\])}]"},
			{
				token: ["support.function", "paren.lparen"],
				regex: "(" + exprFuncs + ")([(])"},
			{
				caseInsensitive: true
			}
		],
		"consumeLine": [
			{
				token: "consumeLine",
				regex: ".*$",
				next: "start"
			},
		],
		"qqstring": [
			{
				token: "variable",
				regex: /\$\{\w+}|\$\w+\b/,
				push: "variable"
			}, {
				token: "string",
				regex: '"',
				next: "start"
			}, {
				defaultToken: "string"
			}],
		"bqstring": [
			{
				token: "string",
				regex : '(?:[^`]*)`',
				next : "start"},
			{
				token: "string",
				regex : '.+'
			}
		],
		"variable": [
			{
				token: "variable.instance", // variable
				regex: "[a-zA-Z_\\d]+(?:[(][.a-zA-Z_\\d]+[)])?",
				next : "start"
			}, {
				token: "variable.instance", // with braces
				regex: "{?[.a-zA-Z_\\d]+}?",
				next: "start"
			}
		],
	};
};

oop.inherits(BosunHighlightRules, TextHighlightRules);

exports.BosunHighlightRules = BosunHighlightRules;
});

ace.define("ace/mode/bosun",["require","exports","module","ace/lib/oop","ace/mode/text","ace/mode/bosun_highlight_rules"], function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var BosunHighlightRules = require("./bosun_highlight_rules").BosunHighlightRules;

var Mode = function() {
	this.HighlightRules = BosunHighlightRules;
};

oop.inherits(Mode, TextMode);

(function() {
	this.$id = "ace/mode/bosun";
}).call(Mode.prototype);

exports.Mode = Mode;
});
