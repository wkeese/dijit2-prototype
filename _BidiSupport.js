define(["./_WidgetBase","dojo/sniff"], function(_WidgetBase, has){

	// module:
	//		dijit/_BidiSupport

	/*=====
	return function(){
		// summary:
		//		Module that deals with BIDI, special with the auto
		//		direction if needed without changing the GUI direction.
		//		Including this module will extend _WidgetBase with BIDI related methods.
		// description:
		//		There's a special need for displaying BIDI text in rtl direction
		//		in ltr GUI, sometimes needed auto support.
		//		In creation of widget, if it's want to activate this class,
		//		the widget should define the "textDir".
	};
	=====*/

	_WidgetBase.extend({

		getTextDir: function(/*String*/ text){
			// summary:
			//		Gets the right direction of text.
			// description:
			//		If textDir is ltr or rtl returns the value.
			//		If it's auto, calls to another function that responsible
			//		for checking the value, and defining the direction.
			// tags:
			//		protected.
			return this.textDir == "auto" ? this._checkContextual(text) : this.textDir;
		},

		_checkContextual: function(text){
			// summary:
			//		Finds the first strong (directional) character, return ltr if isLatin
			//		or rtl if isBidiChar.
			// tags:
			//		private.

			// look for strong (directional) characters
			var fdc = /[A-Za-z\u05d0-\u065f\u066a-\u06ef\u06fa-\u07ff\ufb1d-\ufdff\ufe70-\ufefc]/.exec(text);
			// if found return the direction that defined by the character, else return widgets dir as defult.
			return fdc ? ( fdc[0] <= 'z' ? "ltr" : "rtl" ) : this.dir ? this.dir : this.isLeftToRight() ? "ltr" : "rtl";
		},

		applyTextDir: function(/*DOMNode*/ element, /*String?*/ text){
			// summary:
			//		Set element.dir according to this.textDir
			// element:
			//		The text element to be set. Should have dir property.
			// text:
			//		If specified, and this.textDir is "auto", for calculating the right transformation
			//		Otherwise text read from element.
			// description:
			//		If textDir is ltr or rtl returns the value.
			//		If it's auto, calls to another function that responsible
			//		for checking the value, and defining the direction.
			// tags:
			//		protected.

			var textDir = this.textDir;
			if(textDir == "auto"){
				if(typeof text === "undefined"){
					// text not specified, get text from node
					text = node.tagName.toLowerCase() == "input" ? node.value :
						node.innerText || node.textContent || "";
				}
				textDir = this._checkContextual(text);
			}

			// update only when there's a difference
			if(element.dir != textDir){
				element.dir = textDir;
			}
		},

		enforceTextDirWithUcc: function(option, text){
			// summary:
			//		Wraps by UCC (Unicode control characters) option's text according to this.textDir
			// option:
			//		The element (`<option>`) we wrapping the text for.
			// text:
			//		The text to be wrapped.
			// description:
			//		There's a dir problem with some HTML elements. For some elements (e.g. `<option>`, `<select>`)
			//		defining the dir in different direction then the GUI orientation, won't display correctly. 
			//		FF 3.6 will change the alignment of the text in option - this doesn't follow the bidi standards (static text
			//		should be aligned following GUI direction). IE8 and Opera11.10 completely ignore dir setting for `<option>`.
			//		Therefore the only solution is to use UCC (Unicode  control characters) to display the text in correct orientation.
			//		This function saves the original text value for later restoration if needed, for example if the textDir will change etc.
			if(this.textDir){
				if(option) {			
					option.originalText = text;
				}				
				var dir = this.textDir == "auto" ? this._checkContextual(text) : this.textDir;
				return (dir == "ltr" ? bidi_const.LRE : bidi_const.RLE ) + text + bidi_const.PDF;
			}
			return text;
		},
		restoreOriginalText: function(origObj){
			// summary:
			//		Restores the text of origObj, if needed, after enforceTextDirWithUcc, e.g. set("textDir", textDir).
			// origObj:
			//		The element (`<option>`) to restore.
			// description:
			//		Sets the text of origObj to origObj.originalText, which is the original text, without the UCCs.
			//		The function than removes the originalText from origObj!
			if(origObj.originalText){
				origObj.text = origObj.originalText;
				delete origObj.originalText;
			}
			return origObj;
		},
		
		_setTextDirAttr: function(/*String*/ textDir){
				// summary:
				//		Setter for textDir.
				// description:
				//		Users shouldn't call this function; they should be calling
				//		set('textDir', value)
			if(!this._created || this.textDir != textDir){ 
				this._set("textDir", textDir);			
				var node = null;
				if(this.displayNode) {			
					node = this.displayNode || this.textbox;
					value = has("ie") ? this.displayNode.innerText : this.displayNode.textContent;
					this.displayNode.align = this.dir == "rtl" ? "right" : "left";
				}else if(this.textbox) {
					node = this.textbox;
					value = this.textbox.value				
				}			
				if(node){
					this.applyTextDir(node, value);	
				}
			}			
		}
	});

	// UCC - constants that will be used by bidi support.
	var bidi_const = {
		LRM : '\u200E',
		LRE : '\u202A',
		PDF : '\u202C',
		RLM : '\u200f',
		RLE : '\u202B'
	};
	return _WidgetBase;
});
