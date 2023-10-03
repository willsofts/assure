/**
 * jquery.xslt.js
 * jQuery client-side XSLT plugins.
 * 
 */
(function($) {
    $.fn.xslt = function() {
        return this;
    }
	$.transform = function(xmldoc,xsldoc) {
		if (document.recalc) { // IE 5+
			return xmldoc.transformNode(xsldoc);
		} else if (window.ActiveXObject || "ActiveXObject" in window) {
			return xmldoc.transformNode(xsldoc);
		} else if (window.DOMParser != undefined && window.XMLHttpRequest != undefined && window.XSLTProcessor != undefined) { // Mozilla 0.9.4+, Opera 9+
			var processor = new XSLTProcessor();
			if ($.isFunction(processor.transformDocument)) {
				support = window.XMLSerializer != undefined;
				if(support) { 
					resultDoc = document.implementation.createDocument("", "", null);
					processor.transformDocument(xmldoc, xsldoc, resultDoc, null);
					strDoc = new XMLSerializer().serializeToString(resultDoc);
					return strDoc;
				}
			} else {
				processor.importStylesheet(xsldoc);
				resultDoc = processor.transformToFragment(xmldoc, document);
				return resultDoc;
			} 
		}
		return "";
	}
    var str = /^\s*</;
    if (document.recalc || (window.ActiveXObject || "ActiveXObject" in window)) { 
        $.fn.xslt = function(xml, xslt,xmlsettings,xslsettings,afterTransform) {
            var target = $(this);
            var transformed = false;
            var xm = {
					readyState: 4
            };
            var xs = {
                  readyState: 4
            };                
            var change = function() {
				if (xm.readyState == 4 && xs.readyState == 4  && !transformed) {
					var text = $.transform(xm.responseXML,xs.responseXML);
					target.html(text);
					transformed = true;
					if(afterTransform) afterTransform();
				}				
            };
			var isChange = false;
			var isXmlStr = str.test(xml);
			var isXslStr = str.test(xslt);
            if (isXmlStr) {
				xm.responseXML = $.parseXML(xml);  //jQuery 1.5 support xml string to DOM
				isChange = true;
            } 
			if (isXslStr) {
				xs.responseXML = $.parseXML(xslt); //jQuery 1.5 support xml string to DOM
				if(isChange) change();
				isChange = true;
			}						
			if(!isXmlStr) {
				var p = $.extend({},{ 
					dataType: "xml", 
					url: xml,
					cache : false,
					error : function(xhr,status,errorThrown) { 
							alert(errorThrown);
					},
					success : function(data,status,xhr) { 
						//xm.responseXML = data;
						xm.responseXML = $.parseXML($.trim(xhr.responseText));
						if(isChange) change();
						isChange = true;
					}
				},xmlsettings||{});
				xm = $.ajax(p);
			}
			if(!isXslStr) {
				var p = $.extend({},{ 
					dataType: "xml", 
					url: xslt, 
					cache : false,
					error : function(xhr,status,errorThrown) { 
							alert(errorThrown);
					},
					success : function(data,status,xhr) { 
						//xs.responseXML = data;
						xs.responseXML = $.parseXML($.trim(xhr.responseText));
						if(isChange) change();
						isChange = true;
					}
				}, xslsettings||{});	
				xs = $.ajax(p);
			}
            return this;
       };
    }
    else if (window.DOMParser != undefined && window.XMLHttpRequest != undefined && window.XSLTProcessor != undefined) { // Mozilla 0.9.4+, Opera 9+
       var processor = new XSLTProcessor();
       var support = false;
       if ($.isFunction(processor.transformDocument)) {
           support = window.XMLSerializer != undefined;
       } else {
           support = true;
       }
       if (support) {
            $.fn.xslt = function(xml, xslt,xmlsettings,xslsettings,afterTransform) {
                var target = $(this);
                var transformed = false;
                var xm = {
                    readyState: 4
                };
                var xs = {
                    readyState: 4
                };
                var change = function() {
                    if (xm.readyState == 4 && xs.readyState == 4  && !transformed) {
						target.html($.transform(xm.responseXML,xs.responseXML));
                        transformed = true;
						if(afterTransform) afterTransform();
                    }
                };
				var isChange = false;
				var isXmlStr = str.test(xml);
				var isXslStr = str.test(xslt);
				if (isXmlStr) {
					//xm.responseXML = new DOMParser().parseFromString(xml, "text/xml");
					xm.responseXML = $.parseXML(xml);  //jQuery 1.5 support xml string to DOM
					isChange = true;
				} 
				if (isXslStr) {
					//xs.responseXML = new DOMParser().parseFromString(xslt, "text/xml");
					xs.responseXML = $.parseXML(xslt); //jQuery 1.5 support xml string to DOM
					if(isChange) change();
					isChange = true;
				}						
				if(!isXmlStr) {
					var p = $.extend({},{ 
						dataType: "xml", 
						url: xml,
						cache : false,
						error : function(xhr,status,errorThrown) { 
							alert(errorThrown);
						},
						success : function(data,status,xhr) { 
							xm.responseXML = data;
							if(isChange) change();
							isChange = true;
						}
					},xmlsettings||{});
					xm = $.ajax(p);
				}
				if(!isXslStr) {
					var p = $.extend({},{ 
						dataType: "xml", 
						url: xslt, 
						cache : false,
						error : function(xhr,status,errorThrown) { 
							alert(errorThrown);
						},
						success : function(data,status,xhr) { 
							xs.responseXML = data;
							if(isChange) change();
							isChange = true;
						}
					}, xslsettings||{});	
					xs = $.ajax(p);
				}
                return this;
            };
       }
    }
})(jQuery);
