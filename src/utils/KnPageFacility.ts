import { KnContextInfo } from "../models/KnCoreAlias";
import { KnPageSetting, KnHandler } from "@willsofts/will-db";
import { KnHeaderInfo, KnPagingInfo } from "../models/KnServAlias";
import { KnLabelConfig } from "../utils/KnLabelConfig";
import { KnPageUtility } from "../utils/KnPageUtility";
import { DISPLAY_VERSION_CONTROL, DISPLAY_PROGRAM_CONTROL, DISPLAY_FONT_CONTROL } from "./EnvironmentVariable";

const pageHandler = new KnHandler();

export class KnPageFacility extends KnPageUtility {
    public label?: KnLabelConfig;
    public handler?: KnHandler;
    public data?: any;
    public setting: KnPageSetting;

    constructor(progid: string, context: KnContextInfo, label?: KnLabelConfig, handler?: KnHandler, data?: any) {
        super(progid, context);
        this.label = label;
        this.handler = handler;
        this.data = data;        
        if(data?.dataset?.offsets) {
            this.setting = data?.dataset?.offsets;
        } else {
            this.setting = handler?handler.getPageSetting(context.params):pageHandler.getPageSetting(context.params);
        }
    }

    public createHeader(options: KnHeaderInfo) : string {
		let caption = this.context.params?.caption;
		if("false" == caption) {
			return "";
		}
        let displayID = options.pid.toUpperCase();
        let versionlabel = options.versionLabel ?? "View Version";
		let inclabel = options.increaseLabel ?? "Increase Font Size";
		let declabel = options.decreaseLabel ?? "Decrease Font Size";
		let addedOn = options.addon && options.addon.trim().length>0;
		let buf = "";
		buf += "<div class=\"header-layer\">\n";
		buf += "	<nav id=\"fsprogramcontrolbar\" class=\"navbar navbar-expand-sm navbar-top navbar-header-title\">\n";
		buf += "		<h1 class=\"page-header-title\" title=\""+options.pid.toLowerCase()+"\">\n";
		buf += "			<div class=\"navbar-header\"><label id=\"programheadertitle\">"+options.title+"</label></div>\n";
		buf += "		</h1>\n";
		if(DISPLAY_PROGRAM_CONTROL) {
			buf += "			<ul id=\"fsprogramcontrollayer\" class=\"navbar-nav navbar-right ml-auto program-control-layer\">\n";
			buf += "				<li class=\"dropdown user-dropdown\"><a href=\"javascript:void(0)\" id=\"fsprogramidlinker\" class=\"program-linker dropdown-toggle\" data-toggle=\"dropdown\"><span id=\"fsprogramid\">"+displayID+"</span>";
			if(DISPLAY_FONT_CONTROL) {
				buf += "<b class=\"caret\"></b>";
			}
			buf += "</a>\n";
			if(addedOn || DISPLAY_FONT_CONTROL || DISPLAY_VERSION_CONTROL) {
				buf += "					<ul class=\"dropdown-menu dropdown-menu-right\">\n";
				if(DISPLAY_FONT_CONTROL) {
					if(DISPLAY_VERSION_CONTROL) {
						buf += "						<li><a href=\"javascript:void(0)\" class=\"viewversion-linker\" onclick=\"viewVersion('"+options.pid+"')\"><i class=\"fa fa-info-circle fa-class\" aria-hidden=\"true\"></i>&nbsp;<span id=\"fsviewversion_label\">"+versionlabel+"</span></a></li>\n";
					}
					buf += "						<li><a href=\"javascript:void(0)\" class=\"increase-linker\" onclick=\"increaseFontSize()\"><i class=\"fa fa-plus-square fa-class\" aria-hidden=\"true\"></i>&nbsp;<span id=\"fsincreasefont_label\">"+inclabel+"</span></a></li>\n";
					buf += "						<li><a href=\"javascript:void(0)\" class=\"decrease-linker\" onclick=\"decreaseFontSize()\"><i class=\"fa fa-minus-square fa-class\" aria-hidden=\"true\"></i>&nbsp;<span id=\"fsdecreasefont_label\">"+declabel+"</span></a></li>\n";
				} else {
					if(DISPLAY_VERSION_CONTROL) {
						buf += "						<li><a href=\"javascript:void(0)\" class=\"viewversion-linker\" onclick=\"viewVersion('"+options.pid+"')\"><i class=\"fa fa-info-circle fa-class\" aria-hidden=\"true\"></i>&nbsp;<span id=\"fsviewversion_label\">"+versionlabel+"</span></a></li>\n";
					}
				}
				if(addedOn) {
					buf += "						"+options.addon;
				}
				buf += "					</ul>\n";
			}
			buf += "				</li>\n";
			buf += "			</ul>\n";
		}
		buf += "	</nav>\n";
		buf += "</div>\n";		
		return buf;
    }

