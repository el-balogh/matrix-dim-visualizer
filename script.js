function processInput() {
    console.log("Függvény meghívva: processInput()");
    let latexInput = document.getElementById("latexInput").value.trim();
    let matrixType = document.getElementById("matrixType").value;
    let matrixSize = document.getElementById("matrixSize").value;
    let outputDiv = document.getElementById("output");
    let visualizationDiv = document.getElementById("matrix-visualization");
    
    if (!latexInput) {
        outputDiv.innerHTML = "<p style='color: red;'>Adj meg egy LaTeX kifejezést!</p>";
        console.log("Hiba: nincs LaTeX input");
        return;
    }
    
    let matrices = latexInput.split("*").map(m => m.trim()); // Mátrixok szétszedése
    let matrixDimensions = matrixSize.split(",").map(dim => dim.trim());
    
    if (matrices.length !== matrixDimensions.length) {
        outputDiv.innerHTML = "<p style='color: red;'>A megadott mátrixok száma és dimenziók száma nem egyezik!</p>";
        console.log("Hiba: Mátrixok száma nem egyezik a dimenziókéval");
        return;
    }
    
    let parsedDimensions = matrixDimensions.map(dim => dim.includes("x") ? dim.split("x").map(s => s.trim()) : null);
    
    if (parsedDimensions.includes(null)) {
        outputDiv.innerHTML = "<p style='color: red;'>Hibás dimenzió formátum! Használj p×q, q×r formátumot.</p>";
        console.log("Hiba: Hibás dimenzió formátum");
        return;
    }
    
    let firstDim = parsedDimensions[0]; // A mátrix dimenziója
    let secondDim = parsedDimensions[1]; // B mátrix dimenziója
    
    let dimensionText = `${matrices[0]}: ${firstDim[0]}×${firstDim[1]}, ${matrices[1]}: ${secondDim[0]}×${secondDim[1]}`;
    
    let validOperation = (firstDim[1] === secondDim[0]) || isNaN(firstDim[1]) || isNaN(secondDim[0]);
    let resultDimension = validOperation ? `${firstDim[0]}×${secondDim[1]}` : "HIBA";
    
    let matrixTypeText = "";
    switch(matrixType) {
        case "wishart":
            matrixTypeText = "Wishart-mátrix";
            break;
        case "covariance":
            matrixTypeText = "Kovariancia-mátrix";
            break;
        default:
            matrixTypeText = "Általános mátrix";
    }
    
    let operationResult = validOperation 
        ? `<p style='color: green;'>A művelet helyes! Eredmény dimenziója: ${resultDimension}</p>`
        : `<p style='color: red;'>Helytelen művelet (dimenzióhiba)!</p>`;
    
    outputDiv.innerHTML = `
        <p><strong>LaTeX Kifejezés:</strong> <span class='highlight' data-dim="${firstDim[0]}×${firstDim[1]}">${matrices[0]}</span> * <span class='highlight' data-dim="${secondDim[0]}×${secondDim[1]}">${matrices[1]}</span></p>
        <p><strong>Típus:</strong> ${matrixTypeText}</p>
        <p><strong>${dimensionText}</strong></p>
        ${operationResult}
    `;
    
    console.log("Eredmény kiírása kész");
    MathJax.typeset();

    // Mátrix vizualizáció
    visualizationDiv.innerHTML = "";
    function drawMatrix(rows, cols, label, color) {
        let matrix = document.createElement("div");
        matrix.className = "matrix";
        matrix.style.width = isNaN(cols) ? `100px` : `${cols * 30}px`;
        matrix.style.height = isNaN(rows) ? `100px` : `${rows * 30}px`;
        matrix.style.backgroundColor = color;
        matrix.innerText = label;
        visualizationDiv.appendChild(matrix);
    }

    drawMatrix(firstDim[0], firstDim[1], matrices[0], "lightblue");
    drawMatrix(secondDim[0], secondDim[1], matrices[1], "lightgreen");
    if (validOperation && resultDimension !== "HIBA") {
        drawMatrix(resultDimension.split("×")[0], resultDimension.split("×")[1], "Eredmény", "orange");
    }
}