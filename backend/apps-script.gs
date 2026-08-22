/**
 * Yamine site form backend - Google Apps Script web app.
 *
 * Runs inside the company's own Google Workspace (the same account that
 * already receives mail for yamine.app), so no new vendor touches the data.
 * Stores submissions in a Google Sheet and notifies the mailbox on contact
 * messages. Deploy: script.new while signed in as mohamed@yamine.app,
 * paste this file, Deploy > New deployment > Web app,
 * execute as "Me", access "Anyone". Copy the /exec URL into
 * assets/forms.js ENDPOINT on the site.
 *
 * Sheet: first run creates "Yamine site forms" in My Drive with tabs
 * "waitlist" and "messages".
 */

var NOTIFY = 'mohamed@yamine.app';
var SHEET_NAME = 'Yamine site forms';

function doPost(e) {
  try {
    var p = (e && e.parameter) || {};

    // Honeypot: real visitors never fill this field.
    if (p.website) return ok_();

    var kind = p.kind === 'message' ? 'message' : 'waitlist';
    var email = String(p.email || '').trim().slice(0, 200);
    var name = String(p.name || '').trim().slice(0, 200);
    var message = String(p.message || '').trim().slice(0, 5000);

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return ok_();
    if (kind === 'message' && !message) return ok_();

    var ss = sheet_();
    if (kind === 'waitlist') {
      var tab = ss.getSheetByName('waitlist');
      var existing = tab.getRange('B:B').getValues().join('\n').toLowerCase();
      if (existing.indexOf(email.toLowerCase()) === -1) {
        tab.appendRow([new Date(), email]);
      }
    } else {
      ss.getSheetByName('messages').appendRow([new Date(), email, name, message]);
      MailApp.sendEmail({
        to: NOTIFY,
        subject: 'yamine.app message from ' + (name || email),
        body: 'From: ' + (name ? name + ' <' + email + '>' : email) +
              '\n\n' + message +
              '\n\n- sent through the yamine.app contact form',
        replyTo: email
      });
    }
    return ok_();
  } catch (err) {
    return ok_(); // never leak errors to the public endpoint
  }
}

function sheet_() {
  var props = PropertiesService.getScriptProperties();
  var id = props.getProperty('sheetId');
  var ss;
  if (id) {
    ss = SpreadsheetApp.openById(id);
  } else {
    ss = SpreadsheetApp.create(SHEET_NAME);
    props.setProperty('sheetId', ss.getId());
    ss.getSheets()[0].setName('waitlist');
    ss.getSheetByName('waitlist').appendRow(['when', 'email']);
    ss.insertSheet('messages').appendRow(['when', 'email', 'name', 'message']);
  }
  return ss;
}

function ok_() {
  return ContentService.createTextOutput('ok');
}
