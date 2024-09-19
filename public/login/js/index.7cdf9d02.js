/******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 6802:
/***/ (function(__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) {

"use strict";

// EXTERNAL MODULE: ./node_modules/jquery/dist/jquery.js
var jquery = __webpack_require__(6587);
var jquery_default = /*#__PURE__*/__webpack_require__.n(jquery);
// EXTERNAL MODULE: ./node_modules/jquery-ui-dist/jquery-ui.js
var jquery_ui = __webpack_require__(9827);
// EXTERNAL MODULE: ./node_modules/bootstrap/dist/js/bootstrap.js
var bootstrap = __webpack_require__(5707);
// EXTERNAL MODULE: ./node_modules/bootbox/bootbox.js
var bootbox = __webpack_require__(954);
;// CONCATENATED MODULE: ./src/assets/json/program_message.json
var program_message_namespaceObject = /*#__PURE__*/JSON.parse('[{"code":"QS0001","TH":"คุณต้องการลบรายการนี้ใช่หรือไม่ %s","EN":"Do you want to delete this transaction? %s"},{"code":"QS0002","TH":"คุณต้องการบันทึกรายการนี้ใช่หรือไม่","EN":"Do you want to save this transaction?"},{"code":"QS0003","TH":"คุณต้องการยกเลิกรายการนี้ใช่หรือไม่","EN":"Do you want to cancel this transaction?"},{"code":"QS0004","TH":"บันทึกรายการเรียบร้อยแล้ว %s","EN":"Process Success %s"},{"code":"QS0005","TH":"ท่านต้องการลบรายการนี้ใช่หรือไม่ %s","EN":"Do you want to delete this record? %s"},{"code":"QS0006","TH":"คุณต้องการส่งรายการนี้ใช่หรือไม่","EN":"Do you want to send this transaction?"},{"code":"QS0007","TH":"คุณต้องการปรับปรุงรายการนี้ใช่หรือไม่","EN":"Do you want to update this transaction?"},{"code":"QS0008","TH":"คุณต้องการล้างรายการนี้ใช่หรือไม่","EN":"Do you want to clear this?"},{"code":"QS0009","TH":"คุณต้องการดำเนินการ รายการนี้ใช่หรือไม่","EN":"Do you want to process this transaction?"},{"code":"QS0010","TH":"คุณต้องการบันทึกเป็นรายการนี้ใช่หรือไม่","EN":"Do you want to save as this transaction ?"},{"code":"QS0011","TH":"คุณต้องการยืนยันการรับรายการนี้ใช่หรือไม่","EN":"Do you want to receive this transaction?"},{"code":"QS0012","TH":"คุณต้องการล้างและเริ่มใหม่รายการนี้ใช่หรือไม่","EN":"Do you want to reset this transaction?"},{"code":"QS0013","TH":"คุณต้องการลบ %s รายการใช่หรือไม่","EN":"Do you want to delete %s row(s)?"},{"code":"QS0014","TH":"คุณต้องการยืนยันการอนุมัติ  %s รายการนี้ใช่หรือไม่","EN":"Are you sure to confirm approve the %s request?"},{"code":"QS0015","TH":"คุณต้องการยืนยันการปฏิเสธ  %s รายการนี้ใช่หรือไม่","EN":"Are you sure to reject %s?"},{"code":"QS0016","TH":"คุณต้องการยืนยันการสร้างใบคำร้องใช่หรือไม่","EN":"Do you want to create this request?"},{"code":"QS0017","TH":"คุณต้องการนำเข้ารายการนี้ใช่หรือไม่","EN":"Do you want to import this transaction?"},{"code":"QS0018","TH":"คุณต้องการนำออกรายการนี้ใช่หรือไม่","EN":"Do you want to export this transaction?"},{"code":"QS0019","TH":"คุณต้องการส่งรายการนี้ใหม่ใช่หรือไม่?","EN":"Do you want to resend this transaction?"},{"code":"QS0020","TH":"คุณต้องการยืนยันการแก้ไขใหม่  %s รายการนี้ใช่หรือไม่","EN":"Are you sure to revise %s?"},{"code":"fsconfirmbtn","TH":"ตกลง","EN":"OK"},{"code":"fscancelbtn","TH":"ยกเลิก","EN":"Cancel"},{"code":"fssavebtn","TH":"บันทึก","EN":"Save"},{"code":"fsclosebtn","TH":"ปิด","EN":"Close"},{"code":"fsokbtn","TH":"ตกลง","EN":"OK"},{"code":"fsmessagetitle","TH":"ข้อความ","EN":"Message"},{"code":"fsaccepttitle","TH":"ยืนยัน","EN":"Confirm"},{"code":"fssuccessmsg","TH":"การดำเนินการสำเร็จ","EN":"Process success"},{"code":"fsfailmsg","TH":"การดำเนินการไม่สำเร็จ","EN":"Process fail"},{"code":"fsalert","TH":"คำเตือน","EN":"Alert"},{"code":"fswarn","TH":"คำเตือน","EN":"Warning"},{"code":"fsconfirm","TH":"ยืนยัน","EN":"Confirmation"},{"code":"fsinfo","TH":"ข้อความ","EN":"Information"},{"code":"QS8021","TH":"ท่านไม่มีสิทธิ์ดูรายการนี้","EN":"No permission to retrieve this transaction"},{"code":"QS8022","TH":"ท่านไม่มีสิทธิ์แก้ไขรายการนี้","EN":"No permission to edit this transaction"},{"code":"QS8023","TH":"ท่านไม่มีสิทธิ์ลบรายการนี้","EN":"No permission to delete this transaction"},{"code":"QS8024","TH":"ท่านไม่มีสิทธิ์สร้างรายการนี้","EN":"No permission to add this transaction"},{"code":"QS8025","TH":"ท่านไม่มีสิทธิ์นำเข้ารายการนี้","EN":"No permission to import this transaction"},{"code":"QS8026","TH":"ท่านไม่มีสิทธิ์นำออกรายการนี้","EN":"No permission to export this transaction"},{"code":"QS0101","TH":"ไม่พบข้อมูลที่ต้องการ โปรดกรุณาระบุและค้นหาใหม่","EN":"Record not found"},{"code":"QS0102","TH":"นำเข้าข้อมูลไม่ถูกต้อง","EN":"Invalid input"},{"code":"QS0103","TH":"ข้อมูลไม่ได้ระบุ","EN":"Value is undefined"},{"code":"QS0104","TH":"ปรับปรุงข้อมูลเรียบร้อย","EN":"Update success"},{"code":"QS0105","TH":"นำเข้าข้อมูลซ้ำซ้อน","EN":"Duplicate record"},{"code":"QS0201","TH":"Reset password success, Please verify your email for new password changed","EN":"Reset password success, Please verify your email for new password changed"},{"code":"QS0202","TH":"Reset Two Factor Success","EN":"Reset Two Factor Success"}]');
;// CONCATENATED MODULE: ./src/assets/json/default_label.json
var default_label_namespaceObject = /*#__PURE__*/JSON.parse('[{"language":"TH","label":[{"name":"english_lang","value":"อังกฤษ"},{"name":"thai_lang","value":"ไทย"},{"name":"title_new","value":"สร้างใหม่"},{"name":"title_edit","value":"แก้ไข"},{"name":"title_view","value":"มอง"},{"name":"save_button","value":"บันทึก"},{"name":"delete_button","value":"ลบ"},{"name":"retrieve_button","value":"เรียกดู"},{"name":"search_button","value":"ค้นหา"},{"name":"saveas_button","value":"บันทึกเป็น"},{"name":"submit_button","value":"ส่งข้อมูล"},{"name":"cancel_button","value":"ยกเลิก"},{"name":"clear_button","value":"ล้าง"},{"name":"reset_button","value":"ล้าง"},{"name":"update_button","value":"ปรับปรุง"},{"name":"close_button","value":"ปิด"},{"name":"send_button","value":"ส่ง"},{"name":"complete_button","value":"สำเร็จ"},{"name":"download_button","value":"ดาวน์โหลด"},{"name":"insert_button","value":"เพิ่ม"},{"name":"executebutton","value":"ปฏิบัติการ"},{"name":"ok_button","value":"ตกลง"},{"name":"import_button","value":"นำเข้า"},{"name":"export_button","value":"นำออก"},{"name":"remove_button","value":"ลบ"},{"name":"upload_button","value":"อัพโหลด"},{"name":"consend_button","value":"ส่งแบบสอบถาม"},{"name":"version_label","value":"รุ่น"},{"name":"action_label","value":" "},{"name":"active_label","value":"ใช้งาน"},{"name":"inactive_label","value":"ไม่ใช้งาน"},{"name":"all_label","value":"ทั้งหมด"},{"name":"seqno_label","value":"ลำดับที่"},{"name":"page_notfound","value":"ไม่พบหน้าใช้งาน"},{"name":"record_notfound","value":"ไม่พบรายการ"},{"name":"trx_notfound","value":"ไม่พบรายการ"},{"name":"invalid_alert","value":"กรอกข้อมูลไม่ถูกต้อง"},{"name":"empty_alert","value":"กรุณากรอกข้อมูล"},{"name":"email_alert","value":"อีเมลไม่ถูกต้อง"}]},{"language":"EN","label":[{"name":"english_lang","value":"English"},{"name":"thai_lang","value":"Thai"},{"name":"title_new","value":"Add New"},{"name":"title_edit","value":"Edit"},{"name":"title_view","value":"View"},{"name":"save_button","value":"Save"},{"name":"delete_button","value":"Delete"},{"name":"retrieve_button","value":"Retrieve"},{"name":"search_button","value":"Search"},{"name":"saveas_button","value":"Save As"},{"name":"submit_button","value":"Submit"},{"name":"cancel_button","value":"Cancel"},{"name":"clear_button","value":"Clear"},{"name":"reset_button","value":"Clear"},{"name":"close_button","value":"Close"},{"name":"update_button","value":"Update"},{"name":"send_button","value":"Send"},{"name":"complete_button","value":"Complete"},{"name":"download_button","value":"Down Load"},{"name":"insert_button","value":"Insert"},{"name":"execute_button","value":"Execute"},{"name":"ok_button","value":"OK"},{"name":"import_button","value":"Import"},{"name":"export_button","value":"Export"},{"name":"remove_button","value":"Remove"},{"name":"upload_button","value":"Upload"},{"name":"consend_button","value":"Send"},{"name":"version_label","value":"Version"},{"name":"action_label","value":" "},{"name":"active_label","value":"Active"},{"name":"inactive_label","value":"Inactive"},{"name":"all_label","value":"All"},{"name":"seqno_label","value":"No."},{"name":"page_notfound","value":"Page not found"},{"name":"record_notfound","value":"Record not found"},{"name":"trx_notfound","value":"Transaction not found"},{"name":"invalid_alert","value":"Invalid input"},{"name":"empty_alert","value":"This cannot be empty"},{"name":"email_alert","value":"Invalid email address"}]}]');
;// CONCATENATED MODULE: ./src/assets/json/program_label.json
var program_label_namespaceObject = /*#__PURE__*/JSON.parse('[{"language":"TH","label":[{"name":"system_label","value":"Assure"},{"name":"login_label","value":"ยินดีต้อนรับ"},{"name":"username_label","value":"บัญชีผู้ใช้"},{"name":"password_label","value":"รหัสผ่าน"},{"name":"forgot_label","value":"ลืมรหัสผ่าน"},{"name":"signin_label","value":"เข้าสู่ระบบ"},{"name":"profile_label","value":"ข้อมูลส่วนตัว"},{"name":"changepwd_label","value":"เปลี่ยนรหัสผ่าน"},{"name":"logout_label","value":"ออกจากระบบ"},{"name":"profile_caption","value":"ข้อมูลส่วนตัว"},{"name":"profilenotfound_label","value":"ไม่พบข้อมูลผู้ใช้งาน"},{"name":"usertname_label","value":"ชื่อ(ไทย)"},{"name":"usertsurname_label","value":"นามสกุล(ไทย)"},{"name":"userename_label","value":"ชื่อ(อังกฤษ)"},{"name":"useresurname_label","value":"นามสกุล(อังกฤษ)"},{"name":"displayname_label","value":"ชื่อที่ใช้แสดง"},{"name":"email_label","value":"อีเมล"},{"name":"mobile_label","value":"โทรศัพท์"},{"name":"lineid_label","value":"ไอดีไลน์"},{"name":"langcode_label","value":"แสดงภาษา"},{"name":"changepassword_caption","value":"เปลี่ยนรหัสผ่าน"},{"name":"oldpassword_label","value":"รหัสผ่านเก่า"},{"name":"userpassword_label","value":"รหัสผ่านใหม่"},{"name":"confirmpassword_label","value":"ยืนยันรหัสผ่าน"},{"name":"matchpassword_alert","value":"รหัสผ่านใหม่กับยืนยันรหัสผ่านไม่ตรงกัน"},{"name":"passwordforce_label","value":"ระบบบังคับให้ท่านต้องทำการเปลี่ยนรหัสผ่านใหม่ โปรดระบุรหัสผ่านใหม่ของท่าน"},{"name":"passwordexpire_label","value":"รหัสผ่านของท่านหมดอายุการใช้งาน โปรดระบุรหัสผ่านใหม่ของท่าน"},{"name":"forgot_caption","value":"ลืมรหัสผ่าน"},{"name":"securecode_label","value":"คำตอบลับจากภาพ"},{"name":"resetpwd_label","value":"การตั้งรหัสผ่านใหม่สำเร็จ"},{"name":"requestmsg_label","value":"โปรดตรวจสอบ  ระบบได้ส่งการยืนยันคำร้องไปยังอีเมล์ของท่าน"},{"name":"resetmsg_label","value":"โปรดตรวจสอบ  ระบบได้ส่งรหัสผ่านใหม่ไปยังอีเมล์ของท่าน"},{"name":"requestpwd_label","value":"คำร้องการขอตั้งรหัสผ่านใหม่สำเร็จ"},{"name":"resetlogin_label","value":"เข้าสู่ระบบ"},{"name":"securecode_info","value":"โปรดระบุผลลัพธ์จากการบวกเลขทั้งสองจำนวนตามภาพที่กำหนด"},{"name":"forgotpassword_info","value":"โปรดระบุรหัสผู้ใช้งานกับที่อยู่อีเมล์พร้อมรหัสลับจากภาพที่กำหนด"},{"name":"factor_caption","value":"การตรวจสอบ"},{"name":"factor_label","value":"เพิ่ม 2FA"},{"name":"factorcode_label","value":"รหัสตรวจสอบ"},{"name":"submit_button","value":"ยอมรับ"},{"name":"sso_label","value":"ลงชื่อเข้าใช้ระบบแบบครั้งเดียว"}]},{"language":"EN","label":[{"name":"system_label","value":"Assure"},{"name":"login_label","value":"Welcome"},{"name":"username_label","value":"User name"},{"name":"password_label","value":"Password"},{"name":"forgot_label","value":"Forgot Password"},{"name":"signin_label","value":"Sign In"},{"name":"profile_label","value":"Profile"},{"name":"changepwd_label","value":"Change Password"},{"name":"logout_label","value":"Log Out"},{"name":"profile_caption","value":"User Profile"},{"name":"profilenotfound_label","value":"Profile not found"},{"name":"usertname_label","value":"First Name(Thai)"},{"name":"usertsurname_label","value":"Last Name(Thai)"},{"name":"userename_label","value":"First Name(English)"},{"name":"useresurname_label","value":"Last Name(English)"},{"name":"displayname_label","value":"Display Name"},{"name":"email_label","value":"Email"},{"name":"mobile_label","value":"Mobile"},{"name":"lineid_label","value":"Line ID"},{"name":"changepassword_caption","value":"Change Password"},{"name":"oldpassword_label","value":"Old Password"},{"name":"userpassword_label","value":"New Password"},{"name":"confirmpassword_label","value":"Confirm Password"},{"name":"matchpassword_alert","value":"New Password does not match to Confirm Password"},{"name":"passwordforce_label","value":"The system force you to change password, please specify your new password."},{"name":"passwordexpire_label","value":"Your password was expired, please specify your new password."},{"name":"forgot_caption","value":"Forgot Password"},{"name":"securecode_label","value":"Answer Code"},{"name":"resetpwd_label","value":"Reset password success"},{"name":"requestmsg_label","value":"Please verify your email for request and activation changed"},{"name":"resetmsg_label","value":"Please verify your email for new password changed"},{"name":"requestpwd_label","value":"Request reset password success"},{"name":"resetlogin_label","value":"Log In"},{"name":"securecode_info","value":"Please specify the result of two value operate from image"},{"name":"forgotpassword_info","value":"Please identify your email address with secure code from image"},{"name":"factor_caption","value":"Verification"},{"name":"factor_label","value":"Add 2FA"},{"name":"factorcode_label","value":"Verify Code"},{"name":"submit_button","value":"Submit"},{"name":"sso_label","value":"Login via Single Sign-On"}]}]');
// EXTERNAL MODULE: ./node_modules/@willsofts/will-app/index.js
var will_app = __webpack_require__(4122);
// EXTERNAL MODULE: ./node_modules/@vue/runtime-core/dist/runtime-core.esm-bundler.js
var runtime_core_esm_bundler = __webpack_require__(6768);
// EXTERNAL MODULE: ./node_modules/@vue/runtime-dom/dist/runtime-dom.esm-bundler.js
var runtime_dom_esm_bundler = __webpack_require__(5130);
;// CONCATENATED MODULE: ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/VueSure.vue?vue&type=template&id=df53abf2

const _hoisted_1 = /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", {
  id: "fswaitlayer",
  class: "fa fa-spinner fa-spin"
}, null, -1);
const _hoisted_2 = {
  id: "mainlayer",
  ref: "mainlayer"
};
const _hoisted_3 = {
  id: "forcelayer",
  ref: "forcelayer"
};
function render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_HeaderBar = (0,runtime_core_esm_bundler/* resolveComponent */.g2)("HeaderBar");
  const _component_LoginForm = (0,runtime_core_esm_bundler/* resolveComponent */.g2)("LoginForm");
  const _component_WorkerFrame = (0,runtime_core_esm_bundler/* resolveComponent */.g2)("WorkerFrame");
  return (0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)(runtime_core_esm_bundler/* Fragment */.FK, null, [_hoisted_1, (0,runtime_core_esm_bundler/* withDirectives */.bo)((0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", _hoisted_2, [(0,runtime_core_esm_bundler/* createVNode */.bF)(_component_HeaderBar, {
    ref: "headerBar",
    visible: $setup.menuVisible,
    labels: $setup.labels,
    onLanguageChanged: $options.changeLanguage,
    onMenuSelected: $options.menuSelected
  }, null, 8, ["visible", "labels", "onLanguageChanged", "onMenuSelected"]), (0,runtime_core_esm_bundler/* createVNode */.bF)(_component_LoginForm, {
    ref: "loginForm",
    visible: $setup.loginVisible,
    labels: $setup.labels,
    version: "v1.0.0",
    onSuccess: $options.loginSuccess,
    onForgot: $options.forgotPassword
  }, null, 8, ["visible", "labels", "onSuccess", "onForgot"]), (0,runtime_core_esm_bundler/* createVNode */.bF)(_component_WorkerFrame, {
    ref: "workerFrame",
    visible: $setup.workingVisible,
    labels: $setup.labels
  }, null, 8, ["visible", "labels"])], 512), [[runtime_dom_esm_bundler/* vShow */.aG, $setup.isShowing == true]]), (0,runtime_core_esm_bundler/* withDirectives */.bo)((0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", _hoisted_3, [((0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createBlock */.Wv)(runtime_core_esm_bundler/* KeepAlive */.PR, null, [((0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createBlock */.Wv)((0,runtime_core_esm_bundler/* resolveDynamicComponent */.$y)($setup.currentForcePage), {
    ref: "forceComponent",
    labels: $setup.labels,
    onActivated: $options.componentActivated,
    onSuccess: $options.processSuccess
  }, null, 40, ["labels", "onActivated", "onSuccess"]))], 1024))], 512), [[runtime_dom_esm_bundler/* vShow */.aG, $setup.isShowing == false]])], 64);
}
;// CONCATENATED MODULE: ./src/VueSure.vue?vue&type=template&id=df53abf2

// EXTERNAL MODULE: ./node_modules/@vue/reactivity/dist/reactivity.esm-bundler.js
var reactivity_esm_bundler = __webpack_require__(144);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.array.push.js
var es_array_push = __webpack_require__(4114);
;// CONCATENATED MODULE: ./src/assets/js/login.util.js







function openPage(app, accessor, favorite, callback) {
  return openProgram(app, accessor, favorite, callback);
}
const except_apps = ["page_profile", "page_change", "page_first", "page_login", "page_work", "page_forgot", "factor"];
function openProgram(app, accessor, favorite, callback) {
  console.log("openProgram:", app);
  let fs_newwindows = "1" == accessor?.info?.newflag;
  let appid = app.programid;
  let url = app.url;
  let params = app.parameters;
  let apath = app.progpath;
  let appurl = (0,will_app/* getBaseUrl */.$_)() + "/gui/" + appid;
  let html = false;
  if (apath && apath.trim().length > 0) {
    appurl = (0,will_app/* getBaseUrl */.$_)() + apath;
    html = apath.indexOf(".html") > 0;
  }
  if (url && url.trim().length > 0) {
    //appurl = getBaseUrl()+"/load/"+appid; 
    appurl = url + "/" + appid;
    if (apath && apath.trim().length > 0) {
      appurl = url + apath;
    }
  }
  console.log("openProgram: app url", appurl);
  let authtoken = (0,will_app/* getAccessorToken */.fD)();
  let awin;
  if (fs_newwindows) {
    awin = (0,will_app/* openNewWindow */.zL)({
      method: html ? "GET" : "POST",
      url: appurl,
      windowName: "fs_window_" + appid,
      params: "seed=" + Math.random() + "&authtoken=" + authtoken + "&language=" + (0,will_app/* getDefaultLanguage */.i5)() + (params ? "&" + params : "")
    });
    awin.focus();
  } else {
    jquery_default()("#pagecontainer").hide();
    jquery_default()("#workingframe").show();
    (0,will_app/* submitWindow */.P1)({
      method: html ? "GET" : "POST",
      url: appurl,
      windowName: "workingframe",
      params: "seed=" + Math.random() + "&authtoken=" + authtoken + "&language=" + (0,will_app/* getDefaultLanguage */.i5)() + (params ? "&" + params : "")
    });
    (0,will_app/* startWaiting */.eF)();
  }
  (0,will_app/* setCurrentWindow */._I)(awin);
  recentApplication(app, favorite);
  if (callback) callback(awin);
  return awin;
}
function recentApplication(app, favorite) {
  if (!favorite) return;
  let appid = app.programid;
  if (favorite.recentlists.length > 12) return;
  if (except_apps.some(item => item.programid == appid)) return;
  if (favorite.recentlists.some(item => item.programid == appid)) return;
  favorite.recentlists.push({
    ...app
  });
}
function hideWorkSpace() {
  jquery_default()("#workingframe").hide();
  window.open("./blank.html", "workingframe");
}
function hideWorkingFrame() {
  hideWorkSpace();
}
function forceLogout(info) {
  let useruuid = info?.useruuid;
  let authtoken = (0,will_app/* getAccessorToken */.fD)();
  console.log("useruuid=" + useruuid + ", authtoken=" + authtoken);
  jquery_default().ajax({
    url: (0,will_app/* getApiUrl */.e9)() + "/api/sign/signout",
    data: {
      useruuid: useruuid
    },
    headers: {
      "authtoken": authtoken
    },
    type: "POST"
  });
}
function logOut(info) {
  forceLogout(info);
  doLogout();
}
function doLogout() {
  (0,will_app/* removeAccessorInfo */.Or)();
  doLogin();
  clearAvatar();
  (0,will_app/* closeChildWindows */.Mx)();
}
function clearAvatar() {
  jquery_default()("#avatarimage").addClass("img-avatar");
}
function loggingIn() {
  hideWorkingFrame();
  jquery_default()("#page_login").show();
}
function doLogin() {
  loggingIn();
  hideWorkSpace();
  jquery_default()("#languagemenuitem").addClass("language-menu-item").show();
  jquery_default()("#recentmenulist").empty();
}
function refreshScreen() {
  jquery_default()(window).trigger("resize");
}
function validAccessToken(callback) {
  let json = (0,will_app/* getAccessorInfo */._M)();
  if (json && json.authtoken) {
    doAccessToken(json.authtoken, callback, json.info);
    return;
  }
  if (callback) callback(false);
}
function doAccessToken(token, callback, info) {
  if (token && token.trim().length > 0) {
    jquery_default().ajax({
      url: (0,will_app/* getApiUrl */.e9)() + "/api/sign/accesstoken",
      headers: {
        "authtoken": token
      },
      type: "POST",
      contentType: will_app/* DEFAULT_CONTENT_TYPE */.Xh,
      dataType: "html",
      error: function () {
        if (callback) callback(false);
      },
      success: function (data) {
        accessSuccess(data, callback, info);
      }
    });
    return;
  }
  if (callback) callback(false);
}
function accessSuccess(data, callback, info) {
  console.log("accessSuccess : ", data);
  try {
    let json = JSON.parse(data);
    if (json && json.head.errorflag == "N") {
      if (info) json.body.info = info;
      console.log("accessSuccess: body", json.body);
      (0,will_app/* saveAccessorInfo */.dz)(json.body);
      let accessToken = (0,will_app/* getStorage */.c7)("access_token");
      if (accessToken) (0,will_app/* setupDiffie */.LM)(json);
      (0,will_app/* removeStorage */.Od)("access_token");
      if (callback) callback(true, json);
      return;
    }
  } catch (ex) {
    console.error(ex);
  }
  if (callback) callback(false);
}
function verifyAfterLogin(json, callback, accessor, favorite) {
  $("#fsworkinglayer").addClass("working-control-class");
  if (json.body.factorverify && json.body.factorid != "" && (json.body.factorcode == undefined || json.body.factorcode == "")) {
    $("#fsworkinglayer").removeClass("working-control-class");
    openPage({
      programid: "factor",
      parameters: "factorid=" + json.body.factorid
    }, accessor, favorite);
  } else {
    if (json.body.changeflag && json.body.changeflag == "1") {
      $("#fsworkinglayer").removeClass("working-control-class");
      openPage({
        programid: "page_change",
        parameters: "changed=force"
      }, accessor, favorite);
    } else if (json.body.expireflag && json.body.expireflag == "1") {
      $("#fsworkinglayer").removeClass("working-control-class");
      openPage({
        programid: "page_change",
        parameters: "changed=expire"
      }, accessor, favorite);
    } else {
      doAfterLogin(json, callback);
    }
  }
}
function doAfterLogin(json, callback) {
  if (json) {
    let avatar = json.body.avatar;
    if (avatar && avatar.trim().length > 0) {
      $("#avatarimage").removeClass("img-avatar").attr("src", avatar);
    }
  }
  if (callback) callback();
}
function loadAppConfig() {
  fetch("app.config.json").then(response => response.json()).then(data => {
    console.log("app.config.json", data);
    if (data.API_URL !== undefined) (0,will_app/* setApiUrl */.My)(data.API_URL);
    if (data.BASE_URL !== undefined) (0,will_app/* setBaseUrl */.pf)(data.BASE_URL);
    if (data.CDN_URL !== undefined) (0,will_app/* setCdnUrl */.vi)(data.CDN_URL);
    if (data.IMG_URL !== undefined) (0,will_app/* setImgUrl */.bK)(data.IMG_URL);
    if (data.DEFAULT_LANGUAGE !== undefined) (0,will_app/* setDefaultLanguage */.Qq)(data.DEFAULT_LANGUAGE);
    if (data.API_TOKEN !== undefined) (0,will_app/* setApiToken */.at)(data.API_TOKEN);
    if (data.BASE_STORAGE !== undefined) (0,will_app/* setBaseStorage */.TM)(data.BASE_STORAGE);
    if (data.SECURE_STORAGE !== undefined) (0,will_app/* setSecureStorage */.Zl)(data.SECURE_STORAGE);
    if (data.BASE_CSS !== undefined) (0,will_app/* setBaseCss */.rX)(data.BASE_CSS);
    if (data.CHAT_URL !== undefined) (0,will_app/* setChatUrl */.eL)(data.CHAT_URL);
    if (data.DEFAULT_RAW_PARAMETERS !== undefined) (0,will_app/* setDefaultRawParameters */.Me)(data.DEFAULT_RAW_PARAMETERS);
    console.info("loadAppConfig: DEFAULT_LANGUAGE=" + (0,will_app/* getDefaultLanguage */.i5)(), ", BASE_STORAGE=" + (0,will_app/* getBaseStorage */.dh)(), ", DEFAULT_RAW_PARAMETERS=" + (0,will_app/* getDefaultRawParameters */.e1)(), ", SECURE_STORAGE=" + (0,will_app/* isSecureStorage */.zV)());
    console.info("loadAppConfig: API_URL=" + (0,will_app/* getApiUrl */.e9)(), ", BASE_URL=" + (0,will_app/* getBaseUrl */.$_)(), ", CDN_URL=" + (0,will_app/* getCdnUrl */.rG)(), ", IMG_URL=" + (0,will_app/* getImgUrl */.xn)() + ", BASE_CSS=" + (0,will_app/* getBaseCss */.NY)() + ", CHAT_URL=" + (0,will_app/* getChatUrl */.eh)());
    (0,will_app/* createLinkStyle */.Mi)((0,will_app/* getBaseCss */.NY)());
  }).catch(err => console.error(err));
}
;// CONCATENATED MODULE: ./src/assets/js/accessor.js


