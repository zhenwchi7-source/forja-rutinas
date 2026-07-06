/**
 * Google Apps Script — Web App (doPost)
 * Recibe los envíos de los formularios de la landing y los escribe en el Google Sheet.
 * Enruta según un campo oculto 'Formulario':
 *   - Formulario = 'seguimiento'  -> pestaña 'seguimiento'
 *   - cualquier otro              -> pestaña 'general'
 * La columna 'Marca temporal' se rellena con la fecha/hora del servidor.
 *
 * Despliegue: Implementar > Aplicación web > Ejecutar como: yo > Acceso: Cualquier persona.
 * Tras editar el código hay que crear una VERSIÓN NUEVA de la implementación.
 */
function doPost(e) {
  var tab = (e.parameter['Formulario'] === 'seguimiento') ? 'seguimiento' : 'general';
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(tab);
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var row = headers.map(function (h) {
    if (h === 'Marca temporal') return new Date();
    return e.parameter[h] || '';
  });
  sheet.appendRow(row);
  return ContentService
    .createTextOutput(JSON.stringify({ result: 'ok' }))
    .setMimeType(ContentService.MimeType.JSON);
}
