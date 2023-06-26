window.onload = function () {
  var fileInput = document.getElementById("csvFile");
  fileInput.addEventListener("change", handleFile, false);
};

/**
 * Maneja el evento de carga de archivo.
 * @param {Event} e - Evento de carga de archivo.
 */
function handleFile(e) {
  var file = e.target.files[0];
  var reader = new FileReader();

  reader.onload = function (event) {
    var contents = event.target.result;
    displayCSV(contents);
  };

  reader.readAsText(file);
}

/**
 * Muestra los datos del archivo CSV en una tabla HTML.
 * @param {string} contents - Contenido del archivo CSV.
 */
function displayCSV(contents) {
  var lines = contents.split("\n");
  var table = document.getElementById("csvTable");
  var thead = table.getElementsByTagName("thead")[0];
  var tbody = table.getElementsByTagName("tbody")[0];
  var invalidDataContainer = document.getElementById("invalidDataContainer");
  var invalidTable = document.getElementById("invalidData");
  var invalidThead = invalidTable.getElementsByTagName("thead")[0];
  var invalidTbody = invalidTable.getElementsByTagName("tbody")[0];

  // Reinicia los contenidos de las tablas
  thead.innerHTML = "";
  tbody.innerHTML = "";
  invalidThead.innerHTML = "";
  invalidTbody.innerHTML = "";

  var headerLine = lines[0].split(",");

  // Crea las filas de encabezado en ambas tablas
  var headerRow = document.createElement("tr");
  var invalidHeaderRow = document.createElement("tr");

  for (var i = 0; i < headerLine.length; i++) {
    var th = document.createElement("th");
    th.textContent = headerLine[i];
    headerRow.appendChild(th);

    var invalidTh = document.createElement("th");
    invalidTh.textContent = headerLine[i];
    invalidHeaderRow.appendChild(invalidTh);
  }

  thead.appendChild(headerRow);
  invalidThead.appendChild(invalidHeaderRow);

  var hasInvalidData = false;

  // Recorre las líneas de datos
  for (var j = 1; j < lines.length; j++) {
    var dataLine = lines[j].split(",");
    var dataRow = document.createElement("tr");
    var invalidDataRow = document.createElement("tr");
    var hasLineInvalidData = false;

    // Recorre los elementos de la línea de datos
    for (var k = 0; k < dataLine.length; k++) {
      var td = document.createElement("td");
      var invalidTd = document.createElement("td");
      var data = dataLine[k].trim();

      td.textContent = data;
      dataRow.appendChild(td);

      // Verifica si el dato está vacío y oculta la fila correspondiente
      if (data === "") {
        td.style.display = "none";
        invalidTd.style.display = "none";
        continue;
      }

      // Verifica la validez de los datos en la segunda y tercera columna
      if (k === 1 || k === 2) {
        if (!isValidString(data)) {
          invalidTd.classList.add("invalid");
          hasLineInvalidData = true;
          hasInvalidData = true;
        }
      }

      // Verifica la validez de los datos en la primera y cuarta columna
      if (k === 0 || k === 3) {
        if (!isValidNumber(data)) {
          invalidTd.classList.add("invalid");
          hasLineInvalidData = true;
          hasInvalidData = true;
        }
      }

      // Verifica la validez de los datos en la quinta columna (dirección de correo electrónico)
      if (k === 4) {
        if (!isValidEmail(data)) {
          invalidTd.classList.add("invalid");
          hasLineInvalidData = true;
          hasInvalidData = true;
        }
      }

      invalidTd.textContent = data;
      invalidDataRow.appendChild(invalidTd);
    }

    tbody.appendChild(dataRow);

    if (hasLineInvalidData) {
      invalidTbody.appendChild(invalidDataRow);
    }
  }

  if (hasInvalidData) {
    invalidDataContainer.style.display = "block";
  }
}

/**
 * Verifica si una cadena de texto es válida según los criterios establecidos.
 * @param {string} str - Cadena de texto a validar.
 * @returns {boolean} - true si la cadena es válida, false en caso contrario.
 */
function isValidString(str) {
  var regex = /^[A-Za-z]+(?:\s?[A-Za-z]+)*$/;
  return regex.test(str);
}

/**
 * Verifica si un número es válido según los criterios establecidos.
 * @param {string} num - Número a validar.
 * @returns {boolean} - true si el número es válido, false en caso contrario.
 */
function isValidNumber(num) {
  var regex = /^\d+$/;
  return regex.test(num) && num.length === 10;
}

/**
 * Verifica si una dirección de correo electrónico es válida según los criterios establecidos.
 * @param {string} email - Dirección de correo electrónico a validar.
 * @returns {boolean} - true si el email es válido, false en caso contrario.
 */
function isValidEmail(email) {
  var regex = /^\s*[^\s@]+@[^\s@]+\.[^\s@]{2,}\s*$/;
  return regex.test(email);
}