const accessor = (0,reactivity_esm_bundler/* ref */.KR)({
  lang: (0,will_app/* getDefaultLanguage */.i5)(),
  info: {},
  reset() {
    this.info = {};
  },
  setInfo(value) {
    this.info = {
      ...value
    };
  }
});
;// CONCATENATED MODULE: ./src/assets/js/favorite.js

const favorite = (0,reactivity_esm_bundler/* ref */.KR)({
  proglists: [],
  favorlists: [],
  recentlists: [],
  reset() {
    this.proglists = [];
    this.favorlists = [];
    this.recentlists = [];
  },
  setProgLists(value) {
    this.proglists = value;
  },
  setFavorLists(value) {
    this.favorlists = value;
  },
  setRecentLists(value) {
    this.recentlists = value;
  }
});
// EXTERNAL MODULE: ./node_modules/@azure/msal-browser/dist/app/PublicClientApplication.mjs + 107 modules
var PublicClientApplication = __webpack_require__(3798);
// EXTERNAL MODULE: ./node_modules/@azure/msal-common/dist/logger/Logger.mjs
var Logger = __webpack_require__(5767);
;// CONCATENATED MODULE: ./src/assets/js/auth.js




var ssoCallback;
var sso_current_domainid;
function setSSOCallback(callback) {
  ssoCallback = callback;
}
function startSSO(domainid, callback) {
  sso_current_domainid = domainid;
  setSSOCallback(callback);
  (0,will_app/* startWaiting */.eF)();
  jquery_default().ajax({
    url: (0,will_app/* getBaseUrl */.$_)() + "/auth/config/" + domainid,
    type: "POST",
    data: JSON.stringify({
      ajax: true
    }),
    dataType: "json",
    contentType: will_app/* DEFAULT_CONTENT_TYPE */.Xh,
    error: function (transport, status, errorThrown) {
      (0,will_app/* submitFailure */.pg)(transport, status, errorThrown, false);
    },
    success: async function (data, status, xhr) {
      console.log("success : " + xhr.responseText);
      (0,will_app/* stopWaiting */.Sk)();
      trySSOLogin(data);
    }
  });
}
async function trySSOLogin(data) {
  msalConfig.auth = {
    ...data.body.config.auth,
    authType: data.body.type,
    navigateToLoginRequestUrl: true
  };
  console.log("auth config", msalConfig.auth);
  delete msalConfig.auth.clientSecret;
  msalObject = new PublicClientApplication/* PublicClientApplication */.vq(msalConfig);
  await msalObject.initialize();
  msalObject.handleRedirectPromise().then(ssoHandleResponse).catch(error => {
    console.error(error);
  });
  ssoSignIn();
}
const msalConfig = {
  auth: {
    clientId: "",
    authority: "",
    redirectUri: ""
  },
  cache: {
    cacheLocation: "sessionStorage",
    // This configures where your cache will be stored
    storeAuthStateInCookie: false // Set this to "true" if you are having issues on IE11 or Edge
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) {
          return;
        }
        switch (level) {
          case Logger/* LogLevel */.$.Error:
            console.error(message);
            return;
          case Logger/* LogLevel */.$.Info:
            console.info(message);
            return;
          case Logger/* LogLevel */.$.Verbose:
            console.debug(message);
            return;
          case Logger/* LogLevel */.$.Warning:
            console.warn(message);
            return;
        }
      }
    }
  }
};
const loginRequest = {
  scopes: ["openid"]
};
let msalObject = null;
let username = "";
let ssoSignedIn = false;
function isSSOSignedIn() {
  return ssoSignedIn;
}
function ssoSelectAccount(response) {
  if (!msalObject) return;
  const currentAccounts = msalObject.getAllAccounts();
  if (currentAccounts.length === 0) {
    return;
  } else if (currentAccounts.length > 1) {
    console.warn("Multiple accounts detected.");
  } else if (currentAccounts.length === 1) {
    ssoSignedIn = true;
    let acct = currentAccounts[0];
    username = acct.username;
    if (!username || username == "") {
      if (response) username = response.account.idTokenClaims.given_name;
    }
    tryLogIn(username, acct.tenantId);
  }
}
function ssoHandleResponse(response) {
  console.log("handleResponse", response);
  if (response !== null) {
    ssoSignedIn = true;
    username = response.account.username;
    if (!username || username == "") {
      username = response.account.idTokenClaims.given_name;
    }
    tryLogIn(username, response.tenantId, response.accessToken);
  } else {
    ssoSelectAccount(response);
  }
}
async function ssoSignIn() {
  if (!msalObject) return;
  try {
    let response = await msalObject.loginPopup(loginRequest);
    ssoHandleResponse(response);
  } catch (error) {
    console.error(error);
    (0,will_app/* alertDialog */.T3)(error.description);
  }
}
function ssoSignOut() {
  if (!msalObject) throw new Error("Configuration not found");
  if (!ssoSignedIn) throw new Error("Account does not signed in");
  let homeurl = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port : '') + "/login";
  console.log("homeurl", homeurl);
  const logoutRequest = {
    account: msalObject.getAccountByUsername(username),
    postLogoutRedirectUri: homeurl,
    //msalConfig.auth.redirectUri || homeurl,
    mainWindowRedirectUri: homeurl //msalConfig.auth.redirectUri || homeurl
  };
  console.log("logoutRequest", logoutRequest);
  msalObject.logoutPopup(logoutRequest).then(() => {
    ssoSignedIn = false;
    username = "";
  });
  return true;
}
function getTokenPopup(request) {
  request.account = msalObject.getAccountByUsername(username);
  return msalObject.acquireTokenSilent(request).catch(error => {
    console.warn("silent token acquisition fails. acquiring token using popup");
    if (error instanceof InteractionRequiredAuthError) {
      return msalObject.acquireTokenPopup(request).then(tokenResponse => {
        console.log(tokenResponse);
        return tokenResponse;
      }).catch(error => {
        console.error(error);
      });
    } else {
      console.warn(error);
    }
  });
}
function tryLogIn(username, tenant, token) {
  console.log("tryLogin: username=" + username + ", domainid=" + sso_current_domainid + ", tenant=" + tenant + ", token=" + token);
  (0,will_app/* startWaiting */.eF)();
  jquery_default().ajax({
    url: (0,will_app/* getApiUrl */.e9)() + "/api/sign/access",
    type: "POST",
    data: JSON.stringify({
      username: username,
      domainid: sso_current_domainid,
      accesstoken: token
    }),
    dataType: "json",
    contentType: will_app/* DEFAULT_CONTENT_TYPE */.Xh,
    error: function (transport, status, errorThrown) {
      (0,will_app/* submitFailure */.pg)(transport, status, errorThrown, false);
    },
    success: function (data, status, xhr) {
      console.log("success : " + xhr.responseText);
      (0,will_app/* stopWaiting */.Sk)();
      //loginSuccess(data);
      if (ssoCallback) ssoCallback(data);
    }
  });
}
function doSSOLogout() {
  ssoSignOut();
}
// EXTERNAL MODULE: ./node_modules/socket.io-client/build/esm/index.js + 29 modules
var esm = __webpack_require__(7910);
;// CONCATENATED MODULE: ./src/assets/js/bc.js



let socket = null;
function startReceiveBroadcast(chat_url) {
  if (!chat_url) chat_url = (0,will_app/* getChatUrl */.eh)();
  console.log("start receive bc: ", chat_url);
  if (chat_url && chat_url.trim().length > 0) {
    socket = (0,esm/* default */.Ay)(chat_url);
    socket.on('broadcast-message', function (msg) {
      console.log("broadcast-message:", msg);
      let div = jquery_default()("<div class='bc-layer'></div>");
      let link = jquery_default()("<a href=\"javascript:void(0)\" class=\"bc-close\" aria-label=\"close\"></a>").html("<em class='fa fa-close'></em>");
      link.on("click", () => {
        div.remove();
      });
      let span = jquery_default()("<span></span>").html(msg.message);
      let body = jquery_default()("body");
      let isz = body.find("div.bc-layer").length;
      if (isz > 0 && isz < 10) {
        let bottom = isz * 50;
        div.css({
          bottom: bottom
        });
      }
      div.append(link).append(span).appendTo(body);
    });
  }
}
function stopReceiveBroadcast() {
  if (socket) socket.disconnect();
}
// EXTERNAL MODULE: ./node_modules/@vue/shared/dist/shared.esm-bundler.js
var shared_esm_bundler = __webpack_require__(4232);
;// CONCATENATED MODULE: ./src/assets/img/app_logo.png
var app_logo_namespaceObject = __webpack_require__.p + "img/app_logo.128d6de7.png";
;// CONCATENATED MODULE: ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/components/menu/HeaderBar.vue?vue&type=template&id=efa831f2


const HeaderBarvue_type_template_id_efa831f2_hoisted_1 = {
  ref: "navigatebar",
  id: "navigatebar",
  class: "navbar navbar-expand navigatebar-top"
};
const HeaderBarvue_type_template_id_efa831f2_hoisted_2 = {
  id: "leftmenucontainer",
  class: "collapse navbar-collapse"
};
const HeaderBarvue_type_template_id_efa831f2_hoisted_3 = {
  class: "navbar-nav mr-auto"
};
const _hoisted_4 = {
  id: "mainmenu",
  class: "nav-item active"
};
const _hoisted_5 = /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("em", {
  class: "fa fa-bars"
}, null, -1);
const _hoisted_6 = [_hoisted_5];
const _hoisted_7 = {
  id: "homelayer",
  class: "nav-item"
};
const _hoisted_8 = /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("em", {
  class: "fa fa-home"
}, null, -1);
const _hoisted_9 = [_hoisted_8];
const _hoisted_10 = {
  id: "productlayer",
  class: "nav-item"
};
const _hoisted_11 = /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("img", {
  id: "productimage",
  src: app_logo_namespaceObject,
  width: "40",
  height: "40",
  alt: ""
}, null, -1);
const _hoisted_12 = [_hoisted_11];
const _hoisted_13 = {
  id: "productlayer",
  class: "nav-item dropdown"
};
const _hoisted_14 = {
  href: "javascript:void(0)",
  id: "recentmenutrigger",
  class: "nav-link dropdown-toggle",
  role: "button",
  "data-toggle": "dropdown",
  "aria-haspopup": "true",
  "aria-expanded": "false",
  title: "History"
};
const _hoisted_15 = {
  id: "programtitle"
};
const _hoisted_16 = /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("span", {
  id: "recentcaret",
  class: "fa fa-caret-down caret-down"
}, null, -1);
const _hoisted_17 = {
  id: "rightmenucontainer",
  class: "navbar-nav navbar-collapse"
};
const _hoisted_18 = {
  id: "navmenuitem",
  class: "navbar-expand nav navbar-nav navbar-right navbar-user ml-auto"
};
const _hoisted_19 = {
  id: "usermenuitem",
  class: "nav-item dropdown user-dropdown"
};
const _hoisted_20 = {
  href: "javascript:void(0)",
  id: "accessor_linker",
  class: "nav-link dropdown-item dropdown-toggle",
  role: "button",
  "data-toggle": "dropdown",
  title: "My Information"
};
const _hoisted_21 = {
  id: "accessor_label"
};
const _hoisted_22 = /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("strong", {
  class: "fa fa-caret-down caret-down"
}, null, -1);
const _hoisted_23 = {
  id: "userinfoitemlist",
  class: "dropdown-menu dropdown-menu-right",
  "aria-labelledby": "navbarDropdown"
};
const _hoisted_24 = {
  href: "javascript:void(0)",
  class: "dropdown-item accessor-access",
  id: "accessor_access_link",
  title: "Last Access"
};
const _hoisted_25 = /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("em", {
  class: "fa fa-clock-o"
}, null, -1);
const _hoisted_26 = {
  id: "last_access_label",
  class: "menu-span"
};
const _hoisted_27 = /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("li", {
  class: "dropdown-divider divider"
}, null, -1);
const _hoisted_28 = /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("em", {
  class: "fa fa-user"
}, null, -1);
const _hoisted_29 = {
  id: "profile_label",
  class: "menu-span"
};
const _hoisted_30 = {
  id: "userchangeitem"
};
const _hoisted_31 = /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("em", {
  class: "fa fa-lock"
}, null, -1);
const _hoisted_32 = {
  id: "changepwd_label",
  class: "menu-span"
};
const _hoisted_33 = /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("li", {
  class: "dropdown-divider divider"
}, null, -1);
const _hoisted_34 = /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("em", {
  class: "fa fa-power-off"
}, null, -1);
const _hoisted_35 = {
  id: "logout_label",
  class: "menu-span"
};
const _hoisted_36 = {
  class: "navbar-expand nav navbar-nav navbar-right navbar-user-avatar"
};
const _hoisted_37 = /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("li", {
  id: "avatarmenuitem",
  class: "nav-item avatar-menu-item"
}, [/*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("a", {
  href: "javascript:void(0)",
  id: "avatarmenuitemlink",
  class: "nav-link dropdown-toggle avatar-item",
  "data-toggle": "dropdown",
  "data-target": "#usermenuitem"
}, [/*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("img", {
  id: "avatarimage",
  width: "50",
  height: "50",
  class: "img-avatar img-circle rounded-circle"
})])], -1);
const _hoisted_38 = {
  id: "languagemenuitem",
  class: "nav-item dropdown user-dropdown"
};
const _hoisted_39 = {
  href: "javascript:void(0)",
  id: "languagemenuitemlink",
  class: "nav-link dropdown-item dropdown-toggle",
  "data-toggle": "dropdown"
};
const _hoisted_40 = /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("strong", {
  class: "fa fa-caret-down caret-down"
}, null, -1);
const _hoisted_41 = {
  class: "dropdown-menu dropdown-menu-right"
};
const _hoisted_42 = /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("img", {
  class: "img-lang img-lang-EN",
  title: "English"
}, null, -1);
const _hoisted_43 = {
  id: "englishlanguage",
  class: "lang-word"
};
const _hoisted_44 = /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("img", {
  class: "img-lang img-lang-TH",
  title: "Thai"
}, null, -1);
const _hoisted_45 = {
  id: "thailanguage",
  class: "lang-word"
};
function HeaderBarvue_type_template_id_efa831f2_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_RecentMenu = (0,runtime_core_esm_bundler/* resolveComponent */.g2)("RecentMenu");
  const _component_FavorMenu = (0,runtime_core_esm_bundler/* resolveComponent */.g2)("FavorMenu");
  const _component_SiderBar = (0,runtime_core_esm_bundler/* resolveComponent */.g2)("SiderBar");
  return (0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)(runtime_core_esm_bundler/* Fragment */.FK, null, [(0,runtime_core_esm_bundler/* withDirectives */.bo)((0,runtime_core_esm_bundler/* createElementVNode */.Lk)("nav", HeaderBarvue_type_template_id_efa831f2_hoisted_1, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", HeaderBarvue_type_template_id_efa831f2_hoisted_2, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("ul", HeaderBarvue_type_template_id_efa831f2_hoisted_3, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("li", _hoisted_4, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("a", {
    href: "javascript:void(0)",
    onClick: _cache[0] || (_cache[0] = $event => $options.menuSelected('menu')),
    id: "mainmenutrigger",
    class: "nav-link",
    "data-toggle": "dropdown",
    title: "Menu"
  }, _hoisted_6)]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("li", _hoisted_7, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("a", {
    href: "javascript:void(0)",
    onClick: _cache[1] || (_cache[1] = $event => $options.menuSelected('home')),
    id: "homemenutrigger",
    class: "nav-link",
    title: "Home"
  }, _hoisted_9)]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("li", _hoisted_10, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("a", {
    href: "javascript:void(0)",
    onClick: _cache[2] || (_cache[2] = $event => $options.menuSelected('intro')),
    id: "intromenutrigger",
    class: "nav-link",
    title: "Welcome"
  }, _hoisted_12)]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("li", _hoisted_13, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("a", _hoisted_14, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("span", _hoisted_15, (0,shared_esm_bundler/* toDisplayString */.v_)($props.labels.system_label), 1), _hoisted_16]), (0,runtime_core_esm_bundler/* createVNode */.bF)(_component_RecentMenu, {
    ref: "recentMenu"
  }, null, 512)])])]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", _hoisted_17, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("ul", _hoisted_18, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("li", _hoisted_19, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("a", _hoisted_20, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("span", _hoisted_21, (0,shared_esm_bundler/* toDisplayString */.v_)($options.accessorFullName), 1), _hoisted_22]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("ul", _hoisted_23, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("li", null, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("a", _hoisted_24, [_hoisted_25, (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("span", _hoisted_26, (0,shared_esm_bundler/* toDisplayString */.v_)($options.lastAccessTime), 1)])]), _hoisted_27, (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("li", null, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("a", {
    href: "javascript:void(0)",
    onClick: _cache[3] || (_cache[3] = $event => $options.menuSelected('profile')),
    class: "dropdown-item",
    id: "accessor_profile_link"
  }, [_hoisted_28, (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("span", _hoisted_29, (0,shared_esm_bundler/* toDisplayString */.v_)($props.labels.profile_label), 1)])]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("li", _hoisted_30, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("a", {
    href: "javascript:void(0)",
    onClick: _cache[4] || (_cache[4] = $event => $options.menuSelected('changepassword')),
    class: "dropdown-item",
    id: "accessor_change_link"
  }, [_hoisted_31, (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("span", _hoisted_32, (0,shared_esm_bundler/* toDisplayString */.v_)($props.labels.changepwd_label), 1)])]), _hoisted_33, (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("li", null, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("a", {
    href: "javascript:void(0)",
    onClick: _cache[5] || (_cache[5] = $event => $options.menuSelected('logout')),
    class: "dropdown-item",
    id: "accessor_logout_link"
  }, [_hoisted_34, (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("span", _hoisted_35, (0,shared_esm_bundler/* toDisplayString */.v_)($props.labels.logout_label), 1)])])])])]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("ul", _hoisted_36, [_hoisted_37, (0,runtime_core_esm_bundler/* withDirectives */.bo)((0,runtime_core_esm_bundler/* createElementVNode */.Lk)("li", _hoisted_38, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("a", _hoisted_39, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("img", {
    id: "languageimage",
    alt: "Language",
    title: "Language",
    class: (0,shared_esm_bundler/* normalizeClass */.C4)(["img-lang", 'img-lang-' + $setup.accessor.lang])
  }, null, 2), _hoisted_40]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("ul", _hoisted_41, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("li", null, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("a", {
    href: "javascript:void(0)",
    class: "dropdown-item",
    id: "linklangen",
    onClick: _cache[6] || (_cache[6] = $event => $options.changeLanguage('EN'))
  }, [_hoisted_42, (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("span", _hoisted_43, (0,shared_esm_bundler/* toDisplayString */.v_)($props.labels.english_lang), 1)])]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("li", null, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("a", {
    href: "javascript:void(0)",
    class: "dropdown-item",
    id: "linklangth",
    onClick: _cache[7] || (_cache[7] = $event => $options.changeLanguage('TH'))
  }, [_hoisted_44, (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("span", _hoisted_45, (0,shared_esm_bundler/* toDisplayString */.v_)($props.labels.thai_lang), 1)])])])], 512), [[runtime_dom_esm_bundler/* vShow */.aG, $setup.languageVisible]]), (0,runtime_core_esm_bundler/* createVNode */.bF)(_component_FavorMenu, {
    ref: "favorMenu",
    visible: $setup.favorVisible
  }, null, 8, ["visible"])])])], 512), [[runtime_dom_esm_bundler/* vShow */.aG, $props.visible]]), (0,runtime_core_esm_bundler/* createVNode */.bF)(_component_SiderBar, {
    ref: "siderBar",
    visible: $props.visible,
    labels: $props.labels
  }, null, 8, ["visible", "labels"])], 64);
}
;// CONCATENATED MODULE: ./src/components/menu/HeaderBar.vue?vue&type=template&id=efa831f2

;// CONCATENATED MODULE: ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/components/menu/SiderBar.vue?vue&type=template&id=7af6a8c1

const SiderBarvue_type_template_id_7af6a8c1_hoisted_1 = {
  id: "sidebarheader",
  class: "sidebar-header"
};
const SiderBarvue_type_template_id_7af6a8c1_hoisted_2 = {
  class: "input-group-search has-search"
};
const SiderBarvue_type_template_id_7af6a8c1_hoisted_3 = /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("span", {
  id: "searchspan",
  class: "fa fa-search form-control-search",
  "aria-hidden": "true"
}, null, -1);
const SiderBarvue_type_template_id_7af6a8c1_hoisted_4 = {
  ref: "sidemenusearchtext",
  type: "text",
  id: "sidemenusearchtext",
  class: "form-control form-control-input-search input-md",
  placeholder: "Search"
};
const SiderBarvue_type_template_id_7af6a8c1_hoisted_5 = {
  ref: "sidebarlayer",
  id: "sidebarlayer",
  class: "sidebar-layer sidebar left"
};
function SiderBarvue_type_template_id_7af6a8c1_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_SiderMenu = (0,runtime_core_esm_bundler/* resolveComponent */.g2)("SiderMenu");
  return (0,runtime_core_esm_bundler/* withDirectives */.bo)(((0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("nav", {
    ref: "sidebarmenu",
    id: "sidebarmenu",
    class: (0,shared_esm_bundler/* normalizeClass */.C4)(["sidebar sidebar-menu main navbar-expand", $setup.menuFlip ? 'fliph' : 'unfliph'])
  }, [(0,runtime_core_esm_bundler/* withDirectives */.bo)((0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", SiderBarvue_type_template_id_7af6a8c1_hoisted_1, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", SiderBarvue_type_template_id_7af6a8c1_hoisted_2, [SiderBarvue_type_template_id_7af6a8c1_hoisted_3, (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("input", SiderBarvue_type_template_id_7af6a8c1_hoisted_4, null, 512)])], 512), [[runtime_dom_esm_bundler/* vShow */.aG, $setup.searchingVisible]]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", SiderBarvue_type_template_id_7af6a8c1_hoisted_5, [(0,runtime_core_esm_bundler/* createVNode */.bF)(_component_SiderMenu, {
    ref: "siderMenu",
    lang: $setup.accessor.lang,
    menus: $setup.menuItems,
    onItemMenuSelected: $options.itemMenuSelected,
    onGroupMenuSelected: $options.groupMenuSelected
  }, null, 8, ["lang", "menus", "onItemMenuSelected", "onGroupMenuSelected"])], 512)], 2)), [[runtime_dom_esm_bundler/* vShow */.aG, $props.visible]]);
}
;// CONCATENATED MODULE: ./src/components/menu/SiderBar.vue?vue&type=template&id=7af6a8c1

;// CONCATENATED MODULE: ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/components/menu/SiderMenu.vue?vue&type=template&id=61594b69

