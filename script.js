window.onload = function () {
  var fileInput = document.getElementById("csvFile");
  fileInput.addEventListener("change", handleFile, false);
};

//Maneja el evento de carga de archivo.
function handleFile(e) {
  var file = e.target.files[0];
  var reader = new FileReader();

  reader.onload = function (event) {
    var contents = event.target.result;
    displayCSV(contents);
  };

  reader.readAsText(file);
}

//Muestra los datos del archivo CSV en una tabla HTML.
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
    var hasLineData = false;

    // Recorre los elementos de la línea de datos
    for (var k = 0; k < dataLine.length; k++) {
      var td = document.createElement("td");
      td.textContent = dataLine[k];
      dataRow.appendChild(td);

      var invalidTd = document.createElement("td");
      invalidTd.textContent = dataLine[k];
      invalidDataRow.appendChild(invalidTd);

      // Realiza el control de calidad
      if (k === 1 || k === 2) {
        if (!isValidString(dataLine[k])) {
          invalidTd.classList.add("invalid");
          hasLineInvalidData = true;
        }
      } else if (k === 3) {
        if (!isValidNumber(dataLine[k])) {
          invalidTd.classList.add("invalid");
          hasLineInvalidData = true;
        }
      } else if (k === 4) {
        if (!isValidEmail(dataLine[k])) {
          invalidTd.classList.add("invalid");
          hasLineInvalidData = true;
        }
      }

      if (dataLine[k].trim() !== "") {
        hasLineData = true;
      }
    }

    tbody.appendChild(dataRow);

    if (hasLineInvalidData) {
      invalidTbody.appendChild(invalidDataRow);
      hasInvalidData = true;
    }

    if (!hasLineData) {
      dataRow.style.display = "none";
      invalidDataRow.style.display = "none";
    }
  }

  if (hasInvalidData) {
    invalidDataContainer.style.display = "block";
  } else {
    invalidDataContainer.style.display = "none";
  }
}

//Verifica si una cadena consiste solo en letras y un espacio en medio (opcional).
function isValidString(str) {
  var regex = /^[a-zA-Z]+( [a-zA-Z]+)?$/;
  return regex.test(str);
}

//Verifica si un número es positivo y tiene 10 dígitos.
function isValidNumber(num) {
  var regex = /^\d{10}$/;
  return regex.test(num);
}

//Verifica si una cadena es una dirección de correo electrónico válida.
function isValidEmail(email) {
  var regex = /^\s*[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\s*$/i;
  return regex.test(email);
}
