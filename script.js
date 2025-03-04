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
    
    let validOperation = (firstDim[1] === secondDim[0]) || isNaN(firstDim[1]) || isNaN(secondDim[0]);
    let resultDimension = validOperation ? `${firstDim[0]}×${secondDim[1]}` : "HIBA";
    
    let operationResult = validOperation 
        ? `<p style='color: green;'>A művelet helyes! Eredmény dimenziója: ${resultDimension}</p>`
        : `<p style='color: red;'>Helytelen művelet (dimenzióhiba)!</p>`;
    
    outputDiv.innerHTML = `
        <p><strong>LaTeX Kifejezés:</strong> ${latexInput}</p>
        ${operationResult}
    `;
    
    console.log("Eredmény kiírása kész");
    MathJax.typeset();

    // Mátrix vizualizáció
    visualizationDiv.innerHTML = "";
    function drawMatrix(rows, cols, label, color) {
        let matrixWrapper = document.createElement("div");
        matrixWrapper.className = "matrix-wrapper";
        
        let matrix = document.createElement("div");
        matrix.className = "matrix";
        matrix.style.border = `3px solid ${color}`;
        
        for (let i = 0; i < Math.min(rows, 4); i++) {
            let row = document.createElement("div");
            row.className = "matrix-row";
            for (let j = 0; j < Math.min(cols, 4); j++) {
                let cell = document.createElement("div");
                cell.className = "matrix-cell";
                cell.innerText = `a${i+1},${j+1}`;
                row.appendChild(cell);
            }
            if (cols > 4) {
                let dots = document.createElement("div");
                dots.className = "matrix-cell dots";
                dots.innerText = "...";
                row.appendChild(dots);
            }
            matrix.appendChild(row);
        }
        if (rows > 4) {
            let dotsRow = document.createElement("div");
            dotsRow.className = "matrix-row";
            dotsRow.innerHTML = `<div class='matrix-cell dots'>...</div>`;
            matrix.appendChild(dotsRow);
        }
        
        let labelDiv = document.createElement("div");
        labelDiv.className = "matrix-label";
        labelDiv.innerText = label;
        
        matrixWrapper.appendChild(labelDiv);
        matrixWrapper.appendChild(matrix);
        visualizationDiv.appendChild(matrixWrapper);
    }

    drawMatrix(firstDim[0], firstDim[1], matrices[0], "lightblue");
    drawMatrix(secondDim[0], secondDim[1], matrices[1], "lightgreen");
    if (validOperation && resultDimension !== "HIBA") {
        let resultDim = resultDimension.split("×");
        drawMatrix(resultDim[0], resultDim[1], "Eredmény", "orange");
    }
}