const SiderMenuvue_type_template_id_61594b69_hoisted_1 = {
  id: "menuitemlist",
  class: "nav flex-column sidebar-nav navbar-nav list-sidebar bg-default",
  role: "menu"
};
const SiderMenuvue_type_template_id_61594b69_hoisted_2 = ["onClick", "data-target", "href"];
const SiderMenuvue_type_template_id_61594b69_hoisted_3 = {
  class: "nav-label"
};
const SiderMenuvue_type_template_id_61594b69_hoisted_4 = /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("span", {
  class: "menu-group-icon fa fa-chevron-left pull-right"
}, null, -1);
const SiderMenuvue_type_template_id_61594b69_hoisted_5 = ["id"];
const SiderMenuvue_type_template_id_61594b69_hoisted_6 = ["onClick", "data-pid", "data-url", "title"];
function SiderMenuvue_type_template_id_61594b69_render(_ctx, _cache, $props, $setup, $data, $options) {
  return (0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("ul", SiderMenuvue_type_template_id_61594b69_hoisted_1, [((0,runtime_core_esm_bundler/* openBlock */.uX)(true), (0,runtime_core_esm_bundler/* createElementBlock */.CE)(runtime_core_esm_bundler/* Fragment */.FK, null, (0,runtime_core_esm_bundler/* renderList */.pI)($props.menus.sidemap, (value, key, counter) => {
    return (0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("li", {
      class: "dropdown",
      key: key
    }, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("a", {
      onClick: $event => _ctx.$emit('group-menu-selected', value),
      class: "nav-menu-group dropdown-toggle collapsed active",
      "data-toggle": "collapse",
      "data-target": '#submenu_' + counter,
      href: 'javascript:void(0);#submenu_' + counter
    }, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("em", {
      class: (0,shared_esm_bundler/* normalizeClass */.C4)($options.getDisplayGroupStyle(value))
    }, null, 2), (0,runtime_core_esm_bundler/* createTextVNode */.eW)("  "), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("span", SiderMenuvue_type_template_id_61594b69_hoisted_3, (0,shared_esm_bundler/* toDisplayString */.v_)($options.getDisplayGroupName(value)), 1), SiderMenuvue_type_template_id_61594b69_hoisted_4], 8, SiderMenuvue_type_template_id_61594b69_hoisted_2), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("ul", {
      id: 'submenu_' + counter,
      class: "sub-menu panel-collapse collapse",
      role: "menu"
    }, [((0,runtime_core_esm_bundler/* openBlock */.uX)(true), (0,runtime_core_esm_bundler/* createElementBlock */.CE)(runtime_core_esm_bundler/* Fragment */.FK, null, (0,runtime_core_esm_bundler/* renderList */.pI)($props.menus.sidelist[key], (item, index) => {
      return (0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("li", {
        key: index
      }, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("a", {
        href: "javascript:void(0)",
        onClick: $event => $options.itemMenuSelected(item),
        class: (0,shared_esm_bundler/* normalizeClass */.C4)(["fa-link-menu-item menu-desktop", item.iconstyle]),
        "data-pid": item.programid,
        "data-url": item.url,
        title: item.programid
      }, (0,shared_esm_bundler/* toDisplayString */.v_)($options.getDisplayProgramName(item)), 11, SiderMenuvue_type_template_id_61594b69_hoisted_6)]);
    }), 128))], 8, SiderMenuvue_type_template_id_61594b69_hoisted_5)]);
  }), 128))]);
}
;// CONCATENATED MODULE: ./src/components/menu/SiderMenu.vue?vue&type=template&id=61594b69

;// CONCATENATED MODULE: ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/components/menu/SiderMenu.vue?vue&type=script&lang=js
/* harmony default export */ var SiderMenuvue_type_script_lang_js = ({
  props: {
    menus: Object,
    lang: String
  },
  emits: ["group-menu-selected", "item-menu-selected"],
  methods: {
    getDisplayGroupStyle(item) {
      return item.groupstyle && item.groupstyle.trim().length > 0 ? item.groupstyle : "fa fa-tasks";
    },
    getDisplayGroupName(item) {
      return this.$props.lang === 'EN' ? item.nameen : item.nameth;
    },
    getDisplayProgramName(item) {
      return this.$props.lang === 'EN' ? item.progname : item.prognameth;
    },
    itemMenuSelected(item) {
      console.log("SideMenu.vue: menu item selected", item);
      this.$emit("item-menu-selected", item);
    }
  }
});
;// CONCATENATED MODULE: ./src/components/menu/SiderMenu.vue?vue&type=script&lang=js
 
// EXTERNAL MODULE: ./node_modules/vue-loader/dist/exportHelper.js
var exportHelper = __webpack_require__(1241);
;// CONCATENATED MODULE: ./src/components/menu/SiderMenu.vue




;
const __exports__ = /*#__PURE__*/(0,exportHelper/* default */.A)(SiderMenuvue_type_script_lang_js, [['render',SiderMenuvue_type_template_id_61594b69_render]])

/* harmony default export */ var SiderMenu = (__exports__);
;// CONCATENATED MODULE: ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/components/menu/SiderBar.vue?vue&type=script&lang=js








const menuData = {
  sidemap: {},
  sidelist: {}
};
/* harmony default export */ var SiderBarvue_type_script_lang_js = ({
  components: {
    SiderMenu: SiderMenu
  },
  props: {
    labels: Object,
    visible: {
      type: [String, Boolean],
      default: true
    }
  },
  setup() {
    const menuItems = (0,reactivity_esm_bundler/* ref */.KR)(menuData);
    const searchingVisible = (0,reactivity_esm_bundler/* ref */.KR)(false);
    const menuFlip = (0,reactivity_esm_bundler/* ref */.KR)(true);
    return {
      accessor: accessor,
      favorite: favorite,
      menuItems,
      searchingVisible,
      menuFlip
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.initialize();
    });
  },
  methods: {
    reset() {
      console.log("SiderBar.vue: reset ...");
      this.menuItems = {
        ...menuData
      };
    },
    initialize() {
      console.log("SiderBar: initialize ...");
      jquery_default()(document).on("click", e => {
        let $target = jquery_default()(e.target);
        if (!$target.closest('#sidebarmenu').length && !$target.closest('#mainmenutrigger').length) {
          this.collapseSideBarMenu();
        }
      });
      jquery_default()("#sidemenusearchtext").autocomplete({
        delay: 500,
        //delay keystroke to be search from server
        select: (event, ui) => {
          console.log("side menu search selected", JSON.stringify(ui.item));
          this.itemMenuSelected(ui.item.element);
        }
      });
    },
    displaySideBarMenu() {
      this.menuFlip = !this.menuFlip;
      this.searchingVisible = !this.searchingVisible;
    },
    collapseSideBarMenu() {
      this.searchingVisible = false;
      this.menuFlip = true;
    },
    setting(callback) {
      console.log("SideBar: setting", this.accessor);
      this.loadSideBarMenu(callback);
    },
    show() {
      this.searchingVisible = false;
      this.menuFlip = true;
    },
    changeLanguage(lang) {
      console.log("SiderBar.vue: language changed", lang);
      this.initSearching(lang);
    },
    initSearching(lang) {
      let jsAry = Object.values(this.menuItems.sidelist).flat().map(item => {
        return {
          label: lang == "EN" ? item.progname : item.prognameth,
          element: item
        };
      });
      jquery_default()("#sidemenusearchtext").autocomplete("option", "source", jsAry);
      return jsAry;
    },
    initMenuItems(dataset) {
      if (!dataset) return;
      let sidelist = {};
      //try to remove plugin program (progtype=I)
      for (let p in dataset.sidelist) {
        let ary = dataset.sidelist[p];
        let items = ary.filter(item => item.progtype != 'I');
        if (items.length == 0) {
          let it = dataset.sidemap[p];
          if (it) items = [it];
        }
        sidelist[p] = items;
      }
      this.menuItems = {
        sidemap: dataset.sidemap,
        sidelist: sidelist
      };
      console.log("initMenuItems: menu items", this.menuItems);
    },
    itemMenuSelected(item) {
      console.log("SiderBar.vue: item-menu-selected", item);
      openPage(item, this.accessor, this.favorite);
      this.collapseSideBarMenu();
    },
    groupMenuSelected(group) {
      console.log("SideBar.vue: grup-menu-selected", group);
      if (this.menuFlip) {
        this.displaySideBarMenu();
      }
    },
    loadSideBarMenu(callback) {
      console.log("loadSideBarMenu: accessor", this.accessor);
      let access_user = this.accessor.info?.userid;
      if (!access_user || access_user.trim().length == 0) return;
      let language = this.accessor.lang;
      let params = {
        userid: access_user,
        language: language
      };
      let formdata = (0,will_app/* serializeParameters */.L3)(params);
      jquery_default().ajax({
        url: (0,will_app/* getApiUrl */.e9)() + "/api/menu/side",
        data: formdata.jsondata,
        headers: formdata.headers,
        type: "POST",
        dataType: "json",
        contentType: will_app/* DEFAULT_CONTENT_TYPE */.Xh,
        success: data => {
          console.log("loadSideBarMenu: success", data);
          if (data.body?.dataset) {
            this.initMenuItems(data.body.dataset);
            let jsAry = this.initSearching(language);
            if (callback) callback(jsAry);
          }
        }
      });
    }
  }
});
;// CONCATENATED MODULE: ./src/components/menu/SiderBar.vue?vue&type=script&lang=js
 
;// CONCATENATED MODULE: ./src/components/menu/SiderBar.vue




;
const SiderBar_exports_ = /*#__PURE__*/(0,exportHelper/* default */.A)(SiderBarvue_type_script_lang_js, [['render',SiderBarvue_type_template_id_7af6a8c1_render]])

/* harmony default export */ var SiderBar = (SiderBar_exports_);
;// CONCATENATED MODULE: ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/components/menu/FavorMenu.vue?vue&type=template&id=19b1b0cc

const FavorMenuvue_type_template_id_19b1b0cc_hoisted_1 = {
  id: "favormenuitem",
  class: "nav-item dropdown user-dropdown"
};
const FavorMenuvue_type_template_id_19b1b0cc_hoisted_2 = /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("a", {
  href: "javascript:void(0)",
  id: "favormenuitemlink",
  class: "nav-link dropdown-item dropdown-toggle",
  role: "button",
  "data-toggle": "dropdown",
  title: "My Favorite"
}, [/*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("em", {
  class: "fa fa-th"
})], -1);
const FavorMenuvue_type_template_id_19b1b0cc_hoisted_3 = {
  id: "favordropdownmenu",
  class: "dropdown-menu dropdown-menu-right",
  "aria-labelledby": "navbarDropdown"
};
const FavorMenuvue_type_template_id_19b1b0cc_hoisted_4 = {
  id: "favornewitemlayer",
  class: "favor-menu-icon"
};
const FavorMenuvue_type_template_id_19b1b0cc_hoisted_5 = /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("em", {
  class: "fa fa-times-circle"
}, null, -1);
const FavorMenuvue_type_template_id_19b1b0cc_hoisted_6 = [FavorMenuvue_type_template_id_19b1b0cc_hoisted_5];
const FavorMenuvue_type_template_id_19b1b0cc_hoisted_7 = ["value"];
const FavorMenuvue_type_template_id_19b1b0cc_hoisted_8 = {
  id: "favorbarmenu",
  class: "navbox-tiles"
};
const FavorMenuvue_type_template_id_19b1b0cc_hoisted_9 = ["onClick", "seqno"];
const FavorMenuvue_type_template_id_19b1b0cc_hoisted_10 = /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", {
  class: "icon"
}, [/*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("img", {
  class: "fa fa-app-image img-favor-icon",
  alt: ""
})], -1);
const FavorMenuvue_type_template_id_19b1b0cc_hoisted_11 = /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("span", {
  class: "title"
}, "Add New", -1);
const FavorMenuvue_type_template_id_19b1b0cc_hoisted_12 = [FavorMenuvue_type_template_id_19b1b0cc_hoisted_10, FavorMenuvue_type_template_id_19b1b0cc_hoisted_11];
const FavorMenuvue_type_template_id_19b1b0cc_hoisted_13 = ["onClick", "seqno", "pid", "url", "title"];
const FavorMenuvue_type_template_id_19b1b0cc_hoisted_14 = {
  class: "icon"
};
const FavorMenuvue_type_template_id_19b1b0cc_hoisted_15 = ["src"];
const FavorMenuvue_type_template_id_19b1b0cc_hoisted_16 = {
  class: "title"
};
const FavorMenuvue_type_template_id_19b1b0cc_hoisted_17 = {
  class: "todo"
};
const FavorMenuvue_type_template_id_19b1b0cc_hoisted_18 = ["onClick"];
const FavorMenuvue_type_template_id_19b1b0cc_hoisted_19 = /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("img", {
  class: "img-delete-icon",
  title: "Delete",
  width: "25px",
  height: "25px"
}, null, -1);
const FavorMenuvue_type_template_id_19b1b0cc_hoisted_20 = [FavorMenuvue_type_template_id_19b1b0cc_hoisted_19];
const FavorMenuvue_type_template_id_19b1b0cc_hoisted_21 = {
  id: "favorcoverbarmenu",
  class: "favor-menu-cover"
};
function FavorMenuvue_type_template_id_19b1b0cc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return (0,runtime_core_esm_bundler/* withDirectives */.bo)(((0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("li", FavorMenuvue_type_template_id_19b1b0cc_hoisted_1, [FavorMenuvue_type_template_id_19b1b0cc_hoisted_2, (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("ul", FavorMenuvue_type_template_id_19b1b0cc_hoisted_3, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("li", null, [(0,runtime_core_esm_bundler/* withDirectives */.bo)((0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", FavorMenuvue_type_template_id_19b1b0cc_hoisted_4, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("a", {
    href: "javascript:void(0)",
    onClick: _cache[0] || (_cache[0] = (0,runtime_dom_esm_bundler/* withModifiers */.D$)((...args) => $options.cancelNewFavorClick && $options.cancelNewFavorClick(...args), ["stop"])),
    id: "favorcancelitem",
    class: "favor-cancel-item",
    title: "Close New Favorite"
  }, FavorMenuvue_type_template_id_19b1b0cc_hoisted_6), (0,runtime_core_esm_bundler/* withDirectives */.bo)((0,runtime_core_esm_bundler/* createElementVNode */.Lk)("select", {
    id: "favorprogitem",
    "onUpdate:modelValue": _cache[1] || (_cache[1] = $event => $setup.favorProg = $event),
    onClick: _cache[2] || (_cache[2] = (0,runtime_dom_esm_bundler/* withModifiers */.D$)(() => {}, ["stop"]))
  }, [((0,runtime_core_esm_bundler/* openBlock */.uX)(true), (0,runtime_core_esm_bundler/* createElementBlock */.CE)(runtime_core_esm_bundler/* Fragment */.FK, null, (0,runtime_core_esm_bundler/* renderList */.pI)($setup.favorite.proglists, (item, index) => {
    return (0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("option", {
      key: index,
      value: item.programid
    }, (0,shared_esm_bundler/* toDisplayString */.v_)($options.getDisplayProgramName(item)), 9, FavorMenuvue_type_template_id_19b1b0cc_hoisted_7);
  }), 128))], 512), [[runtime_dom_esm_bundler/* vModelSelect */.u1, $setup.favorProg]]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("a", {
    href: "javascript:void(0)",
    onClick: _cache[3] || (_cache[3] = (0,runtime_dom_esm_bundler/* withModifiers */.D$)((...args) => $options.addFavorItemClick && $options.addFavorItemClick(...args), ["stop"])),
    id: "favornewitem",
    class: "favor-new-item fa fa-plus",
    title: "Add New Favorite"
  })], 512), [[runtime_dom_esm_bundler/* vShow */.aG, $setup.newFavorVisible]]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", FavorMenuvue_type_template_id_19b1b0cc_hoisted_8, [((0,runtime_core_esm_bundler/* openBlock */.uX)(true), (0,runtime_core_esm_bundler/* createElementBlock */.CE)(runtime_core_esm_bundler/* Fragment */.FK, null, (0,runtime_core_esm_bundler/* renderList */.pI)($setup.favorite.favorlists, (item, index) => {
    return (0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)(runtime_core_esm_bundler/* Fragment */.FK, {
      key: index
    }, [item.type == 'new' ? ((0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("a", {
      key: 0,
      href: "javascript:void(0)",
      onClick: (0,runtime_dom_esm_bundler/* withModifiers */.D$)($event => $options.newFavorItemClick(item), ["stop"]),
      class: "tile fa-box-title fav-blank",
      title: "New Favorite",
      seqno: $options.getFavorSeqno(item, index + 1)
    }, FavorMenuvue_type_template_id_19b1b0cc_hoisted_12, 8, FavorMenuvue_type_template_id_19b1b0cc_hoisted_9)) : ((0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("a", {
      key: 1,
      href: "javascript:void(0)",
      onClick: $event => $options.openFavorItemClick(item),
      class: "tile fa-box-title fav-app",
      seqno: $options.getFavorSeqno(item, index + 1),
      pid: item.programid,
      url: item.url,
      title: item.programid
    }, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", FavorMenuvue_type_template_id_19b1b0cc_hoisted_14, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("img", {
      class: "fa fa-app-image",
      src: $options.getFavorIcon(item),
      alt: ""
    }, null, 8, FavorMenuvue_type_template_id_19b1b0cc_hoisted_15)]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("span", FavorMenuvue_type_template_id_19b1b0cc_hoisted_16, (0,shared_esm_bundler/* toDisplayString */.v_)($options.getDisplayFavorName(item)), 1), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("ul", FavorMenuvue_type_template_id_19b1b0cc_hoisted_17, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("li", {
      onClick: (0,runtime_dom_esm_bundler/* withModifiers */.D$)($event => $options.deleteFavorItemClick(item, index + 1), ["stop"])
    }, FavorMenuvue_type_template_id_19b1b0cc_hoisted_20, 8, FavorMenuvue_type_template_id_19b1b0cc_hoisted_18)])], 8, FavorMenuvue_type_template_id_19b1b0cc_hoisted_13))], 64);
  }), 128))]), (0,runtime_core_esm_bundler/* withDirectives */.bo)((0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", FavorMenuvue_type_template_id_19b1b0cc_hoisted_21, null, 512), [[runtime_dom_esm_bundler/* vShow */.aG, $setup.newFavorVisible]])])])], 512)), [[runtime_dom_esm_bundler/* vShow */.aG, $props.visible]]);
}
;// CONCATENATED MODULE: ./src/components/menu/FavorMenu.vue?vue&type=template&id=19b1b0cc

;// CONCATENATED MODULE: ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/components/menu/FavorMenu.vue?vue&type=script&lang=js








/* harmony default export */ var FavorMenuvue_type_script_lang_js = ({
  props: {
    visible: {
      type: [String, Boolean],
      default: true
    }
  },
  setup() {
    const newFavorVisible = (0,reactivity_esm_bundler/* ref */.KR)(false);
    const favorProg = (0,reactivity_esm_bundler/* ref */.KR)(null);
    const currentFavor = (0,reactivity_esm_bundler/* ref */.KR)(null);
    return {
      accessor: accessor,
      favorite: favorite,
      newFavorVisible,
      favorProg,
      currentFavor
    };
  },
  methods: {
    reset() {
      console.log("FavorMenu.vue: reset ...");
      this.favorite.reset();
    },
    getFavorIcon(item) {
      return item.iconfile && item.iconfile.trim().length > 0 ? (0,will_app/* getImgUrl */.xn)() + "/img/apps/" + item.iconfile : this.getDefaultFavorIcon(item);
    },
    getFavorSeqno(item, index) {
      return item.seqno ? item.seqno : index;
    },
    getDefaultFavorIcon(item) {
      return item.type == 'new' ? (0,will_app/* getImgUrl */.xn)() + "/img/apps/favorite.png" : (0,will_app/* getImgUrl */.xn)() + "/img/apps/application.png";
    },
    getDisplayFavorName(item) {
      return this.accessor.lang === 'EN' ? item.shortname : item.shortnameth;
    },
    getDisplayProgramName(item) {
      return this.accessor.lang === 'EN' ? item.shortname : item.shortnameth;
    },
    setting() {
      console.log("FavorMenu: setting, accessor", this.accessor);
      this.loadFavorMenu();
      this.loadProgramItems();
    },
    loadFavorMenu() {
      console.log("loadFavorMenu: accessor", this.accessor);
      let info = this.accessor.info;
      let access_user = info?.userid;
      if (!access_user || access_user.trim().length == 0) return;
      let language = this.accessor.lang;
      let params = {
        userid: access_user,
        language: language
      };
      let formdata = (0,will_app/* serializeParameters */.L3)(params);
      jquery_default().ajax({
        url: (0,will_app/* getApiUrl */.e9)() + "/api/menu/favor",
        data: formdata.jsondata,
        headers: formdata.headers,
        type: "POST",
        dataType: "json",
        contentType: will_app/* DEFAULT_CONTENT_TYPE */.Xh,
        success: data => {
          console.log("loadFavorMenu: success", data);
          let dataset = data.body?.dataset;
          if (dataset) {
            let rows = dataset.rows;
            if (rows) {
              for (let idx = rows.length + 1; idx <= 9; idx++) {
                rows.push({
                  type: "new",
                  seqno: idx
                });
              }
              this.favorite.setFavorLists(rows);
            }
          }
        }
      });
    },
    loadProgramItems() {
      console.log("loadProgramItems: accessor", this.accessor);
      let access_user = this.accessor.info?.userid;
      if (!access_user || access_user.trim().length == 0) return;
      let formdata = (0,will_app/* serializeParameters */.L3)({
        userid: access_user
      });
      jquery_default().ajax({
        url: (0,will_app/* getApiUrl */.e9)() + "/api/menu/favorprog",
        data: formdata.jsondata,
        headers: formdata.headers,
        type: "POST",
        dataType: "json",
        contentType: will_app/* DEFAULT_CONTENT_TYPE */.Xh,
        success: data => {
          console.log("loadProgramItems: success", data);
          if (data.body?.rows) {
            this.favorite.setProgLists(data.body.rows);
          }
        }
      });
    },
    cancelNewFavorClick() {
      this.newFavorVisible = false;
    },
    addFavorItemClick() {
      console.log("addFavorItem: current favor", this.currentFavor);
      console.log("addFavorItem: favor prog", this.favorProg);
      if (this.currentFavor && this.favorProg) {
        let prog = this.favorite.proglists.find(item => item.programid == this.favorProg);
        console.log("addFavorItem: prog item", prog);
        if (!prog) return;
        let fs_user = this.accessor.info?.userid;
        let fs_prog = prog.programid;
        let fs_seqno = this.currentFavor.seqno;
        let params = {
          userid: fs_user,
          programid: fs_prog,
          seqno: fs_seqno
        };
        let formdata = (0,will_app/* serializeParameters */.L3)(params);
        jquery_default().ajax({
          url: (0,will_app/* getApiUrl */.e9)() + "/api/menu/insert",
          data: formdata.jsondata,
          headers: formdata.headers,
          type: "POST",
          dataType: "html",
          contentType: will_app/* DEFAULT_CONTENT_TYPE */.Xh,
          error: function (transport, status, errorThrown) {
            (0,will_app/* submitFailure */.pg)(transport, status, errorThrown, false);
          },
          success: () => {
            Object.assign(this.currentFavor, prog);
            this.currentFavor.type = "add";
            this.newFavorVisible = false;
          }
        });
      }
    },
    newFavorItemClick(item) {
      console.log("newFavorItem: item", item);
      this.currentFavor = item;
      this.newFavorVisible = true;
    },
    openFavorItemClick(item) {
      console.log("openFavorItem: item", item);
      openPage(item, this.accessor, this.favorite);
    },
    deleteFavorItemClick(item, index) {
      console.log("deleteFavorItem: item", item);
      let fs_user = this.accessor.info?.userid;
      let fs_seqno = item.seqno ? item.seqno : index;
      let params = {
        userid: fs_user,
        programid: item.programid,
        seqno: fs_seqno
      };
      let formdata = (0,will_app/* serializeParameters */.L3)(params);
      jquery_default().ajax({
        url: (0,will_app/* getApiUrl */.e9)() + "/api/menu/remove",
        data: formdata.jsondata,
        headers: formdata.headers,
        type: "POST",
        dataType: "html",
        contentType: will_app/* DEFAULT_CONTENT_TYPE */.Xh,
        error: function (transport, status, errorThrown) {
          (0,will_app/* submitFailure */.pg)(transport, status, errorThrown, false);
        },
        success: () => {
          item.type = "new";
        }
      });
    }
  }
});
;// CONCATENATED MODULE: ./src/components/menu/FavorMenu.vue?vue&type=script&lang=js
 
;// CONCATENATED MODULE: ./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-12.use[0]!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-12.use[1]!./node_modules/vue-loader/dist/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-12.use[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/components/menu/FavorMenu.vue?vue&type=style&index=0&id=19b1b0cc&lang=css
// extracted by mini-css-extract-plugin

;// CONCATENATED MODULE: ./src/components/menu/FavorMenu.vue?vue&type=style&index=0&id=19b1b0cc&lang=css

;// CONCATENATED MODULE: ./src/components/menu/FavorMenu.vue




;


const FavorMenu_exports_ = /*#__PURE__*/(0,exportHelper/* default */.A)(FavorMenuvue_type_script_lang_js, [['render',FavorMenuvue_type_template_id_19b1b0cc_render]])

/* harmony default export */ var FavorMenu = (FavorMenu_exports_);
;// CONCATENATED MODULE: ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/components/menu/RecentMenu.vue?vue&type=template&id=54b6f86b

const RecentMenuvue_type_template_id_54b6f86b_hoisted_1 = {
  id: "recentmenulist",
  class: "dropdown-menu",
  "aria-labelledby": "navbarDropdown"
};
const RecentMenuvue_type_template_id_54b6f86b_hoisted_2 = ["onClick"];
function RecentMenuvue_type_template_id_54b6f86b_render(_ctx, _cache, $props, $setup, $data, $options) {
  return (0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("ul", RecentMenuvue_type_template_id_54b6f86b_hoisted_1, [((0,runtime_core_esm_bundler/* openBlock */.uX)(true), (0,runtime_core_esm_bundler/* createElementBlock */.CE)(runtime_core_esm_bundler/* Fragment */.FK, null, (0,runtime_core_esm_bundler/* renderList */.pI)($setup.favorite.recentlists, (item, index) => {
    return (0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("li", {
      key: index
    }, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("a", {
      href: "javascript:void(0)",
      onClick: $event => $options.openAppClick(item),
      class: "dropdown-item"
    }, (0,shared_esm_bundler/* toDisplayString */.v_)($options.getDisplayRecentName(item)), 9, RecentMenuvue_type_template_id_54b6f86b_hoisted_2)]);
  }), 128))]);
}
;// CONCATENATED MODULE: ./src/components/menu/RecentMenu.vue?vue&type=template&id=54b6f86b

;// CONCATENATED MODULE: ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/components/menu/RecentMenu.vue?vue&type=script&lang=js



/* harmony default export */ var RecentMenuvue_type_script_lang_js = ({
  setup() {
    return {
      accessor: accessor,
      favorite: favorite
    };
  },
  methods: {
    getDisplayRecentName(item) {
      return this.accessor.lang === 'EN' ? item.progname : item.prognameth;
    },
    openAppClick(item) {
      openPage(item, this.accessor, this.favorite);
      this.$root.hideMeu();
    }
  }
});
;// CONCATENATED MODULE: ./src/components/menu/RecentMenu.vue?vue&type=script&lang=js
 
;// CONCATENATED MODULE: ./src/components/menu/RecentMenu.vue




;
const RecentMenu_exports_ = /*#__PURE__*/(0,exportHelper/* default */.A)(RecentMenuvue_type_script_lang_js, [['render',RecentMenuvue_type_template_id_54b6f86b_render]])

/* harmony default export */ var RecentMenu = (RecentMenu_exports_);
;// CONCATENATED MODULE: ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/components/menu/HeaderBar.vue?vue&type=script&lang=js







/* harmony default export */ var HeaderBarvue_type_script_lang_js = ({
  components: {
    SiderBar: SiderBar,
    FavorMenu: FavorMenu,
    RecentMenu: RecentMenu
  },
  props: {
    labels: Object,
    visible: {
      type: [String, Boolean],
      default: true
    }
  },
  emits: ["language-changed", "menu-selected"],
  setup() {
    const languageVisible = (0,reactivity_esm_bundler/* ref */.KR)(true);
    const favorVisible = (0,reactivity_esm_bundler/* ref */.KR)(true);
    return {
      accessor: accessor,
      languageVisible,
      favorVisible
    };
  },
  computed: {
    accessorFullName() {
      if (this.accessor.info?.displayname && this.accessor.info?.displayname.trim().length > 0) return this.accessor.info?.displayname;
      if (this.accessor.info?.name && this.accessor.info?.surname) return this.accessor.info?.name + " " + this.accessor.info?.surname;
      return this.accessor.info?.username ? this.accessor.info?.username : "";
    },
    lastAccessTime() {
      return this.accessor.info?.accessdate && this.accessor.info?.accesstime ? this.accessor.info?.accessdate + " " + this.accessor.info?.accesstime : "";
    }
  },
  methods: {
    reset() {
      console.log("HeaderVar.vue: reset ...");
      this.$refs.favorMenu.reset();
      this.$refs.siderBar.reset();
    },
    menuSelected(menu) {
      if ("menu" == menu) {
        this.$refs.siderBar.displaySideBarMenu();
      }
      this.$emit("menu-selected", menu);
    },
    changeLanguage(lang) {
      console.log("change language: ", lang);
      (0,will_app/* setDefaultLanguage */.Qq)(lang);
      this.accessor.lang = lang;
      this.$refs.siderBar.changeLanguage(lang);
      this.$emit('language-changed', lang);
    },
    setting(callback) {
      console.log("HeaderBar: setting, accessor", this.accessor);
      let avatar = this.accessor.info?.avatar;
      if (avatar && avatar.trim().length > 0) {
        jquery_default()("#avatarimage").attr("src", avatar);
      }
      this.$refs.favorMenu.setting();
      this.$refs.siderBar.setting(callback);
      this.$refs.siderBar.show();
    },
    showLanguage() {
      this.languageVisible = true;
    },
    hideLanguage() {
      this.languageVisible = false;
    },
    showFavorite() {
      this.favorVisible = true;
    },
    hideFavorite() {
      this.favorVisible = false;
    },
    displaySideBar() {
      this.$refs.siderBar.displaySideBarMenu();
    },
    collapseSideBar() {
      this.$refs.siderBar.collapseSideBarMenu();
    }
  }
});
;// CONCATENATED MODULE: ./src/components/menu/HeaderBar.vue?vue&type=script&lang=js
 
;// CONCATENATED MODULE: ./src/components/menu/HeaderBar.vue




;
const HeaderBar_exports_ = /*#__PURE__*/(0,exportHelper/* default */.A)(HeaderBarvue_type_script_lang_js, [['render',HeaderBarvue_type_template_id_efa831f2_render]])

/* harmony default export */ var HeaderBar = (HeaderBar_exports_);
;// CONCATENATED MODULE: ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/components/form/LoginForm.vue?vue&type=template&id=1cc29bac

const LoginFormvue_type_template_id_1cc29bac_hoisted_1 = {
  id: "page_login"
};
const LoginFormvue_type_template_id_1cc29bac_hoisted_2 = {
  id: "div-login-container"
};
const LoginFormvue_type_template_id_1cc29bac_hoisted_3 = /*#__PURE__*/(0,runtime_core_esm_bundler/* createStaticVNode */.Fv)("<div class=\"div-login-left div-login-column\"><div class=\"div-login-frame shadow-animate\"><div class=\"div-login-shape\"><div id=\"login_logo_label\"><span class=\"pass-word\">Pass</span> &amp; <span class=\"go-word\">Go</span><hr class=\"login-hr-line\"></div></div></div></div>", 1);
const LoginFormvue_type_template_id_1cc29bac_hoisted_4 = {
  id: "div-login-input"
};
const LoginFormvue_type_template_id_1cc29bac_hoisted_5 = {
  id: "pager_login",
  class: "pt-page pt-page-current"
};
const LoginFormvue_type_template_id_1cc29bac_hoisted_6 = {
  id: "page_login_area"
};
const LoginFormvue_type_template_id_1cc29bac_hoisted_7 = {
  id: "page_login_entry",
  class: "page-login-entry"
};
const LoginFormvue_type_template_id_1cc29bac_hoisted_8 = /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("input", {
  type: "hidden",
  id: "main_useruuid"
}, null, -1);
const LoginFormvue_type_template_id_1cc29bac_hoisted_9 = {
  class: "main-form",
  id: "main_form",
  name: "main_form"
};
const LoginFormvue_type_template_id_1cc29bac_hoisted_10 = {
  id: "loginformlayer",
  class: "login_form login-portal-area"
};
const LoginFormvue_type_template_id_1cc29bac_hoisted_11 = /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("br", null, null, -1);
const LoginFormvue_type_template_id_1cc29bac_hoisted_12 = {
  id: "login_label",
  class: "login-label"
};
const LoginFormvue_type_template_id_1cc29bac_hoisted_13 = /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("br", null, null, -1);
const LoginFormvue_type_template_id_1cc29bac_hoisted_14 = {
  class: "input-group-name login-input-field"
};
const LoginFormvue_type_template_id_1cc29bac_hoisted_15 = /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("i", {
  class: "fa fa-user login-icon"
}, null, -1);
const LoginFormvue_type_template_id_1cc29bac_hoisted_16 = {
  id: "login_user_label",
  class: "login-label"
};
const LoginFormvue_type_template_id_1cc29bac_hoisted_17 = {
  key: 0,
  class: "has-error"
};
const LoginFormvue_type_template_id_1cc29bac_hoisted_18 = /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("br", null, null, -1);
const LoginFormvue_type_template_id_1cc29bac_hoisted_19 = {
  class: "input-group-password login-input-field"
};
const LoginFormvue_type_template_id_1cc29bac_hoisted_20 = /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("i", {
  class: "fa fa-lock login-icon"
}, null, -1);
const LoginFormvue_type_template_id_1cc29bac_hoisted_21 = {
  id: "login_password_label",
  class: "login-label"
};
const LoginFormvue_type_template_id_1cc29bac_hoisted_22 = {
  key: 0,
  class: "has-error"
};
const LoginFormvue_type_template_id_1cc29bac_hoisted_23 = /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("br", null, null, -1);
const LoginFormvue_type_template_id_1cc29bac_hoisted_24 = {
  class: "input-group-forgot"
};
const LoginFormvue_type_template_id_1cc29bac_hoisted_25 = /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("br", null, null, -1);
const LoginFormvue_type_template_id_1cc29bac_hoisted_26 = {
  id: "login_button_layer",
  class: "login_button_layer"
};
const LoginFormvue_type_template_id_1cc29bac_hoisted_27 = /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("br", null, null, -1);
const LoginFormvue_type_template_id_1cc29bac_hoisted_28 = {
  class: "row"
};
const LoginFormvue_type_template_id_1cc29bac_hoisted_29 = {
  class: "col-md-12 text-center"
};
const LoginFormvue_type_template_id_1cc29bac_hoisted_30 = {
  class: "login-label"
};
const LoginFormvue_type_template_id_1cc29bac_hoisted_31 = /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("br", null, null, -1);
function LoginFormvue_type_template_id_1cc29bac_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_SSOPanel = (0,runtime_core_esm_bundler/* resolveComponent */.g2)("SSOPanel");
  return (0,runtime_core_esm_bundler/* withDirectives */.bo)(((0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("div", LoginFormvue_type_template_id_1cc29bac_hoisted_1, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", LoginFormvue_type_template_id_1cc29bac_hoisted_2, [LoginFormvue_type_template_id_1cc29bac_hoisted_3, (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", {
    class: (0,shared_esm_bundler/* normalizeClass */.C4)(["div-login-right div-login-column", {
      'div-login-right-center': !$setup.hasSSO
    }])
  }, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", LoginFormvue_type_template_id_1cc29bac_hoisted_4, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", LoginFormvue_type_template_id_1cc29bac_hoisted_5, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", LoginFormvue_type_template_id_1cc29bac_hoisted_6, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", LoginFormvue_type_template_id_1cc29bac_hoisted_7, [LoginFormvue_type_template_id_1cc29bac_hoisted_8, (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", LoginFormvue_type_template_id_1cc29bac_hoisted_9, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", LoginFormvue_type_template_id_1cc29bac_hoisted_10, [LoginFormvue_type_template_id_1cc29bac_hoisted_11, (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("label", LoginFormvue_type_template_id_1cc29bac_hoisted_12, (0,shared_esm_bundler/* toDisplayString */.v_)($props.labels.login_label), 1), LoginFormvue_type_template_id_1cc29bac_hoisted_13, (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", LoginFormvue_type_template_id_1cc29bac_hoisted_14, [LoginFormvue_type_template_id_1cc29bac_hoisted_15, (0,runtime_core_esm_bundler/* withDirectives */.bo)((0,runtime_core_esm_bundler/* createElementVNode */.Lk)("input", {
    ref: "main_username",
    type: "text",
    "onUpdate:modelValue": _cache[0] || (_cache[0] = $event => $setup.localData.username = $event),
    id: "main_username",
    name: "username",
    class: "form-control input-md",
    maxlength: "60",
    required: ""
  }, null, 512), [[runtime_dom_esm_bundler/* vModelText */.Jo, $setup.localData.username]]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("label", LoginFormvue_type_template_id_1cc29bac_hoisted_16, (0,shared_esm_bundler/* toDisplayString */.v_)($props.labels.username_label), 1), $setup.v$.username.$error ? ((0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("span", LoginFormvue_type_template_id_1cc29bac_hoisted_17, (0,shared_esm_bundler/* toDisplayString */.v_)($setup.v$.username.$errors[0].$message), 1)) : (0,runtime_core_esm_bundler/* createCommentVNode */.Q3)("", true)]), LoginFormvue_type_template_id_1cc29bac_hoisted_18, (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", LoginFormvue_type_template_id_1cc29bac_hoisted_19, [LoginFormvue_type_template_id_1cc29bac_hoisted_20, (0,runtime_core_esm_bundler/* withDirectives */.bo)((0,runtime_core_esm_bundler/* createElementVNode */.Lk)("input", {
    ref: "main_pass",
    type: "password",
    "onUpdate:modelValue": _cache[1] || (_cache[1] = $event => $setup.localData.password = $event),
    id: "main_pass",
    name: "password",
    class: "form-control input-md",
    autocomplete: "off",
    required: ""
  }, null, 512), [[runtime_dom_esm_bundler/* vModelText */.Jo, $setup.localData.password]]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("label", LoginFormvue_type_template_id_1cc29bac_hoisted_21, (0,shared_esm_bundler/* toDisplayString */.v_)($props.labels.password_label), 1), $setup.v$.password.$error ? ((0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("span", LoginFormvue_type_template_id_1cc29bac_hoisted_22, (0,shared_esm_bundler/* toDisplayString */.v_)($setup.v$.password.$errors[0].$message), 1)) : (0,runtime_core_esm_bundler/* createCommentVNode */.Q3)("", true)]), LoginFormvue_type_template_id_1cc29bac_hoisted_23, (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", LoginFormvue_type_template_id_1cc29bac_hoisted_24, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("a", {
    href: "javascript:void(0)",
    id: "forgot_password",
    class: "enter-class login-label",
    title: "Forgot Password",
    onClick: _cache[2] || (_cache[2] = $event => _ctx.$emit('forgot'))
  }, (0,shared_esm_bundler/* toDisplayString */.v_)($props.labels.forgot_label), 1)]), LoginFormvue_type_template_id_1cc29bac_hoisted_25, (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", LoginFormvue_type_template_id_1cc29bac_hoisted_26, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("button", {
    id: "main_button",
    class: "form-control input-md",
    onClick: _cache[3] || (_cache[3] = (...args) => $options.loginClick && $options.loginClick(...args))
  }, (0,shared_esm_bundler/* toDisplayString */.v_)($props.labels.signin_label), 1)]), LoginFormvue_type_template_id_1cc29bac_hoisted_27, (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", LoginFormvue_type_template_id_1cc29bac_hoisted_28, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", LoginFormvue_type_template_id_1cc29bac_hoisted_29, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("label", LoginFormvue_type_template_id_1cc29bac_hoisted_30, (0,shared_esm_bundler/* toDisplayString */.v_)($props.version), 1)])]), (0,runtime_core_esm_bundler/* createVNode */.bF)(_component_SSOPanel, {
    ref: "ssoPanel",
    labels: $props.labels,
    onSsoSelected: $options.ssoSelected,
    onSsoSetting: $options.ssoSetting
  }, null, 8, ["labels", "onSsoSelected", "onSsoSetting"]), LoginFormvue_type_template_id_1cc29bac_hoisted_31])])])])])])], 2)])], 512)), [[runtime_dom_esm_bundler/* vShow */.aG, $props.visible]]);
}
;// CONCATENATED MODULE: ./src/components/form/LoginForm.vue?vue&type=template&id=1cc29bac