    public buildPaging(options: KnPagingInfo = {jsFunction: "submitChapter",jsForm: "fschapterform", searchForm: "fssearchform"}) : string {
        let fsRows = options.totalRows;
        if(!fsRows) fsRows = this.setting.totalRows;
		let buf = "";
		let table = "<ul id=\"fspagertable\" class=\"page-table-class pagination pagination-sm\" >";
		let fsPageNumber = 0;
		let fsPageNo = 0;
		let fsTotalPage = 0;
		let fsPages = this.setting.page; 
		let fsChapters = this.setting.rowsPerPage;
		for(let i=0;i<fsRows;i+=fsChapters) {
			fsTotalPage++; 
		}
		let fsCounter = 0;
		let fsStartIdx = fsPages;
		let fsLimit = this.setting.limit;
		if(fsLimit<=0) {
			fsLimit = fsChapters;
		}
		while(fsStartIdx>fsLimit) {
			fsCounter++;
			fsStartIdx -= fsLimit;
		}
		let fsPreviousPage = fsCounter * fsLimit;
		if(fsLimit>0 && (fsPages>fsLimit)) {
			buf += table;
			buf += "<li class=\"page-item page-column-class\">";
			buf += "<A HREF=\"javascript:void(0);\" class=\"page-link pagenoclass\" onclick=\"if(this.disabled) return; ";
            buf += options.jsForm;
            buf += ".page.value='1'; ";
			if(options.searchForm) {
				buf += " try { ";
                buf += options.searchForm;
                buf += ".page.value='1'; }catch(ex){ } ";
			}
			if(options.jsFunction) {
				buf += options.jsFunction;
                buf += "(";
                buf += options.jsForm;
                buf += ",1);\">";
			} else {
				buf += options.jsForm;
                buf += ".submit();\">";
			}
			buf += "|&lt;</A>";
			buf += "</li>\n";
			buf += "<li class=\"page-item page-column-class\">";
			buf += "<A HREF=\"javascript:void(0);\" class=\"page-link pagenoclass\" onclick=\"if(this.disabled) return; ";
            buf += options.jsForm;
            buf += ".page.value='";
            buf += fsPreviousPage+"'; ";
			if(options.searchForm) {
				buf += " try { ";
                buf += options.searchForm;
                buf += ".page.value='";
                buf += fsPreviousPage+"'; }catch(ex){ } ";
			}
			if(options.jsFunction) {
				buf += options.jsFunction;
                buf += "(";
                buf += options.jsForm;
                buf += ","+fsPreviousPage+");\">";
			} else {
				buf += options.jsForm;
                buf += ".submit();\">";
			}
			buf += "&lt;&lt;</A>";
			buf += "</li>\n";
			table = "";			
		}
		for(let i=0;i<fsRows;i+=fsChapters) {
			fsPageNumber++;
			if(fsLimit>0) {
				if(fsPageNumber <= fsPreviousPage) { continue; }
				fsPageNo++;
				if(fsLimit<fsPageNo) {
					fsPageNumber = fsPageNumber + fsLimit - 1;
					if(fsPageNumber>fsTotalPage) {
						fsPageNumber = fsTotalPage;
					}
					buf += table;
					buf += "<li class=\"page-item page-column-class\">";
					buf += "<A HREF=\"javascript:void(0);\" class=\"page-link pagenoclass\" onclick=\"if(this.disabled) return; ";
                    buf += options.jsForm;
                    buf += ".page.value='";
                    buf += fsPageNumber+"'; ";
					if(options.searchForm) {
						buf += " try { ";
                        buf += options.searchForm;
                        buf += ".page.value='";
                        buf += fsPageNumber+"'; }catch(ex){ } ";
					}
					if(options.jsFunction) {
						buf += options.jsFunction;
                        buf += "(";
                        buf += options.jsForm;
                        buf += ","+fsPageNumber+");\">";
					} else {
						buf += options.jsForm;
                        buf += ".submit();\">";
					}
					buf += "&gt;&gt;</A>";
					buf += "</li>\n";
					table = "";
					break;
				}
			}
			let fsStyle = "";
			let fsSelected = "";
			if(fsPages==fsPageNumber ||(fsPageNumber==1 && fsPages==0)) {
				fsStyle = "style='text-decoration:underline;'";
				fsSelected = "pageselectedclass active";
			}
			buf += table;
			buf += "<li class=\"page-item page-column-class ";
            buf += fsSelected+"\">";
			buf += "<A HREF=\"javascript:void(0);\" ";
            buf += fsStyle;
            buf += " class=\"page-link pagenoclass ";
            buf += fsSelected;
            buf += "\" onclick=\"if(this.disabled) return; ";
            buf += options.jsForm;
            buf += ".page.value='";
            buf += fsPageNumber+"'; ";
			if(options.searchForm) {
				buf += " try { ";
                buf += options.searchForm;
                buf += ".page.value='";
                buf += fsPageNumber+"'; }catch(ex){ } ";
			}
			if(options.jsFunction) {
				buf += options.jsFunction;
                buf += "(";
                buf += options.jsForm;
                buf += ","+fsPageNumber+");\">";
			} else {
				buf += options.jsForm;
                buf += ".submit();\">";
			}
			buf += fsPageNumber+"</A>";
			buf += "</li>\n";
			table = "";
		}
		if(fsLimit<fsPageNo) {
			fsPageNumber = 0;
			for(let i=0;i<fsRows;i+=fsChapters) {
				fsPageNumber++; 
			}
			buf += table;
			buf += "<li class=\"page-item page-column-class\">";
			buf += "<A HREF=\"javascript:void(0);\" class=\"page-link pagenoclass\" onclick=\"if(this.disabled) return; ";
            buf += options.jsForm;
            buf += ".page.value='";
            buf += fsPageNumber+"'; ";
			if(options.searchForm) {
				buf += " try { ";
                buf += options.searchForm;
                buf += ".page.value='";
                buf += fsPageNumber+"'; }catch(ex){ } ";
			}
			if(options.jsFunction) {
				buf += options.jsFunction;
                buf += "(";
                buf += options.jsForm;
                buf += ","+fsPageNumber+");\">";
			} else {
				buf += options.jsForm;
                buf += ".submit();\">";
			}
			buf += "&gt;|</A>";
			buf += "</li>\n";
			table = "";
		}	
		if(buf.length>0) {
			buf += "</ul>";
		}
		return buf;
    }

