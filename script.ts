window.onload = () => {
  const fileInput = document.getElementById('csvFile') as HTMLInputElement;
  fileInput.addEventListener('change', handleFile, false);
};

// Maneja el evento de carga de archivo.
function handleFile(e: Event) {
  const file = (e.target as HTMLInputElement).files[0];
  const reader = new FileReader();

  reader.onload = (event) => {
    const contents = event.target.result as string;
    displayCSV(contents);
  };

  reader.readAsText(file);
}

// Muestra los datos del archivo CSV en una tabla HTML.
function displayCSV(contents: string) {
  const lines = contents.split('\n');
  const table = document.getElementById('csvTable') as HTMLTableElement;
  const thead = table.getElementsByTagName('thead')[0];
  const tbody = table.getElementsByTagName('tbody')[0];
  const invalidDataContainer = document.getElementById('invalidDataContainer');
  const invalidTable = document.getElementById('invalidData');
  const invalidThead = invalidTable.getElementsByTagName('thead')[0];
  const invalidTbody = invalidTable.getElementsByTagName('tbody')[0];

  // Reinicia los contenidos de las tablas
  thead.innerHTML = '';
  tbody.innerHTML = '';
  invalidThead.innerHTML = '';
  invalidTbody.innerHTML = '';

  const headerLine = lines[0].split(',');

  // Crea las filas de encabezado en ambas tablas
  const headerRow = document.createElement('tr');
  const invalidHeaderRow = document.createElement('tr');

  for (let i = 0; i < headerLine.length; i++) {
    const th = document.createElement('th');
    th.textContent = headerLine[i];
    headerRow.appendChild(th);

    const invalidTh = document.createElement('th');
    invalidTh.textContent = headerLine[i];
    invalidHeaderRow.appendChild(invalidTh);
  }

  thead.appendChild(headerRow);
  invalidThead.appendChild(invalidHeaderRow);

  let hasInvalidData = false;

  // Recorre las líneas de datos
  for (let j = 1; j < lines.length; j++) {
    const dataLine = lines[j].split(',');
    const dataRow = document.createElement('tr');
    const invalidDataRow = document.createElement('tr');
    let hasLineInvalidData = false;
    let hasLineData = false;

    // Recorre los elementos de la línea de datos
    for (let k = 0; k < dataLine.length; k++) {
      const td = document.createElement('td');
      td.textContent = dataLine[k];
      dataRow.appendChild(td);

      const invalidTd = document.createElement('td');
      invalidTd.textContent = dataLine[k];
      invalidDataRow.appendChild(invalidTd);

      // Realiza el control de calidad
      if (k === 1 || k === 2) {
        if (!isValidString(dataLine[k])) {
          invalidTd.classList.add('invalid');
          hasLineInvalidData = true;
        }
      } else if (k === 3) {
        if (!isValidNumber(dataLine[k])) {
          invalidTd.classList.add('invalid');
          hasLineInvalidData = true;
        }
      } else if (k === 4) {
        if (!isValidEmail(dataLine[k])) {
          invalidTd.classList.add('invalid');
          hasLineInvalidData = true;
        }
      }

      if (dataLine[k].trim() !== '') {
        hasLineData = true;
      }
    }

    tbody.appendChild(dataRow);

    if (hasLineInvalidData) {
      invalidTbody.appendChild(invalidDataRow);
      hasInvalidData = true;
    }

    if (!hasLineData) {
      dataRow.style.display = 'none';
      invalidDataRow.style.display = 'none';
    }
  }

  if (hasInvalidData) {
    invalidDataContainer.style.display = 'block';
  } else {
    invalidDataContainer.style.display = 'none';
  }
}

// Verifica si una cadena consiste solo en letras y un espacio en medio (opcional).
function isValidString(str: string): boolean {
  const regex = /^[a-zA-Z]+( [a-zA-Z]+)?$/;
  return regex.test(str);
}

// Verifica si un número es positivo y tiene 10 dígitos.
function isValidNumber(num: string): boolean {
  const regex = /^\d{10}$/;
  return regex.test(num);
}

// Verifica si una cadena es una dirección de correo electrónico válida.
function isValidEmail(email: string): boolean {
  const regex = /^\s*[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\s*$/i;
  return regex.test(email);
}                        