// EXTERNAL MODULE: ./node_modules/@vuelidate/core/dist/index.mjs
var dist = __webpack_require__(7760);
// EXTERNAL MODULE: ./node_modules/@vuelidate/validators/dist/index.mjs
var validators_dist = __webpack_require__(9428);
;// CONCATENATED MODULE: ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/components/form/SSOPanel.vue?vue&type=template&id=47f37d7f&scoped=true

const _withScopeId = n => ((0,runtime_core_esm_bundler/* pushScopeId */.Qi)("data-v-47f37d7f"), n = n(), (0,runtime_core_esm_bundler/* popScopeId */.jt)(), n);
const SSOPanelvue_type_template_id_47f37d7f_scoped_true_hoisted_1 = {
  id: "ssologinlayer"
};
const SSOPanelvue_type_template_id_47f37d7f_scoped_true_hoisted_2 = {
  class: "loading-layer"
};
const SSOPanelvue_type_template_id_47f37d7f_scoped_true_hoisted_3 = /*#__PURE__*/_withScopeId(() => /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("span", {
  class: "loading-span"
}, [/*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("em", {
  class: "fa fa-spinner fa-spin"
})], -1));
const SSOPanelvue_type_template_id_47f37d7f_scoped_true_hoisted_4 = /*#__PURE__*/_withScopeId(() => /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("br", null, null, -1));
const SSOPanelvue_type_template_id_47f37d7f_scoped_true_hoisted_5 = [SSOPanelvue_type_template_id_47f37d7f_scoped_true_hoisted_3, SSOPanelvue_type_template_id_47f37d7f_scoped_true_hoisted_4];
const SSOPanelvue_type_template_id_47f37d7f_scoped_true_hoisted_6 = {
  key: 0,
  class: "login_button_layer"
};
const SSOPanelvue_type_template_id_47f37d7f_scoped_true_hoisted_7 = {
  class: "login-field-set"
};
const SSOPanelvue_type_template_id_47f37d7f_scoped_true_hoisted_8 = {
  class: "login-legend"
};
const SSOPanelvue_type_template_id_47f37d7f_scoped_true_hoisted_9 = {
  class: "login-label"
};
const SSOPanelvue_type_template_id_47f37d7f_scoped_true_hoisted_10 = {
  class: "link-button-cover"
};
const SSOPanelvue_type_template_id_47f37d7f_scoped_true_hoisted_11 = ["data-domain", "onClick"];
function SSOPanelvue_type_template_id_47f37d7f_scoped_true_render(_ctx, _cache, $props, $setup, $data, $options) {
  return (0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("div", SSOPanelvue_type_template_id_47f37d7f_scoped_true_hoisted_1, [(0,runtime_core_esm_bundler/* withDirectives */.bo)((0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", SSOPanelvue_type_template_id_47f37d7f_scoped_true_hoisted_2, SSOPanelvue_type_template_id_47f37d7f_scoped_true_hoisted_5, 512), [[runtime_dom_esm_bundler/* vShow */.aG, $setup.loadingVisible]]), $setup.ssolists.length > 0 ? ((0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("div", SSOPanelvue_type_template_id_47f37d7f_scoped_true_hoisted_6, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("fieldset", SSOPanelvue_type_template_id_47f37d7f_scoped_true_hoisted_7, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("legend", SSOPanelvue_type_template_id_47f37d7f_scoped_true_hoisted_8, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("label", SSOPanelvue_type_template_id_47f37d7f_scoped_true_hoisted_9, (0,shared_esm_bundler/* toDisplayString */.v_)($props.labels.sso_label), 1)])])])) : (0,runtime_core_esm_bundler/* createCommentVNode */.Q3)("", true), ((0,runtime_core_esm_bundler/* openBlock */.uX)(true), (0,runtime_core_esm_bundler/* createElementBlock */.CE)(runtime_core_esm_bundler/* Fragment */.FK, null, (0,runtime_core_esm_bundler/* renderList */.pI)($setup.ssolists, item => {
    return (0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("div", {
      class: "login_button_layer",
      key: item.domainid
    }, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", SSOPanelvue_type_template_id_47f37d7f_scoped_true_hoisted_10, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("a", {
      class: "link-button form-control input-md fa-link-sso-biz",
      href: "javascript:void(0)",
      "data-domain": item.domainid,
      onClick: $event => _ctx.$emit('sso-selected', item)
    }, (0,shared_esm_bundler/* toDisplayString */.v_)(item.description), 9, SSOPanelvue_type_template_id_47f37d7f_scoped_true_hoisted_11)])]);
  }), 128))]);
}
;// CONCATENATED MODULE: ./src/components/form/SSOPanel.vue?vue&type=template&id=47f37d7f&scoped=true

;// CONCATENATED MODULE: ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/components/form/SSOPanel.vue?vue&type=script&lang=js



/* harmony default export */ var SSOPanelvue_type_script_lang_js = ({
  props: {
    labels: Object
  },
  emits: ["sso-selected", "sso-setting"],
  setup() {
    const ssolists = (0,reactivity_esm_bundler/* ref */.KR)([]);
    const loadingVisible = (0,reactivity_esm_bundler/* ref */.KR)(true);
    return {
      ssolists,
      loadingVisible
    };
  },
  mounted() {
    console.log("SSOPanel.vue mounted ...");
    this.$nextTick(() => {
      this.setting();
    });
  },
  methods: {
    setting() {
      console.log("SSOPanel.vue: setting ...");
      this.loadSettings();
    },
    loadSettings() {
      console.log("SSOPanel.vue loadSettings ...");
      jquery_default().ajax({
        url: (0,will_app/* getApiUrl */.e9)() + "/auth/directory/retrieve",
        type: "POST",
        dataType: "json",
        contentType: will_app/* DEFAULT_CONTENT_TYPE */.Xh,
        error: () => {
          this.loadingVisible = false;
          this.$emit("sso-setting", this.ssolists);
        },
        success: (data, status, transport) => {
          this.loadingVisible = false;
          console.log("loadSettings: success", transport.responseText);
          if (data.body?.rows) {
            this.ssolists = data.body.rows;
            this.$emit("sso-setting", this.ssolists);
          }
        }
      });
    }
  }
});
;// CONCATENATED MODULE: ./src/components/form/SSOPanel.vue?vue&type=script&lang=js
 
;// CONCATENATED MODULE: ./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-12.use[0]!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-12.use[1]!./node_modules/vue-loader/dist/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-12.use[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/components/form/SSOPanel.vue?vue&type=style&index=0&id=47f37d7f&scoped=true&lang=css
// extracted by mini-css-extract-plugin

;// CONCATENATED MODULE: ./src/components/form/SSOPanel.vue?vue&type=style&index=0&id=47f37d7f&scoped=true&lang=css

;// CONCATENATED MODULE: ./src/components/form/SSOPanel.vue




;


const SSOPanel_exports_ = /*#__PURE__*/(0,exportHelper/* default */.A)(SSOPanelvue_type_script_lang_js, [['render',SSOPanelvue_type_template_id_47f37d7f_scoped_true_render],['__scopeId',"data-v-47f37d7f"]])

/* harmony default export */ var SSOPanel = (SSOPanel_exports_);
;// CONCATENATED MODULE: ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/components/form/LoginForm.vue?vue&type=script&lang=js









const formData = {
  username: '',
  password: ''
};
/* harmony default export */ var LoginFormvue_type_script_lang_js = ({
  components: {
    SSOPanel: SSOPanel
  },
  props: {
    labels: Object,
    version: {
      type: String,
      required: false,
      default: "v1.0.0"
    },
    visible: {
      type: [String, Boolean],
      default: true
    }
  },
  emits: ["success", "forgot"],
  setup(props) {
    let localInfo = (0,reactivity_esm_bundler/* ref */.KR)({});
    let localData = (0,reactivity_esm_bundler/* ref */.KR)({
      ...formData
    });
    const reqalert = (0,reactivity_esm_bundler/* ref */.KR)(props.labels.empty_alert);
    const requiredMessage = () => {
      return validators_dist/* helpers */._$.withMessage(reqalert, validators_dist/* required */.mw);
    };
    const validateRules = (0,runtime_core_esm_bundler/* computed */.EW)(() => {
      return {
        username: {
          required: requiredMessage()
        },
        password: {
          required: requiredMessage()
        }
      };
    });
    const v$ = (0,dist/* useVuelidate */.fG)(validateRules, localData, {
      $lazy: true,
      $autoDirty: true
    });
    const hasSSO = (0,reactivity_esm_bundler/* ref */.KR)(true);
    return {
      v$,
      localInfo,
      localData,
      reqalert,
      hasSSO
    };
  },
  mounted() {
    this.$nextTick(() => {
      jquery_default()(this.$refs.main_pass).on("keydown", e => {
        if (e.which == 13) {
          this.connectServer();
        }
      });
    });
  },
  methods: {
    reset() {
      this.localData = {
        ...formData
      };
      this.v$.$reset();
    },
    focus() {
      this.$refs.main_username.focus();
    },
    success() {
      this.$emit('success', this.localInfo);
    },
    async validateForm(focusing = true) {
      const valid = await this.v$.$validate();
      if (!valid) {
        if (focusing) {
          this.focusFirstError();
        }
        return false;
      }
      return true;
    },
    focusFirstError() {
      if (this.v$.$errors && this.v$.$errors.length > 0) {
        let input = this.v$.$errors[0].$property;
        let el = this.$refs[input];
        if (el) el.focus();
      }
    },
    loginClick() {
      this.connectServer();
    },
    async connectServer() {
      let valid = await this.validateForm();
      if (!valid) return;
      this.startLogin();
    },
    startLogin() {
      let params = {
        ...this.localData
      };
      console.log("startLogin: params", params);
      (0,will_app/* startWaiting */.eF)();
      jquery_default().ajax({
        url: (0,will_app/* getApiUrl */.e9)() + "/api/sign/signin",
        type: "POST",
        contentType: will_app/* DEFAULT_CONTENT_TYPE */.Xh,
        data: JSON.stringify(params),
        dataType: "json",
        error: function (transport, status, errorThrown) {
          (0,will_app/* submitFailure */.pg)(transport, status, errorThrown, false);
        },
        success: (data, status, xhr) => {
          console.log("startLogin: responseText", xhr.responseText);
          (0,will_app/* stopWaiting */.Sk)();
          this.loginSuccess(data);
        }
      });
    },
    loginSuccess(data) {
      console.log("loginSuccess: data", data);
      if (data.head?.errorflag == "Y") {
        (0,will_app/* alertbox */.Cb)(data.head.errordesc);
      } else {
        this.localInfo = {
          ...data.body
        };
        (0,will_app/* saveAccessorInfo */.dz)(data.body);
        (0,will_app/* setupDiffie */.LM)(data);
        this.success();
      }
    },
    ssoSelected(item) {
      console.log("LoginForm.vue: sso-seleced", item);
      startSSO(item.domainid, data => {
        console.log("SSO: data", data);
        this.loginSuccess(data);
      });
    },
    ssoSetting(lists) {
      this.hasSSO = lists.length > 0;
    }
  }
});
;// CONCATENATED MODULE: ./src/components/form/LoginForm.vue?vue&type=script&lang=js
 
;// CONCATENATED MODULE: ./src/components/form/LoginForm.vue




;
const LoginForm_exports_ = /*#__PURE__*/(0,exportHelper/* default */.A)(LoginFormvue_type_script_lang_js, [['render',LoginFormvue_type_template_id_1cc29bac_render]])

/* harmony default export */ var LoginForm = (LoginForm_exports_);
;// CONCATENATED MODULE: ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/components/WorkerFrame.vue?vue&type=template&id=90acbf02

const WorkerFramevue_type_template_id_90acbf02_hoisted_1 = {
  id: "fsworkinglayer",
  class: "working-class working-control-class"
};
const WorkerFramevue_type_template_id_90acbf02_hoisted_2 = {
  ref: "pagecontainer",
  id: "pagecontainer",
  class: "pt-pager"
};
const WorkerFramevue_type_template_id_90acbf02_hoisted_3 = {
  id: "workingframe",
  name: "workingframe",
  width: "100%",
  class: "working-frame",
  title: "Working"
};
function WorkerFramevue_type_template_id_90acbf02_render(_ctx, _cache, $props, $setup, $data, $options) {
  return (0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("div", WorkerFramevue_type_template_id_90acbf02_hoisted_1, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", WorkerFramevue_type_template_id_90acbf02_hoisted_2, [((0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createBlock */.Wv)(runtime_core_esm_bundler/* KeepAlive */.PR, null, [((0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createBlock */.Wv)((0,runtime_core_esm_bundler/* resolveDynamicComponent */.$y)($setup.currentComponent), {
    visible: $setup.componentVisible,
    labels: $props.labels,
    ref: "viewComponent",
    onActivated: $options.componentActivated,
    onSuccess: $options.processSuccess
  }, null, 40, ["visible", "labels", "onActivated", "onSuccess"]))], 1024))], 512), (0,runtime_core_esm_bundler/* withDirectives */.bo)((0,runtime_core_esm_bundler/* createElementVNode */.Lk)("iframe", WorkerFramevue_type_template_id_90acbf02_hoisted_3, null, 512), [[runtime_dom_esm_bundler/* vShow */.aG, $setup.workingVisible]])]);
}
;// CONCATENATED MODULE: ./src/components/WorkerFrame.vue?vue&type=template&id=90acbf02

;// CONCATENATED MODULE: ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/components/menu/WorkerMenu.vue?vue&type=template&id=7ae3bcc6