    public createPaging(options: KnPagingInfo = {jsFunction: "submitChapter",jsForm: "fschapterform", searchForm: "fssearchform"}) : string {
        if(this.hasPaging(options.totalRows)) {
            return this.buildPaging(options);
        }
        return "";
    }
    
    public hasPaging(rows?: number) : boolean {
        if(!rows) rows = this.setting.totalRows;
        let chapter = this.setting.rowsPerPage;
        return (chapter > 0) && (rows > chapter);
    }

    public recordsOffset() : number {
        let page = this.setting.page - 1;
        let chapter = this.setting.rowsPerPage;
        if(page>0) return page*chapter;
        return 0;
    }

    public recordsNumber(seqno: number) : number {
        return seqno + this.recordsOffset();
    }

	public isInsertMode(mode?: string) : boolean {
		if(!mode) mode = this.data?.action;
        return super.isInsertMode(mode);
    }

	public isUpdateMode(mode?: string) : boolean {
		if(!mode) mode = this.data?.action;
        return super.isUpdateMode(mode);
    }

	public isRetrieveMode(mode?: string) : boolean {
		if(!mode) mode = this.data?.action;
        return super.isRetrieveMode(mode);
    }

	public invertOrder() : string {
		if(this.setting?.orderDir) {
			let order = this.setting.orderDir.toUpperCase();
			return "ASC"==order?"DESC":"ASC";			
		}
		return "ASC";
	}
	
}
