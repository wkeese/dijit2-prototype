define([
	"dojo/_base/array", // array.forEach
	"dojo/_base/declare", // declare
	"dojo/_base/lang",	// lang.hitch()
	"dojo/parser" // parser.parse
], function(array, declare, lang, parser){

	// module:
	//		dijit/_WidgetsInTemplateMixin

	return declare("dijit._WidgetsInTemplateMixin", null, {
		// summary:
		//		Mixin to supplement _TemplatedMixin when template contains widgets

		// contextRequire: Function
		//		Used to provide a context require to the dojo/parser in order to be
		//		able to use relative MIDs (e.g. `./Widget`) in the widget's template.
		contextRequire: null,

		_beforeFillContent: function(){
			// Before copying over content, instantiate widgets in template
			var node = this.domNode;

			parser.parse(node, {
				noStart: true,
				template: true,
				inherited: {dir: this.dir, lang: this.lang, textDir: this.textDir},
				propsThis: this,	// so data-dojo-props of widgets in the template can reference "this" to refer to me
				contextRequire: this.contextRequire,
				scope: "dojo"	// even in multi-version mode templates use dojoType/data-dojo-type
			}).then(lang.hitch(this, function(widgets){
				this._startupWidgets = widgets;

				// _WidgetBase::destroy() will destroy any supporting widgets under this.domNode.
				// If we wanted to, we could call this.own() on anything in this._startupWidgets that was moved outside
				// of this.domNode (like Dialog, which is moved to <body>).
				this._attachTemplateNodes(widgets, function(n,p){
					return n[p];
				});
			}));

			if(!this._startupWidgets){
				throw new Error(this.declaredClass + ": parser returned unfilled promise (probably waiting for module auto-load), " +
					"unsupported by _WidgetsInTemplateMixin.   Must pre-load all supporting widgets before instantiation.");
			}
		},

		startup: function(){
			array.forEach(this._startupWidgets, function(w){
				if(w && !w._started && w.startup){
					w.startup();
				}
			});
			this._startupWidgets = null;
			this.inherited(arguments);
		}
	});
});