const WorkerMenuvue_type_template_id_7ae3bcc6_hoisted_1 = {
  id: "page_first_sub",
  class: "panel-body pt-page-body",
  align: "center"
};
const WorkerMenuvue_type_template_id_7ae3bcc6_hoisted_2 = {
  class: "favor-navbox-tiles"
};
const WorkerMenuvue_type_template_id_7ae3bcc6_hoisted_3 = ["onClick", "data-pid", "data-url", "title"];
const WorkerMenuvue_type_template_id_7ae3bcc6_hoisted_4 = {
  class: "icon"
};
const WorkerMenuvue_type_template_id_7ae3bcc6_hoisted_5 = ["src"];
const WorkerMenuvue_type_template_id_7ae3bcc6_hoisted_6 = {
  class: "title"
};
function WorkerMenuvue_type_template_id_7ae3bcc6_render(_ctx, _cache, $props, $setup, $data, $options) {
  return (0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("div", {
    id: "page_first",
    class: (0,shared_esm_bundler/* normalizeClass */.C4)(["pt-page", $props.visible ? 'pt-page-current pt-page-moveFromRight' : 'pt-page-moveToRightFade'])
  }, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", WorkerMenuvue_type_template_id_7ae3bcc6_hoisted_1, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", WorkerMenuvue_type_template_id_7ae3bcc6_hoisted_2, [((0,runtime_core_esm_bundler/* openBlock */.uX)(true), (0,runtime_core_esm_bundler/* createElementBlock */.CE)(runtime_core_esm_bundler/* Fragment */.FK, null, (0,runtime_core_esm_bundler/* renderList */.pI)($setup.favorite.favorlists, (item, index) => {
    return (0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)(runtime_core_esm_bundler/* Fragment */.FK, {
      key: index
    }, [item.type != 'new' ? ((0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("a", {
      key: 0,
      href: "javascript:void(0)",
      onClick: (0,runtime_dom_esm_bundler/* withModifiers */.D$)($event => $options.openAppClick(item), ["stop"]),
      class: "tile fa-box-title fav-app fa-link-app",
      "data-pid": item.programid,
      "data-url": item.url,
      title: item.programid
    }, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", WorkerMenuvue_type_template_id_7ae3bcc6_hoisted_4, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("img", {
      class: "fa fa-app-image",
      src: $options.getAppIcon(item),
      alt: ""
    }, null, 8, WorkerMenuvue_type_template_id_7ae3bcc6_hoisted_5)]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("span", WorkerMenuvue_type_template_id_7ae3bcc6_hoisted_6, (0,shared_esm_bundler/* toDisplayString */.v_)($options.getDisplayAppName(item)), 1)], 8, WorkerMenuvue_type_template_id_7ae3bcc6_hoisted_3)) : (0,runtime_core_esm_bundler/* createCommentVNode */.Q3)("", true)], 64);
  }), 128))])])], 2);
}
;// CONCATENATED MODULE: ./src/components/menu/WorkerMenu.vue?vue&type=template&id=7ae3bcc6

;// CONCATENATED MODULE: ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/components/menu/WorkerMenu.vue?vue&type=script&lang=js





/* harmony default export */ var WorkerMenuvue_type_script_lang_js = ({
  props: {
    visible: {
      type: [String, Boolean],
      default: false
    },
    animate: {
      type: [String, Boolean],
      default: true
    }
  },
  setup(props, context) {
    const onactivated = (0,runtime_core_esm_bundler/* onActivated */.n)(() => {
      console.log("WorkerMenu.vue: onActivated ... ");
      context.emit("activated", "menu");
    });
    return {
      accessor: accessor,
      favorite: favorite,
      onactivated
    };
  },
  mounted() {
    console.log("WorkerMenu.vue mounted ...");
  },
  methods: {
    getAppIcon(item) {
      return item.iconfile && item.iconfile.trim().length > 0 ? (0,will_app/* getImgUrl */.xn)() + "/img/apps/" + item.iconfile : this.getDefaultAppIcon();
    },
    getDefaultAppIcon() {
      return (0,will_app/* getImgUrl */.xn)() + "/img/apps/application.png";
    },
    getDisplayAppName(item) {
      return this.accessor.lang === 'EN' ? item.shortname : item.shortnameth;
    },
    openAppClick(item) {
      openPage(item, this.accessor, this.favorite);
    }
  }
});
;// CONCATENATED MODULE: ./src/components/menu/WorkerMenu.vue?vue&type=script&lang=js
 
;// CONCATENATED MODULE: ./src/components/menu/WorkerMenu.vue




;
const WorkerMenu_exports_ = /*#__PURE__*/(0,exportHelper/* default */.A)(WorkerMenuvue_type_script_lang_js, [['render',WorkerMenuvue_type_template_id_7ae3bcc6_render]])

/* harmony default export */ var WorkerMenu = (WorkerMenu_exports_);
;// CONCATENATED MODULE: ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/components/form/ProfileForm.vue?vue&type=template&id=6c27dc18

const ProfileFormvue_type_template_id_6c27dc18_hoisted_1 = {
  id: "page_profile",
  class: "pt-page pt-page-current pt-page-controller"
};
const ProfileFormvue_type_template_id_6c27dc18_hoisted_2 = {
  class: "page-header-title",
  title: "page_profile"
};
const ProfileFormvue_type_template_id_6c27dc18_hoisted_3 = {
  id: "profile_entrypanel"
};
const ProfileFormvue_type_template_id_6c27dc18_hoisted_4 = {
  id: "profile_entrylayer",
  class: "entry-layer"
};
const ProfileFormvue_type_template_id_6c27dc18_hoisted_5 = {
  class: "portal-area sub-entry-layer"
};
const ProfileFormvue_type_template_id_6c27dc18_hoisted_6 = {
  class: "row row-height"
};
const ProfileFormvue_type_template_id_6c27dc18_hoisted_7 = {
  class: "col-md-3 col-height col-label"
};
const ProfileFormvue_type_template_id_6c27dc18_hoisted_8 = {
  id: "usertname_label",
  class: "control-label",
  required: "true"
};
const ProfileFormvue_type_template_id_6c27dc18_hoisted_9 = ["placeholder"];
const ProfileFormvue_type_template_id_6c27dc18_hoisted_10 = {
  key: 0,
  class: "has-error"
};
const ProfileFormvue_type_template_id_6c27dc18_hoisted_11 = {
  class: "row row-height"
};
const ProfileFormvue_type_template_id_6c27dc18_hoisted_12 = {
  class: "col-md-3 col-height col-label"
};
const ProfileFormvue_type_template_id_6c27dc18_hoisted_13 = {
  id: "usertsurname_label",
  class: "control-label",
  required: "true"
};
const ProfileFormvue_type_template_id_6c27dc18_hoisted_14 = ["placeholder"];
const ProfileFormvue_type_template_id_6c27dc18_hoisted_15 = {
  key: 0,
  class: "has-error"
};
const ProfileFormvue_type_template_id_6c27dc18_hoisted_16 = {
  class: "row row-height"
};
const ProfileFormvue_type_template_id_6c27dc18_hoisted_17 = {
  class: "col-md-3 col-height col-label"
};
const ProfileFormvue_type_template_id_6c27dc18_hoisted_18 = {
  id: "userename_label",
  class: "control-label",
  required: "true"
};
const ProfileFormvue_type_template_id_6c27dc18_hoisted_19 = ["placeholder"];
const ProfileFormvue_type_template_id_6c27dc18_hoisted_20 = {
  key: 0,
  class: "has-error"
};
const ProfileFormvue_type_template_id_6c27dc18_hoisted_21 = {
  class: "row row-height"
};
const ProfileFormvue_type_template_id_6c27dc18_hoisted_22 = {
  class: "col-md-3 col-height col-label"
};
const ProfileFormvue_type_template_id_6c27dc18_hoisted_23 = {
  id: "useresurname_label",
  class: "control-label",
  required: "true"
};
const ProfileFormvue_type_template_id_6c27dc18_hoisted_24 = ["placeholder"];
const ProfileFormvue_type_template_id_6c27dc18_hoisted_25 = {
  key: 0,
  class: "has-error"
};
const ProfileFormvue_type_template_id_6c27dc18_hoisted_26 = {
  class: "row row-height"
};
const ProfileFormvue_type_template_id_6c27dc18_hoisted_27 = {
  class: "col-md-3 col-height col-label"
};
const ProfileFormvue_type_template_id_6c27dc18_hoisted_28 = {
  id: "displayname_label",
  class: "control-label"
};
const ProfileFormvue_type_template_id_6c27dc18_hoisted_29 = {
  key: 0,
  class: "has-error"
};
const ProfileFormvue_type_template_id_6c27dc18_hoisted_30 = {
  class: "row row-height"
};
const ProfileFormvue_type_template_id_6c27dc18_hoisted_31 = {
  class: "col-md-3 col-height col-label"
};
const ProfileFormvue_type_template_id_6c27dc18_hoisted_32 = {
  id: "email_label",
  class: "control-label"
};
const ProfileFormvue_type_template_id_6c27dc18_hoisted_33 = ["placeholder"];
const ProfileFormvue_type_template_id_6c27dc18_hoisted_34 = {
  key: 0,
  class: "has-error"
};
const ProfileFormvue_type_template_id_6c27dc18_hoisted_35 = {
  class: "row row-height"
};
const ProfileFormvue_type_template_id_6c27dc18_hoisted_36 = {
  class: "col-md-3 col-height col-label"
};
const ProfileFormvue_type_template_id_6c27dc18_hoisted_37 = {
  id: "mobile_label",
  class: "control-label"
};
const ProfileFormvue_type_template_id_6c27dc18_hoisted_38 = {
  class: "col-md-3 col-height"
};
const ProfileFormvue_type_template_id_6c27dc18_hoisted_39 = ["placeholder"];
const ProfileFormvue_type_template_id_6c27dc18_hoisted_40 = {
  class: "row row-height"
};
const ProfileFormvue_type_template_id_6c27dc18_hoisted_41 = {
  class: "col-md-3 col-height col-label"
};
const ProfileFormvue_type_template_id_6c27dc18_hoisted_42 = {
  id: "lineid_label",
  class: "control-label"
};
const ProfileFormvue_type_template_id_6c27dc18_hoisted_43 = {
  class: "col-md-3 col-height"
};
const ProfileFormvue_type_template_id_6c27dc18_hoisted_44 = ["placeholder"];
const ProfileFormvue_type_template_id_6c27dc18_hoisted_45 = {
  class: "row row-height"
};
const _hoisted_46 = {
  class: "col-md-3 col-height col-label"
};
const _hoisted_47 = {
  id: "langcode_label",
  class: "control-label"
};
const _hoisted_48 = {
  class: "col-md-3 col-height"
};
const _hoisted_49 = /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("option", {
  value: ""
}, null, -1);
const _hoisted_50 = ["value"];
const _hoisted_51 = {
  class: "row row-height"
};
const _hoisted_52 = {
  class: "col-md-12 float-right pull-right text-right btn-ctrl-cover",
  id: "buttoncoverlayer"
};
const _hoisted_53 = /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("em", {
  class: "fa fa-save fa-btn-icon"
}, null, -1);
function ProfileFormvue_type_template_id_6c27dc18_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_LoadingPage = (0,runtime_core_esm_bundler/* resolveComponent */.g2)("LoadingPage");
  return (0,runtime_core_esm_bundler/* withDirectives */.bo)(((0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("div", ProfileFormvue_type_template_id_6c27dc18_hoisted_1, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("h1", ProfileFormvue_type_template_id_6c27dc18_hoisted_2, (0,shared_esm_bundler/* toDisplayString */.v_)($props.labels.profile_caption), 1), (0,runtime_core_esm_bundler/* createVNode */.bF)(_component_LoadingPage, {
    visible: $setup.loadVisible
  }, null, 8, ["visible"]), (0,runtime_core_esm_bundler/* withDirectives */.bo)((0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", ProfileFormvue_type_template_id_6c27dc18_hoisted_3, [(0,runtime_core_esm_bundler/* withDirectives */.bo)((0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", ProfileFormvue_type_template_id_6c27dc18_hoisted_4, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", ProfileFormvue_type_template_id_6c27dc18_hoisted_5, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", ProfileFormvue_type_template_id_6c27dc18_hoisted_6, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", ProfileFormvue_type_template_id_6c27dc18_hoisted_7, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("label", ProfileFormvue_type_template_id_6c27dc18_hoisted_8, (0,shared_esm_bundler/* toDisplayString */.v_)($props.labels.usertname_label), 1)]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", {
    class: (0,shared_esm_bundler/* normalizeClass */.C4)(["col-md-5 col-height", {
      'has-error': $setup.v$.usertname.$error
    }])
  }, [(0,runtime_core_esm_bundler/* withDirectives */.bo)((0,runtime_core_esm_bundler/* createElementVNode */.Lk)("input", {
    ref: "usertname",
    class: "form-control input-md alert-input",
    id: "usertname",
    name: "usertname",
    placeholder: $props.labels.usertname_label,
    autocomplete: "off",
    size: "50",
    "onUpdate:modelValue": _cache[0] || (_cache[0] = $event => $setup.localData.usertname = $event)
  }, null, 8, ProfileFormvue_type_template_id_6c27dc18_hoisted_9), [[runtime_dom_esm_bundler/* vModelText */.Jo, $setup.localData.usertname]]), $setup.v$.usertname.$error ? ((0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("span", ProfileFormvue_type_template_id_6c27dc18_hoisted_10, (0,shared_esm_bundler/* toDisplayString */.v_)($setup.v$.usertname.$errors[0].$message), 1)) : (0,runtime_core_esm_bundler/* createCommentVNode */.Q3)("", true)], 2)]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", ProfileFormvue_type_template_id_6c27dc18_hoisted_11, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", ProfileFormvue_type_template_id_6c27dc18_hoisted_12, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("label", ProfileFormvue_type_template_id_6c27dc18_hoisted_13, (0,shared_esm_bundler/* toDisplayString */.v_)($props.labels.usertsurname_label), 1)]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", {
    class: (0,shared_esm_bundler/* normalizeClass */.C4)(["col-md-5 col-height", {
      'has-error': $setup.v$.usertsurname.$error
    }])
  }, [(0,runtime_core_esm_bundler/* withDirectives */.bo)((0,runtime_core_esm_bundler/* createElementVNode */.Lk)("input", {
    ref: "usertsurname",
    class: "form-control input-md alert-input",
    id: "usertsurname",
    name: "usertsurname",
    placeholder: $props.labels.usertsurname_label,
    autocomplete: "off",
    size: "50",
    "onUpdate:modelValue": _cache[1] || (_cache[1] = $event => $setup.localData.usertsurname = $event)
  }, null, 8, ProfileFormvue_type_template_id_6c27dc18_hoisted_14), [[runtime_dom_esm_bundler/* vModelText */.Jo, $setup.localData.usertsurname]]), $setup.v$.usertsurname.$error ? ((0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("span", ProfileFormvue_type_template_id_6c27dc18_hoisted_15, (0,shared_esm_bundler/* toDisplayString */.v_)($setup.v$.usertsurname.$errors[0].$message), 1)) : (0,runtime_core_esm_bundler/* createCommentVNode */.Q3)("", true)], 2)]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", ProfileFormvue_type_template_id_6c27dc18_hoisted_16, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", ProfileFormvue_type_template_id_6c27dc18_hoisted_17, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("label", ProfileFormvue_type_template_id_6c27dc18_hoisted_18, (0,shared_esm_bundler/* toDisplayString */.v_)($props.labels.userename_label), 1)]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", {
    class: (0,shared_esm_bundler/* normalizeClass */.C4)(["col-md-5 col-height", {
      'has-error': $setup.v$.userename.$error
    }])
  }, [(0,runtime_core_esm_bundler/* withDirectives */.bo)((0,runtime_core_esm_bundler/* createElementVNode */.Lk)("input", {
    ref: "userename",
    class: "form-control input-md alert-input",
    id: "userename",
    name: "userename",
    placeholder: $props.labels.userename_label,
    autocomplete: "off",
    size: "50",
    "onUpdate:modelValue": _cache[2] || (_cache[2] = $event => $setup.localData.userename = $event)
  }, null, 8, ProfileFormvue_type_template_id_6c27dc18_hoisted_19), [[runtime_dom_esm_bundler/* vModelText */.Jo, $setup.localData.userename]]), $setup.v$.userename.$error ? ((0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("span", ProfileFormvue_type_template_id_6c27dc18_hoisted_20, (0,shared_esm_bundler/* toDisplayString */.v_)($setup.v$.userename.$errors[0].$message), 1)) : (0,runtime_core_esm_bundler/* createCommentVNode */.Q3)("", true)], 2)]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", ProfileFormvue_type_template_id_6c27dc18_hoisted_21, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", ProfileFormvue_type_template_id_6c27dc18_hoisted_22, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("label", ProfileFormvue_type_template_id_6c27dc18_hoisted_23, (0,shared_esm_bundler/* toDisplayString */.v_)($props.labels.useresurname_label), 1)]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", {
    class: (0,shared_esm_bundler/* normalizeClass */.C4)(["col-md-5 col-height", {
      'has-error': $setup.v$.useresurname.$error
    }])
  }, [(0,runtime_core_esm_bundler/* withDirectives */.bo)((0,runtime_core_esm_bundler/* createElementVNode */.Lk)("input", {
    ref: "useresurname",
    class: "form-control input-md alert-input",
    id: "useresurname",
    name: "useresurname",
    placeholder: $props.labels.useresurname_label,
    autocomplete: "off",
    size: "50",
    "onUpdate:modelValue": _cache[3] || (_cache[3] = $event => $setup.localData.useresurname = $event)
  }, null, 8, ProfileFormvue_type_template_id_6c27dc18_hoisted_24), [[runtime_dom_esm_bundler/* vModelText */.Jo, $setup.localData.useresurname]]), $setup.v$.useresurname.$error ? ((0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("span", ProfileFormvue_type_template_id_6c27dc18_hoisted_25, (0,shared_esm_bundler/* toDisplayString */.v_)($setup.v$.useresurname.$errors[0].$message), 1)) : (0,runtime_core_esm_bundler/* createCommentVNode */.Q3)("", true)], 2)]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", ProfileFormvue_type_template_id_6c27dc18_hoisted_26, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", ProfileFormvue_type_template_id_6c27dc18_hoisted_27, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("label", ProfileFormvue_type_template_id_6c27dc18_hoisted_28, (0,shared_esm_bundler/* toDisplayString */.v_)($props.labels.displayname_label), 1)]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", {
    class: (0,shared_esm_bundler/* normalizeClass */.C4)(["col-md-3 col-height", {
      'has-error': $setup.v$.displayname.$error
    }])
  }, [(0,runtime_core_esm_bundler/* withDirectives */.bo)((0,runtime_core_esm_bundler/* createElementVNode */.Lk)("input", {
    ref: "displayname",
    class: "form-control input-md alert-input",
    id: "displayname",
    name: "displayname",
    autocomplete: "off",
    size: "50",
    "onUpdate:modelValue": _cache[4] || (_cache[4] = $event => $setup.localData.displayname = $event)
  }, null, 512), [[runtime_dom_esm_bundler/* vModelText */.Jo, $setup.localData.displayname]]), $setup.v$.displayname.$error ? ((0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("span", ProfileFormvue_type_template_id_6c27dc18_hoisted_29, (0,shared_esm_bundler/* toDisplayString */.v_)($setup.v$.displayname.$errors[0].$message), 1)) : (0,runtime_core_esm_bundler/* createCommentVNode */.Q3)("", true)], 2)]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", ProfileFormvue_type_template_id_6c27dc18_hoisted_30, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", ProfileFormvue_type_template_id_6c27dc18_hoisted_31, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("label", ProfileFormvue_type_template_id_6c27dc18_hoisted_32, (0,shared_esm_bundler/* toDisplayString */.v_)($props.labels.email_label), 1)]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", {
    class: (0,shared_esm_bundler/* normalizeClass */.C4)(["col-md-3 col-height", {
      'has-error': $setup.v$.email.$error
    }])
  }, [(0,runtime_core_esm_bundler/* withDirectives */.bo)((0,runtime_core_esm_bundler/* createElementVNode */.Lk)("input", {
    ref: "email",
    class: "form-control input-md alert-input",
    id: "email",
    name: "email",
    placeholder: $props.labels.email_label,
    autocomplete: "off",
    size: "30",
    "onUpdate:modelValue": _cache[5] || (_cache[5] = $event => $setup.localData.email = $event)
  }, null, 8, ProfileFormvue_type_template_id_6c27dc18_hoisted_33), [[runtime_dom_esm_bundler/* vModelText */.Jo, $setup.localData.email]]), $setup.v$.email.$error ? ((0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("span", ProfileFormvue_type_template_id_6c27dc18_hoisted_34, (0,shared_esm_bundler/* toDisplayString */.v_)($setup.v$.email.$errors[0].$message), 1)) : (0,runtime_core_esm_bundler/* createCommentVNode */.Q3)("", true)], 2)]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", ProfileFormvue_type_template_id_6c27dc18_hoisted_35, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", ProfileFormvue_type_template_id_6c27dc18_hoisted_36, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("label", ProfileFormvue_type_template_id_6c27dc18_hoisted_37, (0,shared_esm_bundler/* toDisplayString */.v_)($props.labels.mobile_label), 1)]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", ProfileFormvue_type_template_id_6c27dc18_hoisted_38, [(0,runtime_core_esm_bundler/* withDirectives */.bo)((0,runtime_core_esm_bundler/* createElementVNode */.Lk)("input", {
    ref: "mobile",
    class: "form-control input-md",
    id: "mobile",
    name: "mobile",
    placeholder: $props.labels.mobile_label,
    autocomplete: "off",
    size: "20",
    "onUpdate:modelValue": _cache[6] || (_cache[6] = $event => $setup.localData.mobile = $event)
  }, null, 8, ProfileFormvue_type_template_id_6c27dc18_hoisted_39), [[runtime_dom_esm_bundler/* vModelText */.Jo, $setup.localData.mobile]])])]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", ProfileFormvue_type_template_id_6c27dc18_hoisted_40, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", ProfileFormvue_type_template_id_6c27dc18_hoisted_41, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("label", ProfileFormvue_type_template_id_6c27dc18_hoisted_42, (0,shared_esm_bundler/* toDisplayString */.v_)($props.labels.lineid_label), 1)]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", ProfileFormvue_type_template_id_6c27dc18_hoisted_43, [(0,runtime_core_esm_bundler/* withDirectives */.bo)((0,runtime_core_esm_bundler/* createElementVNode */.Lk)("input", {
    ref: "lineid",
    class: "form-control input-md",
    id: "lineid",
    name: "lineid",
    placeholder: $props.labels.lineid_label,
    autocomplete: "off",
    size: "50",
    "onUpdate:modelValue": _cache[7] || (_cache[7] = $event => $setup.localData.lineid = $event)
  }, null, 8, ProfileFormvue_type_template_id_6c27dc18_hoisted_44), [[runtime_dom_esm_bundler/* vModelText */.Jo, $setup.localData.lineid]])])]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", ProfileFormvue_type_template_id_6c27dc18_hoisted_45, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", _hoisted_46, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("label", _hoisted_47, (0,shared_esm_bundler/* toDisplayString */.v_)($props.labels.langcode_label), 1)]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", _hoisted_48, [(0,runtime_core_esm_bundler/* withDirectives */.bo)((0,runtime_core_esm_bundler/* createElementVNode */.Lk)("select", {
    ref: "langcode",
    class: "form-control input-md",
    "onUpdate:modelValue": _cache[8] || (_cache[8] = $event => $setup.localData.langcode = $event)
  }, [_hoisted_49, ((0,runtime_core_esm_bundler/* openBlock */.uX)(true), (0,runtime_core_esm_bundler/* createElementBlock */.CE)(runtime_core_esm_bundler/* Fragment */.FK, null, (0,runtime_core_esm_bundler/* renderList */.pI)($setup.langlists, item => {
    return (0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("option", {
      key: item.typeid,
      value: item.typeid
    }, (0,shared_esm_bundler/* toDisplayString */.v_)($options.getDisplayLanguageName(item)), 9, _hoisted_50);
  }), 128))], 512), [[runtime_dom_esm_bundler/* vModelSelect */.u1, $setup.localData.langcode]])])]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", _hoisted_51, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", _hoisted_52, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("button", {
    class: "btn btn-dark btn-sm",
    onClick: _cache[9] || (_cache[9] = (0,runtime_dom_esm_bundler/* withModifiers */.D$)((...args) => $options.saveClick && $options.saveClick(...args), ["stop"]))
  }, [_hoisted_53, (0,runtime_core_esm_bundler/* createTextVNode */.eW)(" " + (0,shared_esm_bundler/* toDisplayString */.v_)($props.labels.save_button), 1)])])])])], 512), [[runtime_dom_esm_bundler/* vShow */.aG, $setup.infoVisible]]), (0,runtime_core_esm_bundler/* withDirectives */.bo)((0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", {
    class: "entry-layer entry-not-found"
  }, (0,shared_esm_bundler/* toDisplayString */.v_)($props.labels.profilenotfound_label), 513), [[runtime_dom_esm_bundler/* vShow */.aG, $setup.notfoundVisible]])], 512), [[runtime_dom_esm_bundler/* vShow */.aG, $setup.loadVisible == false]])], 512)), [[runtime_dom_esm_bundler/* vShow */.aG, $props.visible]]);
}
;// CONCATENATED MODULE: ./src/components/form/ProfileForm.vue?vue&type=template&id=6c27dc18

;// CONCATENATED MODULE: ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/controls/LoadingPage.vue?vue&type=template&id=844669f2&scoped=true

