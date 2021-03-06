define([
	"dojo/_base/declare",	// declare
	"dojo/sniff",			// has("dijit-legacy-requires"), has("win8app")
	"dojo/_base/kernel",	// kernel.deprecated
	"../_WidgetBase",
	"../_CssStateMixin",
	"../_TemplatedMixin",
	"./_FormWidgetMixin"
], function(declare, has, kernel, _WidgetBase, _CssStateMixin, _TemplatedMixin, _FormWidgetMixin){


// module:
//		dijit/form/_FormWidget

return declare("dijit.form._FormWidget", [_WidgetBase, _TemplatedMixin, _CssStateMixin, _FormWidgetMixin], {
	// summary:
	//		Base class for widgets corresponding to native HTML elements such as `<checkbox>` or `<button>`,
	//		which can be children of a `<form>` node or a `dijit/form/Form` widget.
	//
	// description:
	//		Represents a single HTML element.
	//		All these widgets should have these attributes just like native HTML input elements.
	//		You can set them during widget construction or afterwards, via `dijit/_WidgetBase.set()`.
	//
	//		They also share some common methods.

	setDisabled: function(/*Boolean*/ disabled){
		// summary:
		//		Deprecated.  Use set('disabled', ...) instead.
		kernel.deprecated("setDisabled("+disabled+") is deprecated. Use set('disabled',"+disabled+") instead.", "", "2.0");
		this.set('disabled', disabled);
	},

	setValue: function(/*String*/ value){
		// summary:
		//		Deprecated.  Use set('value', ...) instead.
		kernel.deprecated("dijit.form._FormWidget:setValue("+value+") is deprecated.  Use set('value',"+value+") instead.", "", "2.0");
		this.set('value', value);
	},

	getValue: function(){
		// summary:
		//		Deprecated.  Use get('value') instead.
		kernel.deprecated(this.declaredClass+"::getValue() is deprecated. Use get('value') instead.", "", "2.0");
		return this.get('value');
	},

	postMixInProperties: function(){
		// Setup name=foo string to be referenced from the template (but only if a name has been specified).
		// Unfortunately we can't use _setNameAttr to set the name in IE due to IE limitations, see #8484, #8660.
		// But when IE6 and IE7 are desupported, then we probably don't need this anymore, so should remove it in 2.0.
		// Also, don't do this for Windows 8 Store Apps because it causes a security exception (see #16452).
		// Regarding escaping, see heading "Attribute values" in
		// http://www.w3.org/TR/REC-html40/appendix/notes.html#h-B.3.2
		this.nameAttrSetting = (this.name && !has("win8app")) ? ('name="' + this.name.replace(/"/g, "&quot;") + '"') : '';
		this.inherited(arguments);
	},

	// Override automatic assigning type --> focusNode, it causes exception on IE.
	// Instead, type must be specified as ${type} in the template, as part of the original DOM
	_setTypeAttr: null
});

});