const LoadingPagevue_type_template_id_844669f2_scoped_true_withScopeId = n => ((0,runtime_core_esm_bundler/* pushScopeId */.Qi)("data-v-844669f2"), n = n(), (0,runtime_core_esm_bundler/* popScopeId */.jt)(), n);
const LoadingPagevue_type_template_id_844669f2_scoped_true_hoisted_1 = {
  class: "loading-layer"
};
const LoadingPagevue_type_template_id_844669f2_scoped_true_hoisted_2 = {
  class: "loading-span"
};
const LoadingPagevue_type_template_id_844669f2_scoped_true_hoisted_3 = /*#__PURE__*/LoadingPagevue_type_template_id_844669f2_scoped_true_withScopeId(() => /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("em", {
  class: "fa fa-spinner fa-spin"
}, null, -1));
const LoadingPagevue_type_template_id_844669f2_scoped_true_hoisted_4 = [LoadingPagevue_type_template_id_844669f2_scoped_true_hoisted_3];
const LoadingPagevue_type_template_id_844669f2_scoped_true_hoisted_5 = /*#__PURE__*/LoadingPagevue_type_template_id_844669f2_scoped_true_withScopeId(() => /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("br", null, null, -1));
const LoadingPagevue_type_template_id_844669f2_scoped_true_hoisted_6 = /*#__PURE__*/LoadingPagevue_type_template_id_844669f2_scoped_true_withScopeId(() => /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("span", null, "Loading ...", -1));
function LoadingPagevue_type_template_id_844669f2_scoped_true_render(_ctx, _cache, $props, $setup, $data, $options) {
  return (0,runtime_core_esm_bundler/* withDirectives */.bo)(((0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("div", LoadingPagevue_type_template_id_844669f2_scoped_true_hoisted_1, [(0,runtime_core_esm_bundler/* withDirectives */.bo)((0,runtime_core_esm_bundler/* createElementVNode */.Lk)("span", LoadingPagevue_type_template_id_844669f2_scoped_true_hoisted_2, LoadingPagevue_type_template_id_844669f2_scoped_true_hoisted_4, 512), [[runtime_dom_esm_bundler/* vShow */.aG, $props.animate]]), LoadingPagevue_type_template_id_844669f2_scoped_true_hoisted_5, LoadingPagevue_type_template_id_844669f2_scoped_true_hoisted_6, (0,runtime_core_esm_bundler/* renderSlot */.RG)(_ctx.$slots, "default", {}, undefined, true)], 512)), [[runtime_dom_esm_bundler/* vShow */.aG, $props.visible]]);
}
;// CONCATENATED MODULE: ./src/controls/LoadingPage.vue?vue&type=template&id=844669f2&scoped=true

;// CONCATENATED MODULE: ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/controls/LoadingPage.vue?vue&type=script&lang=js
/* harmony default export */ var LoadingPagevue_type_script_lang_js = ({
  props: {
    visible: {
      type: [String, Boolean],
      default: true
    },
    animate: {
      type: [String, Boolean],
      default: true
    }
  },
  setup() {}
});
;// CONCATENATED MODULE: ./src/controls/LoadingPage.vue?vue&type=script&lang=js
 
;// CONCATENATED MODULE: ./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-12.use[0]!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-12.use[1]!./node_modules/vue-loader/dist/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-12.use[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/controls/LoadingPage.vue?vue&type=style&index=0&id=844669f2&scoped=true&lang=css
// extracted by mini-css-extract-plugin

;// CONCATENATED MODULE: ./src/controls/LoadingPage.vue?vue&type=style&index=0&id=844669f2&scoped=true&lang=css

;// CONCATENATED MODULE: ./src/controls/LoadingPage.vue




;


const LoadingPage_exports_ = /*#__PURE__*/(0,exportHelper/* default */.A)(LoadingPagevue_type_script_lang_js, [['render',LoadingPagevue_type_template_id_844669f2_scoped_true_render],['__scopeId',"data-v-844669f2"]])

/* harmony default export */ var LoadingPage = (LoadingPage_exports_);
;// CONCATENATED MODULE: ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/components/form/ProfileForm.vue?vue&type=script&lang=js








const ProfileFormvue_type_script_lang_js_formData = {
  usertname: '',
  usertsurname: '',
  userename: '',
  useresurname: '',
  displayname: '',
  email: '',
  mobile: '',
  lineid: '',
  langcode: ''
};
/* harmony default export */ var ProfileFormvue_type_script_lang_js = ({
  components: {
    LoadingPage: LoadingPage
  },
  props: {
    labels: Object,
    visible: {
      type: [String, Boolean],
      default: false
    }
  },
  emits: ["success"],
  setup(props, context) {
    const localData = (0,reactivity_esm_bundler/* ref */.KR)({
      ...ProfileFormvue_type_script_lang_js_formData
    });
    const loadVisible = (0,reactivity_esm_bundler/* ref */.KR)(true);
    const infoVisible = (0,reactivity_esm_bundler/* ref */.KR)(true);
    const notfoundVisible = (0,reactivity_esm_bundler/* ref */.KR)(false);
    const langlists = (0,reactivity_esm_bundler/* ref */.KR)([]);
    const reqalert = (0,reactivity_esm_bundler/* ref */.KR)(props.labels.empty_alert);
    const emailalert = (0,reactivity_esm_bundler/* ref */.KR)(props.labels.email_alert);
    const requiredMessage = () => {
      return validators_dist/* helpers */._$.withMessage(reqalert, validators_dist/* required */.mw);
    };
    const emailMessage = () => {
      return validators_dist/* helpers */._$.withMessage(emailalert, validators_dist/* email */.Rp);
    };
    const validateRules = (0,runtime_core_esm_bundler/* computed */.EW)(() => {
      return {
        usertname: {
          required: requiredMessage()
        },
        usertsurname: {
          required: requiredMessage()
        },
        userename: {
          required: requiredMessage()
        },
        useresurname: {
          required: requiredMessage()
        },
        displayname: {
          required: requiredMessage()
        },
        email: {
          required: requiredMessage(),
          email: emailMessage()
        }
      };
    });
    const v$ = (0,dist/* useVuelidate */.fG)(validateRules, localData, {
      $lazy: true,
      $autoDirty: true
    });
    const onactivated = (0,runtime_core_esm_bundler/* onActivated */.n)(() => {
      console.log("ProfileForm.vue: onActivated ... ");
      context.emit("activated", "profile");
    });
    return {
      accessor: accessor,
      v$,
      localData,
      reqalert,
      emailalert,
      loadVisible,
      infoVisible,
      notfoundVisible,
      langlists,
      onactivated
    };
  },
  created() {
    (0,runtime_core_esm_bundler/* watch */.wB)(this.$props, newProps => {
      this.reqalert = newProps.labels.empty_alert;
      this.emailalert = newProps.labels.email_alert;
    });
  },
  mounted() {
    console.log("ProfileForm.vue mounted ...");
    this.$nextTick(() => {
      this.setting();
    });
  },
  methods: {
    reset() {
      this.localData = {
        ...ProfileFormvue_type_script_lang_js_formData
      };
      this.v$.$reset();
      this.infoVisible = true;
      this.notfoundVisible = false;
    },
    setting() {
      console.log("ProfileForm.vue: setting ...");
      this.loadLanguages();
    },
    focus() {
      this.$refs.usertname.focus();
    },
    success() {
      this.$emit('success', "profile", this.localData);
    },
    async validateForm(focusing = true) {
      const valid = await this.v$.$validate();
      console.log("validate form: valid", valid);
      console.log("error:", this.v$.$errors);
      if (!valid) {
        if (focusing) {
          this.focusFirstError();
        }
        return false;
      }
      return true;
    },
    focusFirstError() {
      if (this.v$.$errors && this.v$.$errors.length > 0) {
        let input = this.v$.$errors[0].$property;
        let el = this.$refs[input];
        if (el) el.focus();else jquery_default()("#" + input).trigger("focus");
      }
    },
    loadLanguages() {
      console.log("ProfileForm.vue loadLanguages ...");
      let params = {
        names: "tklanguage"
      };
      let formdata = (0,will_app/* serializeParameters */.L3)({
        ajax: true
      }, params, true);
      jquery_default().ajax({
        url: (0,will_app/* getApiUrl */.e9)() + "/api/category/lists",
        data: formdata.jsondata,
        headers: formdata.headers,
        type: "POST",
        dataType: "json",
        contentType: will_app/* DEFAULT_CONTENT_TYPE */.Xh,
        success: (data, status, transport) => {
          console.log("loadLanguages: success", transport.responseText);
          if (data.body?.length > 0) {
            let ds = data.body[0];
            if (ds.resultset?.rows) {
              this.langlists = ds.resultset.rows;
            }
          }
        }
      });
    },
    getDisplayLanguageName(item) {
      return this.accessor.lang === 'EN' ? item.nameen : item.nameth;
    },
    async saveClick() {
      console.log("click: save");
      let valid = await this.validateForm();
      if (!valid) return;
      this.startSaveRecord();
    },
    startSaveRecord() {
      (0,will_app/* confirmSave */.ex)(() => {
        this.saveRecord(this.localData);
      });
    },
    saveRecord(dataRecord) {
      let jsondata = {
        ajax: true
      };
      let formdata = (0,will_app/* serializeParameters */.L3)(jsondata, dataRecord);
      (0,will_app/* startWaiting */.eF)();
      jquery_default().ajax({
        url: (0,will_app/* getApiUrl */.e9)() + "/api/profile/update",
        data: formdata.jsondata,
        headers: formdata.headers,
        type: "POST",
        dataType: "json",
        contentType: will_app/* DEFAULT_CONTENT_TYPE */.Xh,
        error: function (transport, status, errorThrown) {
          (0,will_app/* submitFailure */.pg)(transport, status, errorThrown, false);
        },
        success: (data, status, xhr) => {
          console.log("saveRecord: success : ", xhr.responseText);
          (0,will_app/* stopWaiting */.Sk)();
          this.saveSuccess(data);
        }
      });
    },
    saveSuccess(data) {
      console.log("saveSuccess : ", data);
      if (data.head?.errorflag == "Y") {
        (0,will_app/* alertbox */.Cb)(data.head.errordesc);
      } else {
        (0,will_app/* successbox */.hM)(() => {
          this.success();
        });
      }
    },
    display() {
      this.reset();
      this.retrieve(show => {
        if (show) this.focus();
      });
    },
    retrieve(callback) {
      console.log("retrieve: info", this.accessor);
      if (this.accessor.info?.userid) {
        this.loadVisible = true;
        //try to get profile info
        let params = {
          userid: this.accessor.info?.userid
        };
        let jsondata = {
          ajax: true
        };
        let formdata = (0,will_app/* serializeParameters */.L3)(jsondata, params);
        (0,will_app/* startWaiting */.eF)();
        jquery_default().ajax({
          url: (0,will_app/* getApiUrl */.e9)() + "/api/profile/get",
          data: formdata.jsondata,
          headers: formdata.headers,
          type: "POST",
          dataType: "json",
          contentType: will_app/* DEFAULT_CONTENT_TYPE */.Xh,
          error: function (transport, status, errorThrown) {
            (0,will_app/* submitFailure */.pg)(transport, status, errorThrown, false);
          },
          success: data => {
            (0,will_app/* stopWaiting */.Sk)();
            this.retrieveSuccess(data, callback);
          }
        });
      }
    },
    retrieveSuccess(data, callback) {
      console.log("ProfileForm.vue: retrieveSuccess", data);
      if (data.head?.errorflag == "Y") {
        (0,will_app/* alertbox */.Cb)(data.head.errordesc);
      } else {
        this.loadVisible = false;
        if (data.body?.rows?.length > 0) {
          this.localData = {
            ...data.body.rows[0]
          };
          this.infoVisible = true;
          this.notfoundVisible = false;
          if (callback) callback(true);
        } else {
          this.infoVisible = false;
          this.notfoundVisible = true;
          if (callback) callback(false);
        }
      }
    }
  }
});
;// CONCATENATED MODULE: ./src/components/form/ProfileForm.vue?vue&type=script&lang=js
 
;// CONCATENATED MODULE: ./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-12.use[0]!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-12.use[1]!./node_modules/vue-loader/dist/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-12.use[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/components/form/ProfileForm.vue?vue&type=style&index=0&id=6c27dc18&lang=css
// extracted by mini-css-extract-plugin

;// CONCATENATED MODULE: ./src/components/form/ProfileForm.vue?vue&type=style&index=0&id=6c27dc18&lang=css

;// CONCATENATED MODULE: ./src/components/form/ProfileForm.vue




;


const ProfileForm_exports_ = /*#__PURE__*/(0,exportHelper/* default */.A)(ProfileFormvue_type_script_lang_js, [['render',ProfileFormvue_type_template_id_6c27dc18_render]])

/* harmony default export */ var ProfileForm = (ProfileForm_exports_);
;// CONCATENATED MODULE: ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/components/form/ChangeForm.vue?vue&type=template&id=07b590fc

const ChangeFormvue_type_template_id_07b590fc_hoisted_1 = {
  class: "page-header-title",
  title: "page_change"
};
const ChangeFormvue_type_template_id_07b590fc_hoisted_2 = {
  id: "change_entrypanel"
};
const ChangeFormvue_type_template_id_07b590fc_hoisted_3 = {
  id: "change_entrylayer",
  class: "entry-layer"
};
const ChangeFormvue_type_template_id_07b590fc_hoisted_4 = {
  class: "portal-area sub-entry-layer"
};
const ChangeFormvue_type_template_id_07b590fc_hoisted_5 = {
  class: "row row-height"
};
const ChangeFormvue_type_template_id_07b590fc_hoisted_6 = /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", {
  class: "col-md-3 col-height col-label"
}, " ", -1);
const ChangeFormvue_type_template_id_07b590fc_hoisted_7 = {
  class: "col-md-7 col-height"
};
const ChangeFormvue_type_template_id_07b590fc_hoisted_8 = {
  class: "row row-height"
};
const ChangeFormvue_type_template_id_07b590fc_hoisted_9 = {
  class: "col-md-3 col-height col-label"
};
const ChangeFormvue_type_template_id_07b590fc_hoisted_10 = {
  id: "oldpassword_label",
  class: "control-label",
  required: "true"
};
const ChangeFormvue_type_template_id_07b590fc_hoisted_11 = ["placeholder"];
const ChangeFormvue_type_template_id_07b590fc_hoisted_12 = {
  key: 0,
  class: "has-error"
};
const ChangeFormvue_type_template_id_07b590fc_hoisted_13 = {
  class: "row row-height"
};
const ChangeFormvue_type_template_id_07b590fc_hoisted_14 = {
  class: "col-md-3 col-height col-label text-right"
};
const ChangeFormvue_type_template_id_07b590fc_hoisted_15 = {
  id: "userpassword_label",
  class: "control-label",
  required: "true"
};
const ChangeFormvue_type_template_id_07b590fc_hoisted_16 = ["placeholder"];
const ChangeFormvue_type_template_id_07b590fc_hoisted_17 = {
  key: 0,
  class: "has-error"
};
const ChangeFormvue_type_template_id_07b590fc_hoisted_18 = {
  class: "row row-height"
};
const ChangeFormvue_type_template_id_07b590fc_hoisted_19 = {
  class: "col-md-3 col-height col-label text-right"
};
const ChangeFormvue_type_template_id_07b590fc_hoisted_20 = {
  id: "confirmpassword_label",
  class: "control-label",
  required: "true"
};
const ChangeFormvue_type_template_id_07b590fc_hoisted_21 = ["placeholder"];
const ChangeFormvue_type_template_id_07b590fc_hoisted_22 = {
  key: 0,
  class: "has-error"
};
const ChangeFormvue_type_template_id_07b590fc_hoisted_23 = {
  class: "row row-height"
};
const ChangeFormvue_type_template_id_07b590fc_hoisted_24 = /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", {
  class: "col-md-3 col-height col-label text-right"
}, null, -1);
const ChangeFormvue_type_template_id_07b590fc_hoisted_25 = {
  class: "col-md-8 col-height",
  id: "fspolicylayer"
};
const ChangeFormvue_type_template_id_07b590fc_hoisted_26 = /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("br", null, null, -1);
const ChangeFormvue_type_template_id_07b590fc_hoisted_27 = {
  class: "row row-height"
};
const ChangeFormvue_type_template_id_07b590fc_hoisted_28 = {
  class: "col-md-12 float-right pull-right text-right btn-ctrl-cover"
};
const ChangeFormvue_type_template_id_07b590fc_hoisted_29 = /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("em", {
  class: "fa fa-save fa-btn-icon"
}, null, -1);
function ChangeFormvue_type_template_id_07b590fc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return (0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("div", {
    id: "page_change",
    class: (0,shared_esm_bundler/* normalizeClass */.C4)(["pt-page pt-page-current pt-page-controller", {
      'forcer-page': $options.isChanged
    }])
  }, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("h1", ChangeFormvue_type_template_id_07b590fc_hoisted_1, (0,shared_esm_bundler/* toDisplayString */.v_)($props.labels.changepassword_caption), 1), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", ChangeFormvue_type_template_id_07b590fc_hoisted_2, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", ChangeFormvue_type_template_id_07b590fc_hoisted_3, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", ChangeFormvue_type_template_id_07b590fc_hoisted_4, [(0,runtime_core_esm_bundler/* withDirectives */.bo)((0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", ChangeFormvue_type_template_id_07b590fc_hoisted_5, [ChangeFormvue_type_template_id_07b590fc_hoisted_6, (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", ChangeFormvue_type_template_id_07b590fc_hoisted_7, [(0,runtime_core_esm_bundler/* withDirectives */.bo)((0,runtime_core_esm_bundler/* createElementVNode */.Lk)("label", null, (0,shared_esm_bundler/* toDisplayString */.v_)($props.labels.passwordforce_label), 513), [[runtime_dom_esm_bundler/* vShow */.aG, $options.isForced]]), (0,runtime_core_esm_bundler/* withDirectives */.bo)((0,runtime_core_esm_bundler/* createElementVNode */.Lk)("label", null, (0,shared_esm_bundler/* toDisplayString */.v_)($props.labels.passwordexpire_label), 513), [[runtime_dom_esm_bundler/* vShow */.aG, $options.isExpired]])])], 512), [[runtime_dom_esm_bundler/* vShow */.aG, $options.isChanged]]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", ChangeFormvue_type_template_id_07b590fc_hoisted_8, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", ChangeFormvue_type_template_id_07b590fc_hoisted_9, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("label", ChangeFormvue_type_template_id_07b590fc_hoisted_10, (0,shared_esm_bundler/* toDisplayString */.v_)($props.labels.oldpassword_label), 1)]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", {
    class: (0,shared_esm_bundler/* normalizeClass */.C4)(["col-md-3 col-height", {
      'has-error': $setup.v$.oldpassword.$error
    }])
  }, [(0,runtime_core_esm_bundler/* withDirectives */.bo)((0,runtime_core_esm_bundler/* createElementVNode */.Lk)("input", {
    "onUpdate:modelValue": _cache[0] || (_cache[0] = $event => $setup.localData.oldpassword = $event),
    ref: "oldpassword",
    type: "password",
    class: "form-control input-md alert-input",
    id: "oldpassword",
    name: "oldpassword",
    placeholder: $props.labels.oldpassword_label,
    autocomplete: "off",
    size: "8"
  }, null, 8, ChangeFormvue_type_template_id_07b590fc_hoisted_11), [[runtime_dom_esm_bundler/* vModelText */.Jo, $setup.localData.oldpassword]]), $setup.v$.oldpassword.$error ? ((0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("span", ChangeFormvue_type_template_id_07b590fc_hoisted_12, (0,shared_esm_bundler/* toDisplayString */.v_)($setup.v$.oldpassword.$errors[0].$message), 1)) : (0,runtime_core_esm_bundler/* createCommentVNode */.Q3)("", true)], 2)]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", ChangeFormvue_type_template_id_07b590fc_hoisted_13, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", ChangeFormvue_type_template_id_07b590fc_hoisted_14, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("label", ChangeFormvue_type_template_id_07b590fc_hoisted_15, (0,shared_esm_bundler/* toDisplayString */.v_)($props.labels.userpassword_label), 1)]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", {
    class: (0,shared_esm_bundler/* normalizeClass */.C4)(["col-md-3 col-height", {
      'has-error': $setup.v$.userpassword.$error
    }])
  }, [(0,runtime_core_esm_bundler/* withDirectives */.bo)((0,runtime_core_esm_bundler/* createElementVNode */.Lk)("input", {
    "onUpdate:modelValue": _cache[1] || (_cache[1] = $event => $setup.localData.userpassword = $event),
    ref: "userpassword",
    type: "password",
    class: "form-control input-md alert-input",
    id: "userpassword",
    name: "userpassword",
    placeholder: $props.labels.userpassword_label,
    autocomplete: "off",
    size: "8",
    "data-toggle": "tooltip",
    title: "Password can combine with alphabets and numeric sign not over 8 characters"
  }, null, 8, ChangeFormvue_type_template_id_07b590fc_hoisted_16), [[runtime_dom_esm_bundler/* vModelText */.Jo, $setup.localData.userpassword]]), $setup.v$.userpassword.$error ? ((0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("span", ChangeFormvue_type_template_id_07b590fc_hoisted_17, (0,shared_esm_bundler/* toDisplayString */.v_)($setup.v$.userpassword.$errors[0].$message), 1)) : (0,runtime_core_esm_bundler/* createCommentVNode */.Q3)("", true)], 2)]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", ChangeFormvue_type_template_id_07b590fc_hoisted_18, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", ChangeFormvue_type_template_id_07b590fc_hoisted_19, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("label", ChangeFormvue_type_template_id_07b590fc_hoisted_20, (0,shared_esm_bundler/* toDisplayString */.v_)($props.labels.confirmpassword_label), 1)]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", {
    class: (0,shared_esm_bundler/* normalizeClass */.C4)(["col-md-3 col-height", {
      'has-error': $setup.v$.confirmpassword.$error
    }])
  }, [(0,runtime_core_esm_bundler/* withDirectives */.bo)((0,runtime_core_esm_bundler/* createElementVNode */.Lk)("input", {
    "onUpdate:modelValue": _cache[2] || (_cache[2] = $event => $setup.localData.confirmpassword = $event),
    ref: "confirmpassword",
    type: "password",
    class: "form-control input-md alert-input",
    id: "confirmpassword",
    name: "confirmpassword",
    placeholder: $props.labels.confirmpassword_label,
    autocomplete: "off",
    size: "8",
    "data-toggle": "tooltip",
    title: "Password can combine with alphabets and numeric sign not over 8 characters"
  }, null, 8, ChangeFormvue_type_template_id_07b590fc_hoisted_21), [[runtime_dom_esm_bundler/* vModelText */.Jo, $setup.localData.confirmpassword]]), $setup.v$.confirmpassword.$error ? ((0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("span", ChangeFormvue_type_template_id_07b590fc_hoisted_22, (0,shared_esm_bundler/* toDisplayString */.v_)($setup.v$.confirmpassword.$errors[0].$message), 1)) : (0,runtime_core_esm_bundler/* createCommentVNode */.Q3)("", true)], 2)]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", ChangeFormvue_type_template_id_07b590fc_hoisted_23, [ChangeFormvue_type_template_id_07b590fc_hoisted_24, (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", ChangeFormvue_type_template_id_07b590fc_hoisted_25, [((0,runtime_core_esm_bundler/* openBlock */.uX)(true), (0,runtime_core_esm_bundler/* createElementBlock */.CE)(runtime_core_esm_bundler/* Fragment */.FK, null, (0,runtime_core_esm_bundler/* renderList */.pI)($options.policyLists, (item, index) => {
    return (0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)(runtime_core_esm_bundler/* Fragment */.FK, {
      key: index
    }, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("span", null, (0,shared_esm_bundler/* toDisplayString */.v_)(item), 1), ChangeFormvue_type_template_id_07b590fc_hoisted_26], 64);
  }), 128))])]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", ChangeFormvue_type_template_id_07b590fc_hoisted_27, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", ChangeFormvue_type_template_id_07b590fc_hoisted_28, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("button", {
    class: "btn btn-dark btn-sm",
    onClick: _cache[3] || (_cache[3] = (0,runtime_dom_esm_bundler/* withModifiers */.D$)((...args) => $options.saveClick && $options.saveClick(...args), ["stop"]))
  }, [ChangeFormvue_type_template_id_07b590fc_hoisted_29, (0,runtime_core_esm_bundler/* createTextVNode */.eW)(" " + (0,shared_esm_bundler/* toDisplayString */.v_)($props.labels.save_button), 1)])])])])])])], 2);
}
;// CONCATENATED MODULE: ./src/components/form/ChangeForm.vue?vue&type=template&id=07b590fc

;// CONCATENATED MODULE: ./src/assets/js/policies.js

const policies = (0,reactivity_esm_bundler/* ref */.KR)({
  categories: {},
  reset() {
    this.categories = {};
  },
  isEmpty() {
    return Object.keys(this.categories).length == 0;
  },
  setCategories(value) {
    this.categories = value;
  },
  getCategory(key) {
    return this.categories[key];
  }
});
;// CONCATENATED MODULE: ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/components/form/ChangeForm.vue?vue&type=script&lang=js








const ChangeFormvue_type_script_lang_js_formData = {
  oldpassword: '',
  userpassword: '',
  confirmpassword: ''
};
/* harmony default export */ var ChangeFormvue_type_script_lang_js = ({
  props: {
    labels: Object,
    mode: {
      type: String,
      default: ""
    }
  },
  emits: ["success"],
  setup(props, context) {
    let localData = (0,reactivity_esm_bundler/* ref */.KR)({
      ...ChangeFormvue_type_script_lang_js_formData
    });
    const reqalert = (0,reactivity_esm_bundler/* ref */.KR)(props.labels.empty_alert);
    const matchalert = (0,reactivity_esm_bundler/* ref */.KR)(props.labels.matchpassword_alert);
    const requiredMessage = () => {
      return validators_dist/* helpers */._$.withMessage(reqalert, validators_dist/* required */.mw);
    };
    const matchMessage = matcher => {
      return validators_dist/* helpers */._$.withMessage(matchalert, (0,validators_dist/* sameAs */.f4)(matcher));
    };
    const validateRules = (0,runtime_core_esm_bundler/* computed */.EW)(() => {
      return {
        oldpassword: {
          required: requiredMessage()
        },
        userpassword: {
          required: requiredMessage()
        },
        confirmpassword: {
          required: requiredMessage(),
          sameAs: matchMessage(localData.value.userpassword)
        }
      };
    });
    const v$ = (0,dist/* useVuelidate */.fG)(validateRules, localData, {
      $lazy: true,
      $autoDirty: true
    });
    const onactivated = (0,runtime_core_esm_bundler/* onActivated */.n)(() => {
      console.log("ChangeForm.vue: onActivated ... ");
      context.emit("activated", "changepassword");
    });
    const changedMode = (0,reactivity_esm_bundler/* ref */.KR)("");
    return {
      v$,
      accessor: accessor,
      policies: policies,
      localData,
      reqalert,
      matchalert,
      onactivated,
      changedMode
    };
  },
  created() {
    (0,runtime_core_esm_bundler/* watch */.wB)(this.$props, newProps => {
      this.reqalert = newProps.labels.empty_alert;
      this.matchalert = newProps.labels.matchpassword_alert;
    });
  },
  mounted() {
    console.log("ChangeForm.vue mounted ...");
    this.$nextTick(() => {
      this.setting();
    });
  },
  computed: {
    isChanged() {
      return this.changedMode != "";
    },
    isForced() {
      return this.changedMode == 'force';
    },
    isExpired() {
      return this.changedMode == 'expire';
    },
    policyLists() {
      return this.policies.getCategory(this.accessor.lang ?? "EN");
    }
  },
  methods: {
    reset() {
      this.localData = {
        ...ChangeFormvue_type_script_lang_js_formData
      };
      this.v$.$reset();
    },
    setting() {
      console.log("ChangeForm.vue: setting ...");
      this.loadPolicies();
    },
    focus() {
      this.$refs.oldpassword.focus();
    },
    success() {
      this.$emit('success', 'changepassword', this.localData);
    },
    async validateForm(focusing = true) {
      const valid = await this.v$.$validate();
      if (!valid) {
        if (focusing) {
          this.focusFirstError();
        }
        return false;
      }
      return true;
    },
    focusFirstError() {
      if (this.v$.$errors && this.v$.$errors.length > 0) {
        let input = this.v$.$errors[0].$property;
        let el = this.$refs[input];
        if (el) el.focus();
      }
    },
    loadPolicies() {
      console.log("ChangeForm.vue loadPolicies ...");
      if (!this.policies.isEmpty()) return;
      let formdata = (0,will_app/* serializeParameters */.L3)({
        ajax: true
      }, null, true);
      jquery_default().ajax({
        url: (0,will_app/* getApiUrl */.e9)() + "/api/passwordpolicy/categories",
        data: formdata.jsondata,
        headers: formdata.headers,
        type: "POST",
        dataType: "json",
        contentType: will_app/* DEFAULT_CONTENT_TYPE */.Xh,
        success: (data, status, transport) => {
          console.log("loadPolicies: success", transport.responseText);
          if (data.body?.dataset) {
            this.policies.setCategories(data.body.dataset);
          }
        }
      });
    },
    async saveClick() {
      console.log("click: save");
      let valid = await this.validateForm();
      if (!valid) return;
      this.startSaveRecord();
    },
    startSaveRecord() {
      (0,will_app/* confirmSave */.ex)(() => {
        this.saveRecord(this.localData);
      });
    },
    saveRecord(dataRecord) {
      let jsondata = {
        ajax: true,
        useruuid: this.accessor.info?.useruuid,
        userid: this.accessor.info?.userid
      };
      let formdata = (0,will_app/* serializeParameters */.L3)(jsondata, dataRecord);
      (0,will_app/* startWaiting */.eF)();
      jquery_default().ajax({
        url: (0,will_app/* getApiUrl */.e9)() + "/api/password/change",
        data: formdata.jsondata,
        headers: formdata.headers,
        type: "POST",
        dataType: "json",
        contentType: will_app/* DEFAULT_CONTENT_TYPE */.Xh,
        error: function (transport, status, errorThrown) {
          (0,will_app/* submitFailure */.pg)(transport, status, errorThrown, false);
        },
        success: (data, status, xhr) => {
          console.log("saveRecord: success : ", xhr.responseText);
          (0,will_app/* stopWaiting */.Sk)();
          this.saveSuccess(data);
        }
      });
    },
    saveSuccess(data) {
      console.log("saveSuccess : ", data);
      if (data.head?.errorflag == "Y") {
        (0,will_app/* alertbox */.Cb)(data.head.errordesc);
      } else {
        (0,will_app/* successbox */.hM)(() => {
          this.success();
        });
      }
    },
    display(mode = "") {
      this.changedMode = mode;
      this.reset();
      this.focus();
      console.log("ChangeForm.vue: changedMode", this.changedMode);
    }
  }
});
;// CONCATENATED MODULE: ./src/components/form/ChangeForm.vue?vue&type=script&lang=js
 
;// CONCATENATED MODULE: ./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-12.use[0]!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-12.use[1]!./node_modules/vue-loader/dist/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-12.use[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/components/form/ChangeForm.vue?vue&type=style&index=0&id=07b590fc&lang=css
// extracted by mini-css-extract-plugin

;// CONCATENATED MODULE: ./src/components/form/ChangeForm.vue?vue&type=style&index=0&id=07b590fc&lang=css

;// CONCATENATED MODULE: ./src/components/form/ChangeForm.vue




;


const ChangeForm_exports_ = /*#__PURE__*/(0,exportHelper/* default */.A)(ChangeFormvue_type_script_lang_js, [['render',ChangeFormvue_type_template_id_07b590fc_render]])

/* harmony default export */ var ChangeForm = (ChangeForm_exports_);
;// CONCATENATED MODULE: ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/components/WorkerFrame.vue?vue&type=script&lang=js








/* harmony default export */ var WorkerFramevue_type_script_lang_js = ({
  components: {
    WorkerMenu: WorkerMenu,
    ProfileForm: ProfileForm,
    ChangeForm: ChangeForm
  },
  props: {
    labels: Object,
    visible: {
      type: [String, Boolean],
      default: false
    }
  },
  setup(props) {
    let componentVisible = (0,reactivity_esm_bundler/* ref */.KR)(props.visible);
    let workingVisible = (0,reactivity_esm_bundler/* ref */.KR)(props.visible);
    let currentComponent = (0,reactivity_esm_bundler/* ref */.KR)("WorkerMenu");
    return {
      accessor: accessor,
      componentVisible,
      workingVisible,
      currentComponent
    };
  },
  mounted() {
    this.$nextTick(() => {
      jquery_default()("#workingframe").on("load", function () {
        (0,will_app/* stopWaiting */.Sk)();
        refreshScreen();
      });
      jquery_default()(window).on("resize", function () {
        let wh = jquery_default()(window).height();
        let nh = 0;
        if (jquery_default()("#navigatebar").is(":visible")) {
          nh = jquery_default()("#navigatebar").height();
        }
        jquery_default()("#workingframe").height(wh - nh - 30);
      }).trigger("resize");
    });
  },
  methods: {
    reset() {
      console.log("WorkerFrame.vue: reset ...");
      this.componentVisible = false;
      this.workingVisible = false;
      hideWorkSpace();
    },
    setting() {
      this.showWorkerMenu();
    },
    showWorkerMenu() {
      jquery_default()("#pagecontainer").show();
      this.componentVisible = true;
      this.workingVisible = false;
      this.currentComponent = "WorkerMenu";
      hideWorkSpace();
    },
    hideWorkerMenu() {
      this.componentVisible = false;
    },
    showWorking() {
      this.workingVisible = true;
      this.componentVisible = false;
      jquery_default()("#pagecontainer").hide();
      jquery_default()("#workingframe").show();
    },
    hideWorking() {
      this.workingVisible = false;
      hideWorkSpace();
    },
    showProfile() {
      jquery_default()("#pagecontainer").show();
      this.workingVisible = false;
      this.componentVisible = true;
      this.currentComponent = "ProfileForm";
      hideWorkSpace();
    },
    showChangePassword() {
      jquery_default()("#pagecontainer").show();
      this.workingVisible = false;
      this.componentVisible = true;
      this.currentComponent = "ChangeForm";
      hideWorkSpace();
    },
    componentActivated(name) {
      console.log("component activated: ", name);
      if ("profile" == name) this.$refs.viewComponent.display();
      if ("changepassword" == name) this.$refs.viewComponent.display();
    },
    processSuccess(action, info) {
      console.log("processSuccess: action", action, ", info", info);
      if ("profile" == action || "changepassword" == action) {
        this.showWorkerMenu();
      }
    }
  }
});
;// CONCATENATED MODULE: ./src/components/WorkerFrame.vue?vue&type=script&lang=js
 
;// CONCATENATED MODULE: ./src/components/WorkerFrame.vue




;
const WorkerFrame_exports_ = /*#__PURE__*/(0,exportHelper/* default */.A)(WorkerFramevue_type_script_lang_js, [['render',WorkerFramevue_type_template_id_90acbf02_render]])

/* harmony default export */ var WorkerFrame = (WorkerFrame_exports_);
;// CONCATENATED MODULE: ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/components/form/BlankForm.vue?vue&type=template&id=35dc2bff

const BlankFormvue_type_template_id_35dc2bff_hoisted_1 = {
  id: "blanklayer"
};
function BlankFormvue_type_template_id_35dc2bff_render(_ctx, _cache, $props, $setup, $data, $options) {
  return (0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("div", BlankFormvue_type_template_id_35dc2bff_hoisted_1);
}
;// CONCATENATED MODULE: ./src/components/form/BlankForm.vue?vue&type=template&id=35dc2bff

;// CONCATENATED MODULE: ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/components/form/BlankForm.vue?vue&type=script&lang=js

/* harmony default export */ var BlankFormvue_type_script_lang_js = ({
  props: {
    labels: Object
  },
  setup(props, context) {
    let onactivated = (0,runtime_core_esm_bundler/* onActivated */.n)(() => {
      console.log("BlankForm.vue: onActivated ... ");
      context.emit("activated", "blank");
    });
    return {
      onactivated
    };
  }
});
;// CONCATENATED MODULE: ./src/components/form/BlankForm.vue?vue&type=script&lang=js
 
;// CONCATENATED MODULE: ./src/components/form/BlankForm.vue




;
const BlankForm_exports_ = /*#__PURE__*/(0,exportHelper/* default */.A)(BlankFormvue_type_script_lang_js, [['render',BlankFormvue_type_template_id_35dc2bff_render]])

/* harmony default export */ var BlankForm = (BlankForm_exports_);
;// CONCATENATED MODULE: ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/components/form/ForgotForm.vue?vue&type=template&id=690a47fa

const ForgotFormvue_type_template_id_690a47fa_hoisted_1 = {
  class: "pt-page forcer-page"
};
const ForgotFormvue_type_template_id_690a47fa_hoisted_2 = {
  class: "page-header-title"
};
const ForgotFormvue_type_template_id_690a47fa_hoisted_3 = {
  id: "page_forgot",
  class: "entry-layer page-layer forgot-layer portal-area"
};
const ForgotFormvue_type_template_id_690a47fa_hoisted_4 = {
  class: "portal-area sub-entry-layer forgot-area"
};
const ForgotFormvue_type_template_id_690a47fa_hoisted_5 = /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("br", null, null, -1);
const ForgotFormvue_type_template_id_690a47fa_hoisted_6 = {
  class: "row row-heighter center-block"
};
const ForgotFormvue_type_template_id_690a47fa_hoisted_7 = {
  class: "col-md-12"
};
const ForgotFormvue_type_template_id_690a47fa_hoisted_8 = {
  id: "forgotpassword_info"
};
const ForgotFormvue_type_template_id_690a47fa_hoisted_9 = {
  class: "row row-heighter center-block"
};
const ForgotFormvue_type_template_id_690a47fa_hoisted_10 = {
  class: "col-md-6 col-height form-group",
  id: "email_layer"
};
const ForgotFormvue_type_template_id_690a47fa_hoisted_11 = /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", {
  class: "input-group-prepend"
}, [/*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("span", {
  class: "input-group-text",
  title: "Email"
}, [/*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("i", {
  class: "fa fa-envelope-o",
  "aria-hidden": "true"
})])], -1);
const ForgotFormvue_type_template_id_690a47fa_hoisted_12 = ["placeholder"];
const ForgotFormvue_type_template_id_690a47fa_hoisted_13 = {
  key: 0,
  class: "has-error"
};
const ForgotFormvue_type_template_id_690a47fa_hoisted_14 = {
  class: "row row-heighter center-block"
};
const ForgotFormvue_type_template_id_690a47fa_hoisted_15 = {
  class: "col-md-4 col-height form-group",
  id: "secureimage_layer"
};
const ForgotFormvue_type_template_id_690a47fa_hoisted_16 = /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", {
  class: "btn-group mr-2",
  role: "group"
}, [/*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("img", {
  id: "secureimage",
  alt: ""
})], -1);
const ForgotFormvue_type_template_id_690a47fa_hoisted_17 = {
  class: "btn-group mr-2",
  role: "group",
  id: "secureimage_ctrl_layer"
};
const ForgotFormvue_type_template_id_690a47fa_hoisted_18 = /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("em", {
  class: "fa fa-refresh",
  "aria-hidden": "true"
}, null, -1);
const ForgotFormvue_type_template_id_690a47fa_hoisted_19 = [ForgotFormvue_type_template_id_690a47fa_hoisted_18];
const ForgotFormvue_type_template_id_690a47fa_hoisted_20 = {
  class: "row row-heighter center-block"
};
const ForgotFormvue_type_template_id_690a47fa_hoisted_21 = {
  class: "col-md-12"
};
const ForgotFormvue_type_template_id_690a47fa_hoisted_22 = {
  id: "securecode_info"
};
const ForgotFormvue_type_template_id_690a47fa_hoisted_23 = {
  class: "row row-heighter center-block"
};
const ForgotFormvue_type_template_id_690a47fa_hoisted_24 = {
  class: "col-md-4 col-height form-group",
  id: "securecode_layer"
};
const ForgotFormvue_type_template_id_690a47fa_hoisted_25 = /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", {
  class: "input-group-prepend"
}, [/*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("span", {
  class: "input-group-text",
  title: "Answer Code"
}, [/*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("i", {
  class: "fa fa-unlock-alt",
  "aria-hidden": "true"
})])], -1);
const ForgotFormvue_type_template_id_690a47fa_hoisted_26 = ["placeholder"];
const ForgotFormvue_type_template_id_690a47fa_hoisted_27 = {
  key: 0,
  class: "has-error"
};
const ForgotFormvue_type_template_id_690a47fa_hoisted_28 = /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("hr", null, null, -1);
const ForgotFormvue_type_template_id_690a47fa_hoisted_29 = {
  class: "row row-heighter"
};
const ForgotFormvue_type_template_id_690a47fa_hoisted_30 = {
  class: "col-md-12 col-height text-center button-control-layer"
};
const ForgotFormvue_type_template_id_690a47fa_hoisted_31 = /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("em", {
  class: "fa fa-send fa-btn-icon"
}, null, -1);
const ForgotFormvue_type_template_id_690a47fa_hoisted_32 = /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("em", {
  class: "fa fa-close fa-btn-icon"
}, null, -1);
const ForgotFormvue_type_template_id_690a47fa_hoisted_33 = {
  id: "page_forgot_success",
  class: "entry-layer page-layer forgot-layer portal-area"
};
const ForgotFormvue_type_template_id_690a47fa_hoisted_34 = {
  class: "row portal-area sub-entry-layer"
};
const ForgotFormvue_type_template_id_690a47fa_hoisted_35 = /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("br", null, null, -1);
const ForgotFormvue_type_template_id_690a47fa_hoisted_36 = {
  width: "100%"
};
const ForgotFormvue_type_template_id_690a47fa_hoisted_37 = /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("tr", {
  class: "rclass"
}, [/*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("td", {
  height: "50"
}, " ")], -1);
const ForgotFormvue_type_template_id_690a47fa_hoisted_38 = {
  class: "rclass"
};
const ForgotFormvue_type_template_id_690a47fa_hoisted_39 = {
  align: "center",
  height: "30"
};
const ForgotFormvue_type_template_id_690a47fa_hoisted_40 = {
  class: "lclass",
  id: "resetpwd_label",
  required: "false"
};
const ForgotFormvue_type_template_id_690a47fa_hoisted_41 = {
  align: "center",
  height: "30"
};
const ForgotFormvue_type_template_id_690a47fa_hoisted_42 = {
  class: "lclass",
  id: "resetmsg_label",
  required: "false"
};
const ForgotFormvue_type_template_id_690a47fa_hoisted_43 = {
  align: "center",
  height: "30"
};
function ForgotFormvue_type_template_id_690a47fa_render(_ctx, _cache, $props, $setup, $data, $options) {
  return (0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("div", ForgotFormvue_type_template_id_690a47fa_hoisted_1, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("h1", ForgotFormvue_type_template_id_690a47fa_hoisted_2, (0,shared_esm_bundler/* toDisplayString */.v_)($props.labels.forgot_caption), 1), (0,runtime_core_esm_bundler/* withDirectives */.bo)((0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", ForgotFormvue_type_template_id_690a47fa_hoisted_3, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", ForgotFormvue_type_template_id_690a47fa_hoisted_4, [ForgotFormvue_type_template_id_690a47fa_hoisted_5, (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", ForgotFormvue_type_template_id_690a47fa_hoisted_6, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", ForgotFormvue_type_template_id_690a47fa_hoisted_7, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("label", ForgotFormvue_type_template_id_690a47fa_hoisted_8, (0,shared_esm_bundler/* toDisplayString */.v_)($props.labels.forgotpassword_info), 1)])]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", ForgotFormvue_type_template_id_690a47fa_hoisted_9, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", ForgotFormvue_type_template_id_690a47fa_hoisted_10, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", {
    class: (0,shared_esm_bundler/* normalizeClass */.C4)(["input-group", {
      'has-error': $setup.v$.email.$error
    }])
  }, [ForgotFormvue_type_template_id_690a47fa_hoisted_11, (0,runtime_core_esm_bundler/* withDirectives */.bo)((0,runtime_core_esm_bundler/* createElementVNode */.Lk)("input", {
    ref: "email",
    "onUpdate:modelValue": _cache[0] || (_cache[0] = $event => $setup.localData.email = $event),
    type: "email",
    class: "form-control input-md my-input alert-input",
    id: "email",
    name: "email",
    placeholder: $props.labels.email_label
  }, null, 8, ForgotFormvue_type_template_id_690a47fa_hoisted_12), [[runtime_dom_esm_bundler/* vModelText */.Jo, $setup.localData.email]])], 2), $setup.v$.email.$error ? ((0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("span", ForgotFormvue_type_template_id_690a47fa_hoisted_13, (0,shared_esm_bundler/* toDisplayString */.v_)($setup.v$.email.$errors[0].$message), 1)) : (0,runtime_core_esm_bundler/* createCommentVNode */.Q3)("", true)])]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", ForgotFormvue_type_template_id_690a47fa_hoisted_14, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", ForgotFormvue_type_template_id_690a47fa_hoisted_15, [ForgotFormvue_type_template_id_690a47fa_hoisted_16, (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", ForgotFormvue_type_template_id_690a47fa_hoisted_17, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("button", {
    onClick: _cache[1] || (_cache[1] = (0,runtime_dom_esm_bundler/* withModifiers */.D$)((...args) => $options.refreshClick && $options.refreshClick(...args), ["stop"])),
    id: "secureimage_ctrl",
    title: "Refresh",
    class: "btn btn-sm btn-base",
    tabIndex: "-1"
  }, ForgotFormvue_type_template_id_690a47fa_hoisted_19)])])]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", ForgotFormvue_type_template_id_690a47fa_hoisted_20, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", ForgotFormvue_type_template_id_690a47fa_hoisted_21, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("label", ForgotFormvue_type_template_id_690a47fa_hoisted_22, (0,shared_esm_bundler/* toDisplayString */.v_)($props.labels.securecode_info), 1)])]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", ForgotFormvue_type_template_id_690a47fa_hoisted_23, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", ForgotFormvue_type_template_id_690a47fa_hoisted_24, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", {
    class: (0,shared_esm_bundler/* normalizeClass */.C4)(["input-group", {
      'has-error': $setup.v$.securecode.$error
    }])
  }, [ForgotFormvue_type_template_id_690a47fa_hoisted_25, (0,runtime_core_esm_bundler/* withDirectives */.bo)((0,runtime_core_esm_bundler/* createElementVNode */.Lk)("input", {
    ref: "securecode",
    "onUpdate:modelValue": _cache[2] || (_cache[2] = $event => $setup.localData.securecode = $event),
    type: "text",
    class: "form-control input-md my-input alert-input",
    id: "securecode",
    name: "securecode",
    placeholder: $props.labels.securecode_label
  }, null, 8, ForgotFormvue_type_template_id_690a47fa_hoisted_26), [[runtime_dom_esm_bundler/* vModelText */.Jo, $setup.localData.securecode]])], 2), $setup.v$.securecode.$error ? ((0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("span", ForgotFormvue_type_template_id_690a47fa_hoisted_27, (0,shared_esm_bundler/* toDisplayString */.v_)($setup.v$.securecode.$errors[0].$message), 1)) : (0,runtime_core_esm_bundler/* createCommentVNode */.Q3)("", true)])])]), ForgotFormvue_type_template_id_690a47fa_hoisted_28, (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", ForgotFormvue_type_template_id_690a47fa_hoisted_29, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", ForgotFormvue_type_template_id_690a47fa_hoisted_30, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("button", {
    onClick: _cache[3] || (_cache[3] = (0,runtime_dom_esm_bundler/* withModifiers */.D$)((...args) => $options.sendClick && $options.sendClick(...args), ["stop"])),
    id: "sendbutton",
    class: "btn btn-dark btn-sm"
  }, [ForgotFormvue_type_template_id_690a47fa_hoisted_31, (0,runtime_core_esm_bundler/* createTextVNode */.eW)(" " + (0,shared_esm_bundler/* toDisplayString */.v_)($props.labels.send_button), 1)]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("button", {
    onClick: _cache[4] || (_cache[4] = (0,runtime_dom_esm_bundler/* withModifiers */.D$)((...args) => $options.cancelClick && $options.cancelClick(...args), ["stop"])),
    id: "cancelbutton",
    class: "btn btn-dark btn-sm"
  }, [ForgotFormvue_type_template_id_690a47fa_hoisted_32, (0,runtime_core_esm_bundler/* createTextVNode */.eW)(" " + (0,shared_esm_bundler/* toDisplayString */.v_)($props.labels.cancel_button), 1)])])])], 512), [[runtime_dom_esm_bundler/* vShow */.aG, $setup.successVisible == false]]), (0,runtime_core_esm_bundler/* withDirectives */.bo)((0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", ForgotFormvue_type_template_id_690a47fa_hoisted_33, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", ForgotFormvue_type_template_id_690a47fa_hoisted_34, [ForgotFormvue_type_template_id_690a47fa_hoisted_35, (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("table", ForgotFormvue_type_template_id_690a47fa_hoisted_36, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("tbody", null, [ForgotFormvue_type_template_id_690a47fa_hoisted_37, (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("tr", ForgotFormvue_type_template_id_690a47fa_hoisted_38, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("td", ForgotFormvue_type_template_id_690a47fa_hoisted_39, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("label", ForgotFormvue_type_template_id_690a47fa_hoisted_40, (0,shared_esm_bundler/* toDisplayString */.v_)($props.labels.resetpwd_label), 1)])]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("tr", null, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("td", ForgotFormvue_type_template_id_690a47fa_hoisted_41, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("label", ForgotFormvue_type_template_id_690a47fa_hoisted_42, (0,shared_esm_bundler/* toDisplayString */.v_)($props.labels.resetmsg_label), 1)])]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("tr", null, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("td", ForgotFormvue_type_template_id_690a47fa_hoisted_43, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("a", {
    href: "javascript:void(0)",
    id: "loginlink",
    onClick: _cache[5] || (_cache[5] = (0,runtime_dom_esm_bundler/* withModifiers */.D$)((...args) => $options.loginClick && $options.loginClick(...args), ["stop"]))
  }, (0,shared_esm_bundler/* toDisplayString */.v_)($props.labels.resetlogin_label), 1)])])])])])], 512), [[runtime_dom_esm_bundler/* vShow */.aG, $setup.successVisible == true]])]);
}
;// CONCATENATED MODULE: ./src/components/form/ForgotForm.vue?vue&type=template&id=690a47fa

;// CONCATENATED MODULE: ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/components/form/ForgotForm.vue?vue&type=script&lang=js






const ForgotFormvue_type_script_lang_js_formData = {
  email: '',
  securecode: '',
  capid: ''
};
/* harmony default export */ var ForgotFormvue_type_script_lang_js = ({
  props: {
    labels: Object
  },
  setup(props, context) {
    const localData = (0,reactivity_esm_bundler/* ref */.KR)({
      ...ForgotFormvue_type_script_lang_js_formData
    });
    const successVisible = (0,reactivity_esm_bundler/* ref */.KR)(false);
    const reqalert = (0,reactivity_esm_bundler/* ref */.KR)(props.labels.empty_alert);
    const emailalert = (0,reactivity_esm_bundler/* ref */.KR)(props.labels.email_alert);
    const requiredMessage = () => {
      return validators_dist/* helpers */._$.withMessage(reqalert, validators_dist/* required */.mw);
    };
    const emailMessage = () => {
      return validators_dist/* helpers */._$.withMessage(emailalert, validators_dist/* email */.Rp);
    };
    const validateRules = (0,runtime_core_esm_bundler/* computed */.EW)(() => {
      return {
        email: {
          required: requiredMessage(),
          email: emailMessage()
        },
        securecode: {
          required: requiredMessage()
        }
      };
    });
    const v$ = (0,dist/* useVuelidate */.fG)(validateRules, localData, {
      $lazy: true,
      $autoDirty: true
    });
    let onactivated = (0,runtime_core_esm_bundler/* onActivated */.n)(() => {
      console.log("ForgotForm.vue: onActivated ... ");
      context.emit("activated", "forgot");
    });
    return {
      v$,
      localData,
      reqalert,
      emailalert,
      successVisible,
      onactivated
    };
  },
  created() {
    (0,runtime_core_esm_bundler/* watch */.wB)(this.$props, newProps => {
      this.reqalert = newProps.labels.empty_alert;
      this.emailalert = newProps.labels.email_alert;
    });
  },
  mounted() {
    console.log("ForgotForm.vue mounted ...");
  },
  methods: {
    reset() {
      this.localData = {
        ...ForgotFormvue_type_script_lang_js_formData
      };
      this.v$.$reset();
      this.successVisible = false;
    },
    setting() {
      console.log("ForgotForm.vue: setting ...");
      this.loadSecureImage();
    },
    focus() {
      this.$refs.email.focus();
    },
    async validateForm(focusing = true) {
      console.log("validateForm: localData", this.localData);
      const valid = await this.v$.$validate();
      console.log("validate form: valid", valid);
      console.log("error:", this.v$.$errors);
      if (!valid) {
        if (focusing) {
          this.focusFirstError();
        }
        return false;
      }
      return true;
    },
    focusFirstError() {
      if (this.v$.$errors && this.v$.$errors.length > 0) {
        let input = this.v$.$errors[0].$property;
        let el = this.$refs[input];
        if (el) el.focus();else jquery_default()("#" + input).trigger("focus");
      }
    },
    loadSecureImage() {
      console.log("ForgotForm.vue loadSecureImage ...");
      let formdata = {
        capid: this.localData.capid
      };
      jquery_default().ajax({
        url: (0,will_app/* getApiUrl */.e9)() + "/api/captcha/create",
        data: JSON.stringify(formdata),
        type: "POST",
        dataType: "json",
        contentType: will_app/* DEFAULT_CONTENT_TYPE */.Xh,
        error: function (transport, status, errorThrown) {
          (0,will_app/* submitFailure */.pg)(transport, status, errorThrown, false);
        },
        success: (data, status, transport) => {
          console.log("loadSecureImage: success", transport.responseText);
          if (data.body?.rows?.id && data.body?.rows?.src) {
            this.localData.capid = data.body.rows.id;
            jquery_default()("#secureimage").attr("src", data.body.rows.src);
          }
        }
      });
    },
    refreshClick() {
      this.loadSecureImage();
    },
    cancelClick() {
      this.$root.goLogIn();
    },
    async sendClick() {
      console.log("click: send");
      let valid = await this.validateForm();
      if (!valid) return;
      this.startSendRecord();
    },
    startSendRecord() {
      (0,will_app/* confirmSend */.h_)(() => {
        this.sendRecord(this.localData);
      });
    },
    sendRecord(dataRecord) {
      let jsondata = {
        ajax: true
      };
      let formdata = Object.assign(jsondata, dataRecord);
      console.log("sendRecord: formdata", formdata);
      (0,will_app/* startWaiting */.eF)();
      jquery_default().ajax({
        url: (0,will_app/* getApiUrl */.e9)() + "/api/forgot/password",
        data: JSON.stringify(formdata),
        type: "POST",
        dataType: "json",
        contentType: will_app/* DEFAULT_CONTENT_TYPE */.Xh,
        error: function (transport, status, errorThrown) {
          (0,will_app/* submitFailure */.pg)(transport, status, errorThrown, false);
        },
        success: (data, status, xhr) => {
          console.log("sendRecord: success : ", xhr.responseText);
          (0,will_app/* stopWaiting */.Sk)();
          this.sendSuccess(data);
        }
      });
    },
    sendSuccess(data) {
      console.log("sendSuccess : ", data);
      if (data.head?.errorflag == "Y") {
        (0,will_app/* alertbox */.Cb)(data.head.errordesc);
      } else {
        this.successVisible = true;
      }
    },
    display() {
      this.reset();
      this.focus();
      this.refreshClick();
    },
    loginClick() {
      this.$root.goLogIn();
    }
  }
});
;// CONCATENATED MODULE: ./src/components/form/ForgotForm.vue?vue&type=script&lang=js
 
;// CONCATENATED MODULE: ./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-12.use[0]!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-12.use[1]!./node_modules/vue-loader/dist/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-12.use[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/components/form/ForgotForm.vue?vue&type=style&index=0&id=690a47fa&lang=css
// extracted by mini-css-extract-plugin

;// CONCATENATED MODULE: ./src/components/form/ForgotForm.vue?vue&type=style&index=0&id=690a47fa&lang=css

;// CONCATENATED MODULE: ./src/components/form/ForgotForm.vue




;


const ForgotForm_exports_ = /*#__PURE__*/(0,exportHelper/* default */.A)(ForgotFormvue_type_script_lang_js, [['render',ForgotFormvue_type_template_id_690a47fa_render]])

/* harmony default export */ var ForgotForm = (ForgotForm_exports_);
;// CONCATENATED MODULE: ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/components/form/FactorForm.vue?vue&type=template&id=50bd3ec4

const FactorFormvue_type_template_id_50bd3ec4_hoisted_1 = {
  id: "factor_verify",
  class: "pt-page pt-page-current forcer-page"
};
const FactorFormvue_type_template_id_50bd3ec4_hoisted_2 = {
  class: "page-header-title",
  title: "2FA Verification"
};
const FactorFormvue_type_template_id_50bd3ec4_hoisted_3 = {
  id: "factor_entrypanel"
};
const FactorFormvue_type_template_id_50bd3ec4_hoisted_4 = {
  id: "factor_entrylayer",
  class: "entry-layer"
};
const FactorFormvue_type_template_id_50bd3ec4_hoisted_5 = {
  class: "portal-area sub-entry-layer"
};
const FactorFormvue_type_template_id_50bd3ec4_hoisted_6 = {
  class: "row row-height"
};
const FactorFormvue_type_template_id_50bd3ec4_hoisted_7 = /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", {
  class: "col-md-3 col-height col-label text-right"
}, " ", -1);
const FactorFormvue_type_template_id_50bd3ec4_hoisted_8 = {
  class: "col-md-8 col-height"
};
const FactorFormvue_type_template_id_50bd3ec4_hoisted_9 = /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("br", null, null, -1);
const FactorFormvue_type_template_id_50bd3ec4_hoisted_10 = {
  key: 0
};
const FactorFormvue_type_template_id_50bd3ec4_hoisted_11 = /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("br", null, null, -1);
const FactorFormvue_type_template_id_50bd3ec4_hoisted_12 = {
  key: 0
};
const FactorFormvue_type_template_id_50bd3ec4_hoisted_13 = /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("br", null, null, -1);
const FactorFormvue_type_template_id_50bd3ec4_hoisted_14 = {
  class: "row row-height"
};
const FactorFormvue_type_template_id_50bd3ec4_hoisted_15 = /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", {
  class: "col-md-4"
}, null, -1);
const FactorFormvue_type_template_id_50bd3ec4_hoisted_16 = {
  class: "col-height col-md-4 factor-code-layer"
};
const FactorFormvue_type_template_id_50bd3ec4_hoisted_17 = {
  for: "factorcode",
  id: "factorcode_label",
  class: "control-label"
};
const FactorFormvue_type_template_id_50bd3ec4_hoisted_18 = {
  key: 0,
  class: "has-error"
};
const FactorFormvue_type_template_id_50bd3ec4_hoisted_19 = {
  class: "row row-height"
};
const FactorFormvue_type_template_id_50bd3ec4_hoisted_20 = /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", {
  class: "col-md-4"
}, null, -1);
const FactorFormvue_type_template_id_50bd3ec4_hoisted_21 = {
  class: "col-md-4 factor-link-layer"
};
const FactorFormvue_type_template_id_50bd3ec4_hoisted_22 = /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("em", {
  class: "fa fa-ticket fa-btn-icon"
}, null, -1);
const FactorFormvue_type_template_id_50bd3ec4_hoisted_23 = /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("br", null, null, -1);
const FactorFormvue_type_template_id_50bd3ec4_hoisted_24 = /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", {
  id: "factormodaldialog_layer",
  class: "modal fade pt-page pt-page-item",
  tabindex: "-1",
  role: "dialog"
}, [/*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", {
  class: "modal-dialog modal-xm"
}, [/*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", {
  class: "modal-content portal-area fa-portal-area"
}, [/*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", {
  class: "modal-header"
}, [/*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("h4", {
  class: "modal-title",
  id: "modalheadertitle"
}, "Verification"), /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("button", {
  type: "button",
  class: "close",
  "data-dismiss": "modal"
}, "×")]), /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("br"), /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("br"), /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", {
  class: "text-center"
}, [/*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("h4", null, "Scan QR Code add to Google Authenticator")]), /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("br"), /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("br"), /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", {
  class: "qr-image-layer"
}, [/*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("img", {
  id: "qrimg",
  alt: ""
})])])])], -1);
function FactorFormvue_type_template_id_50bd3ec4_render(_ctx, _cache, $props, $setup, $data, $options) {
  return (0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)(runtime_core_esm_bundler/* Fragment */.FK, null, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", FactorFormvue_type_template_id_50bd3ec4_hoisted_1, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("h1", FactorFormvue_type_template_id_50bd3ec4_hoisted_2, (0,shared_esm_bundler/* toDisplayString */.v_)($props.labels.factor_caption), 1), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", FactorFormvue_type_template_id_50bd3ec4_hoisted_3, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", FactorFormvue_type_template_id_50bd3ec4_hoisted_4, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", FactorFormvue_type_template_id_50bd3ec4_hoisted_5, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", FactorFormvue_type_template_id_50bd3ec4_hoisted_6, [FactorFormvue_type_template_id_50bd3ec4_hoisted_7, (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", FactorFormvue_type_template_id_50bd3ec4_hoisted_8, [$options.isEnglish ? ((0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)(runtime_core_esm_bundler/* Fragment */.FK, {
    key: 0
  }, [(0,runtime_core_esm_bundler/* createTextVNode */.eW)(" The system force you to entry verification code, please specify your Google Authenticator code."), FactorFormvue_type_template_id_50bd3ec4_hoisted_9, !$options.isFactorRegistered ? ((0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("span", FactorFormvue_type_template_id_50bd3ec4_hoisted_10, [(0,runtime_core_esm_bundler/* createTextVNode */.eW)("You can download mobile application Google Authenticator and add with QR Code via "), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("a", {
    href: "javascript:void(0)",
    title: "Add Google Authenticator",
    tabIndex: "-1",
    onClick: _cache[0] || (_cache[0] = (...args) => $options.openFactorInfo && $options.openFactorInfo(...args))
  }, "Add 2FA")])) : (0,runtime_core_esm_bundler/* createCommentVNode */.Q3)("", true)], 64)) : ((0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)(runtime_core_esm_bundler/* Fragment */.FK, {
    key: 1
  }, [(0,runtime_core_esm_bundler/* createTextVNode */.eW)(" ระบบต้องการตรวจสอบเพิ่มเติม โปรดระบุรหัสจากโปรแกรมมือถือ Google Authenticator"), FactorFormvue_type_template_id_50bd3ec4_hoisted_11, !$options.isFactorRegistered ? ((0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("span", FactorFormvue_type_template_id_50bd3ec4_hoisted_12, [(0,runtime_core_esm_bundler/* createTextVNode */.eW)("สามารถดาวน์โหลดโปรแกรมมือถือ Google Authenticator และทำการเพิ่มได้ที่ "), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("a", {
    href: "javascript:void(0)",
    title: "Add Google Authenticator",
    tabIndex: "-1",
    onClick: _cache[1] || (_cache[1] = (...args) => $options.openFactorInfo && $options.openFactorInfo(...args))
  }, "เพิ่ม 2FA")])) : (0,runtime_core_esm_bundler/* createCommentVNode */.Q3)("", true)], 64)), FactorFormvue_type_template_id_50bd3ec4_hoisted_13])]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", FactorFormvue_type_template_id_50bd3ec4_hoisted_14, [FactorFormvue_type_template_id_50bd3ec4_hoisted_15, (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", FactorFormvue_type_template_id_50bd3ec4_hoisted_16, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("label", FactorFormvue_type_template_id_50bd3ec4_hoisted_17, (0,shared_esm_bundler/* toDisplayString */.v_)($props.labels.factorcode_label), 1), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", {
    class: (0,shared_esm_bundler/* normalizeClass */.C4)(["input-grouper", {
      'has-error': $setup.v$.factorcode.$error
    }])
  }, [(0,runtime_core_esm_bundler/* withDirectives */.bo)((0,runtime_core_esm_bundler/* createElementVNode */.Lk)("input", {
    ref: "factorcode",
    "onUpdate:modelValue": _cache[2] || (_cache[2] = $event => $setup.localData.factorcode = $event),
    type: "text",
    id: "factorcode",
    name: "factorcode",
    class: "form-control input-md irequired alert-input",
    maxlength: "8",
    placeholder: "Code"
  }, null, 512), [[runtime_dom_esm_bundler/* vModelText */.Jo, $setup.localData.factorcode]])], 2), $setup.v$.factorcode.$error ? ((0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("span", FactorFormvue_type_template_id_50bd3ec4_hoisted_18, (0,shared_esm_bundler/* toDisplayString */.v_)($setup.v$.factorcode.$errors[0].$message), 1)) : (0,runtime_core_esm_bundler/* createCommentVNode */.Q3)("", true)])]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", FactorFormvue_type_template_id_50bd3ec4_hoisted_19, [FactorFormvue_type_template_id_50bd3ec4_hoisted_20, (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", FactorFormvue_type_template_id_50bd3ec4_hoisted_21, [!$options.isFactorRegistered ? ((0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("a", {
    key: 0,
    href: "javascript:void(0)",
    id: "factorliker",
    class: "factor-linker",
    title: "Add Google Authenticator",
    tabIndex: "-1",
    onClick: _cache[3] || (_cache[3] = (...args) => $options.openFactorInfo && $options.openFactorInfo(...args))
  }, (0,shared_esm_bundler/* toDisplayString */.v_)($props.labels.factor_label), 1)) : (0,runtime_core_esm_bundler/* createCommentVNode */.Q3)("", true), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("button", {
    onClick: _cache[4] || (_cache[4] = (0,runtime_dom_esm_bundler/* withModifiers */.D$)((...args) => $options.submitClick && $options.submitClick(...args), ["stop"])),
    id: "submitbutton",
    class: "btn btn-dark btn-sm pull-right"
  }, [FactorFormvue_type_template_id_50bd3ec4_hoisted_22, (0,runtime_core_esm_bundler/* createTextVNode */.eW)((0,shared_esm_bundler/* toDisplayString */.v_)($props.labels.submit_button), 1)])])])])])]), FactorFormvue_type_template_id_50bd3ec4_hoisted_23]), ((0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createBlock */.Wv)(runtime_core_esm_bundler/* Teleport */.Im, {
    to: "#modaldialog"
  }, [FactorFormvue_type_template_id_50bd3ec4_hoisted_24]))], 64);
}
;// CONCATENATED MODULE: ./src/components/form/FactorForm.vue?vue&type=template&id=50bd3ec4

;// CONCATENATED MODULE: ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/components/form/FactorForm.vue?vue&type=script&lang=js








const FactorFormvue_type_script_lang_js_formData = {
  factorcode: '',
  factorid: ''
};
/* harmony default export */ var FactorFormvue_type_script_lang_js = ({
  props: {
    labels: Object
  },
  emits: ["success"],
  setup(props, context) {
    const localData = (0,reactivity_esm_bundler/* ref */.KR)({
      ...FactorFormvue_type_script_lang_js_formData
    });
    const alreadyLoaded = (0,reactivity_esm_bundler/* ref */.KR)(false);
    const reqalert = (0,reactivity_esm_bundler/* ref */.KR)(props.labels.empty_alert);
    const requiredMessage = () => {
      return validators_dist/* helpers */._$.withMessage(reqalert, validators_dist/* required */.mw);
    };
    const validateRules = (0,runtime_core_esm_bundler/* computed */.EW)(() => {
      return {
        factorcode: {
          required: requiredMessage()
        }
      };
    });
    const v$ = (0,dist/* useVuelidate */.fG)(validateRules, localData, {
      $lazy: true,
      $autoDirty: true
    });
    let onactivated = (0,runtime_core_esm_bundler/* onActivated */.n)(() => {
      console.log("FactorForm.vue: onActivated ... ");
      context.emit("activated", "factor");
    });
    return {
      accessor: accessor,
      v$,
      localData,
      reqalert,
      onactivated,
      alreadyLoaded
    };
  },
  created() {
    (0,runtime_core_esm_bundler/* watch */.wB)(this.$props, newProps => {
      this.reqalert = newProps.labels.empty_alert;
    });
  },
  mounted() {
    console.log("FactorForm.vue mounted ...");
    this.$nextTick(() => {
      jquery_default()(this.$refs.factorcode).on("keydown", e => {
        if (e.which == 13) {
          this.submitClick();
        }
      });
      jquery_default()("#factormodaldialog_layer").find(".modal-dialog").draggable();
    });
  },
  computed: {
    isEnglish() {
      return this.accessor.lang == "EN";
    },
    isFactorRegistered() {
      return this.accessor.info?.factorflag == '1';
    }
  },
  methods: {
    reset() {
      this.localData = {
        ...FactorFormvue_type_script_lang_js_formData
      };
      this.localData.factorid = this.accessor.info?.factorid;
      this.v$.$reset();
      this.alreadyLoaded = false;
    },
    setting() {
      console.log("FactorForm.vue: setting ...");
    },
    focus() {
      this.$refs.factorcode.focus();
    },
    success() {
      this.$emit('success', 'factor', this.localData);
    },
    async validateForm(focusing = true) {
      console.log("validateForm: localData", this.localData);
      const valid = await this.v$.$validate();
      console.log("validate form: valid", valid);
      console.log("error:", this.v$.$errors);
      if (!valid) {
        if (focusing) {
          this.focusFirstError();
        }
        return false;
      }
      return true;
    },
    focusFirstError() {
      if (this.v$.$errors && this.v$.$errors.length > 0) {
        let input = this.v$.$errors[0].$property;
        let el = this.$refs[input];
        if (el) el.focus();else jquery_default()("#" + input).trigger("focus");
      }
    },
    loadQRCode() {
      let formdata = {
        factorid: this.localData.factorid,
        authtoken: (0,will_app/* getAccessorToken */.fD)()
      };
      console.log("FactorForm.vue loadQRCode: alreadyLoaded=", this.alreadyLoaded, ", formdata", formdata);
      if (this.alreadyLoaded) return;
      (0,will_app/* startWaiting */.eF)();
      jquery_default().ajax({
        url: (0,will_app/* getApiUrl */.e9)() + "/api/factor/get",
        data: JSON.stringify(formdata),
        type: "POST",
        dataType: "json",
        contentType: will_app/* DEFAULT_CONTENT_TYPE */.Xh,
        error: function (transport, status, errorThrown) {
          (0,will_app/* submitFailure */.pg)(transport, status, errorThrown, false);
        },
        success: (data, status, transport) => {
          (0,will_app/* stopWaiting */.Sk)();
          console.log("loadQRCode: success", transport.responseText);
          if (data.body?.factorimage) {
            jquery_default()("#qrimg").attr("src", data.body?.factorimage);
            this.alreadyLoaded = true;
          }
        }
      });
    },
    async submitClick() {
      console.log("click: submit");
      let valid = await this.validateForm();
      if (!valid) return;
      this.startSubmitRecord();
    },
    startSubmitRecord() {
      this.submitRecord(this.localData);
    },
    submitRecord(dataRecord) {
      let jsondata = {
        ajax: true
      };
      let formdata = Object.assign(jsondata, dataRecord);
      console.log("submitRecord: formdata", formdata);
      (0,will_app/* startWaiting */.eF)();
      jquery_default().ajax({
        url: (0,will_app/* getApiUrl */.e9)() + "/api/factor/verify",
        data: JSON.stringify(formdata),
        type: "POST",
        dataType: "json",
        contentType: will_app/* DEFAULT_CONTENT_TYPE */.Xh,
        error: function (transport, status, errorThrown) {
          (0,will_app/* submitFailure */.pg)(transport, status, errorThrown, false);
        },
        success: (data, status, xhr) => {
          console.log("submitRecord: success : ", xhr.responseText);
          (0,will_app/* stopWaiting */.Sk)();
          this.submitSuccess(data);
        }
      });
    },
    submitSuccess(data) {
      console.log("submitSuccess : ", data);
      if (data.head?.errorflag == "Y") {
        (0,will_app/* alertbox */.Cb)(data.head.errordesc);
      } else {
        this.accessor.info.factorcode = this.localData.factorcode;
        this.success();
      }
    },
    display() {
      this.reset();
      setTimeout(() => {
        this.focus();
      }, 100);
    },
    loginClick() {
      this.$root.goLogIn();
    },
    openFactorInfo() {
      jquery_default()("#factormodaldialog_layer").modal("show");
      this.loadQRCode();
    }
  }
});
;// CONCATENATED MODULE: ./src/components/form/FactorForm.vue?vue&type=script&lang=js
 
;// CONCATENATED MODULE: ./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-12.use[0]!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-12.use[1]!./node_modules/vue-loader/dist/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-12.use[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/components/form/FactorForm.vue?vue&type=style&index=0&id=50bd3ec4&lang=css
// extracted by mini-css-extract-plugin

;// CONCATENATED MODULE: ./src/components/form/FactorForm.vue?vue&type=style&index=0&id=50bd3ec4&lang=css

;// CONCATENATED MODULE: ./src/components/form/FactorForm.vue




;


const FactorForm_exports_ = /*#__PURE__*/(0,exportHelper/* default */.A)(FactorFormvue_type_script_lang_js, [['render',FactorFormvue_type_template_id_50bd3ec4_render]])

/* harmony default export */ var FactorForm = (FactorForm_exports_);
;// CONCATENATED MODULE: ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/VueSure.vue?vue&type=script&lang=js
















/* harmony default export */ var VueSurevue_type_script_lang_js = ({
  components: {
    HeaderBar: HeaderBar,
    LoginForm: LoginForm,
    WorkerFrame: WorkerFrame,
    BlankForm: BlankForm,
    ChangeForm: ChangeForm,
    ForgotForm: ForgotForm,
    FactorForm: FactorForm
  },
  setup() {
    let labels = (0,reactivity_esm_bundler/* ref */.KR)((0,will_app/* getLabelModel */.aU)());
    let isShowing = (0,reactivity_esm_bundler/* ref */.KR)(true);
    let loginVisible = (0,reactivity_esm_bundler/* ref */.KR)(false);
    let menuVisible = (0,reactivity_esm_bundler/* ref */.KR)(false);
    let workingVisible = (0,reactivity_esm_bundler/* ref */.KR)(false);
    let currentForcePage = (0,reactivity_esm_bundler/* ref */.KR)("BlankForm");
    let mode = (0,reactivity_esm_bundler/* ref */.KR)("");
    return {
      labels,
      accessor: accessor,
      favorite: favorite,
      isShowing,
      loginVisible,
      menuVisible,
      workingVisible,
      currentForcePage,
      mode
    };
  },
  created() {
    loadAppConfig();
  },
  mounted() {
    console.log("App: on mounted ...");
    this.$nextTick(() => {
      (0,will_app/* startApplication */.xL)("index");
      validAccessToken((valid, json) => {
        console.log("valid :", valid, ", json :", json);
        if (!valid) {
          (0,will_app/* removeAccessorInfo */.Or)();
          this.loginVisible = true;
          setTimeout(() => {
            this.$refs.loginForm.focus();
          }, 5);
        } else {
          this.verifyAfterLogin(json.body);
        }
      });
    });
  },
  methods: {
    changeLanguage(lang) {
      let labelModel = (0,will_app/* getLabelModel */.aU)(lang);
      this.labels = labelModel;
    },
    verifyAfterLogin(body) {
      console.log("verifyAfterLogin: body", body);
      this.setAccessInfo(body);
      if (body?.factorverify && body?.factorid != "" && (body?.factorcode == undefined || body?.factorcode == "")) {
        console.log("two factor ...");
        this.isShowing = false;
        this.mode = "factor";
        this.currentForcePage = FactorForm;
      } else {
        this.verifyForcePage(body);
      }
    },
    verifyForcePage(body) {
      if (body?.changeflag == "1") {
        console.log("force change password ...");
        this.isShowing = false;
        this.mode = "force";
        this.currentForcePage = ChangeForm;
      } else if (body?.expireflag == "1") {
        console.log("password expired ...");
        this.isShowing = false;
        this.mode = "expire";
        this.currentForcePage = ChangeForm;
      } else {
        this.displayMenu();
        startReceiveBroadcast();
      }
    },
    setAccessInfo(info) {
      this.accessor.setInfo(info);
      if (this.accessor.info?.langcode && this.accessor.info?.langcode.trim().length > 0) {
        this.$refs.headerBar.changeLanguage(this.accessor.info?.langcode);
      }
    },
    loginSuccess(info) {
      console.log("login success: info", info);
      this.verifyAfterLogin(info);
    },
    displayMenu() {
      this.mode = "";
      this.currentForcePage = BlankForm;
      this.isShowing = true;
      this.loginVisible = false;
      this.menuVisible = true;
      this.$refs.headerBar.setting(menulists => {
        this.openFistPage(menulists);
      });
      this.$refs.workerFrame.setting();
      refreshScreen();
    },
    menuSelected(menu) {
      console.log("App.vue: menu selected:", menu);
      if ("logout" == menu) {
        this.goLogOut();
      } else if ("home" == menu) {
        this.goHome();
      } else if ("intro" == menu) {
        this.$refs.workerFrame.hideWorkerMenu();
      } else if ("profile" == menu) {
        this.$refs.workerFrame.showProfile();
      } else if ("changepassword" == menu) {
        this.$refs.workerFrame.showChangePassword();
      }
    },
    goHome() {
      this.workingVisible = false;
      this.$refs.headerBar.showLanguage();
      this.$refs.workerFrame.showWorkerMenu();
    },
    goLogOut() {
      logOut({
        ...this.accessor.info
      });
      this.$refs.workerFrame.reset();
      this.$refs.headerBar.reset();
      this.$refs.loginForm.reset();
      this.$refs.loginForm.focus();
      this.loginVisible = true;
      this.menuVisible = false;
      this.accessor.reset();
      if (isSSOSignedIn()) {
        doSSOLogout();
      }
      stopReceiveBroadcast();
    },
    goLogIn() {
      this.isShowing = true;
      this.mode = "";
      this.currentForcePage = BlankForm;
    },
    openFistPage(menulists) {
      let page = this.accessor.info?.firstpage || "worklist";
      console.log("openFirstPage:", page);
      if (menulists && page && page.trim().length > 0) {
        let prog = menulists.find(item => item.element.programid == page);
        if (prog) {
          openPage(prog.element, this.accessor, this.favorite);
        }
      }
    },
    hideMenu() {
      this.$refs.headerBar.collapseSideBar();
    },
    componentActivated(name) {
      console.log("component activated: ", name);
      if ("changepassword" == name) this.$refs.forceComponent.display(this.mode);else if ("forgot" == name) this.$refs.forceComponent.display(this.mode);else if ("factor" == name) this.$refs.forceComponent.display(this.mode);
    },
    processSuccess(action, info) {
      console.log("processSuccess: action", action, ", info", info);
      if ("changepassword" == action) {
        this.displayMenu();
      } else if ("factor" == action) {
        this.verifyForcePage(this.accessor.info);
      }
    },
    forgotPassword() {
      console.log("forgot password click ...");
      this.isShowing = false;
      this.mode = "forgot";
      this.currentForcePage = ForgotForm;
    }
  }
});
;// CONCATENATED MODULE: ./src/VueSure.vue?vue&type=script&lang=js
 
;// CONCATENATED MODULE: ./src/VueSure.vue




;
const VueSure_exports_ = /*#__PURE__*/(0,exportHelper/* default */.A)(VueSurevue_type_script_lang_js, [['render',render]])

/* harmony default export */ var VueSure = (VueSure_exports_);
;// CONCATENATED MODULE: ./src/vuesure.js





















(0,will_app/* appInit */.yR)({
  program_message: program_message_namespaceObject,
  default_labels: default_label_namespaceObject,
  program_labels: program_label_namespaceObject,
  listen_messaging: 'parent'
});


console.log("Vue version", runtime_core_esm_bundler/* version */.rE);
(0,runtime_dom_esm_bundler/* createApp */.Ef)(VueSure).mount('#app');

/***/ }),

/***/ 477:
/***/ (function() {

/* (ignored) */

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	!function() {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = function(result, chunkIds, fn, priority) {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var chunkIds = deferred[i][0];
/******/ 				var fn = deferred[i][1];
/******/ 				var priority = deferred[i][2];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every(function(key) { return __webpack_require__.O[key](chunkIds[j]); })) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	!function() {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = function(module) {
/******/ 			var getter = module && module.__esModule ?
/******/ 				function() { return module['default']; } :
/******/ 				function() { return module; };
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	!function() {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	!function() {
/******/ 		__webpack_require__.p = "";
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	!function() {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			57: 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = function(chunkId) { return installedChunks[chunkId] === 0; };
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = function(parentChunkLoadingFunction, data) {
/******/ 			var chunkIds = data[0];
/******/ 			var moreModules = data[1];
/******/ 			var runtime = data[2];
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some(function(id) { return installedChunks[id] !== 0; })) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkvuesure"] = self["webpackChunkvuesure"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	}();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, [504], function() { return __webpack_require__(6802); })
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=index.7cdf9d02.js.map