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
    
    let terms = latexInput.split(/([*+\-])/).map(m => m.trim()); // Kifejezés szétszedése műveletek szerint
    let matrixDimensions = matrixSize.split(",").map(dim => dim.trim());
    
    if (matrixDimensions.length * 2 - 1 !== terms.length) {
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
    
    let currentDim = parsedDimensions[0];
    let validExpression = true;
    let computationSteps = [`Kezdő dimenzió: ${currentDim[0]}×${currentDim[1]}`];
    
    for (let i = 1; i < terms.length; i += 2) {
        let operator = terms[i];
        let nextDim = parsedDimensions[(i + 1) / 2];
        
        if (operator === "*") {
            if (currentDim[1] !== nextDim[0]) {
                validExpression = false;
                computationSteps.push(`HIBA: Nem kompatibilis mátrixszorzás (${currentDim[0]}×${currentDim[1]}) * (${nextDim[0]}×${nextDim[1]})`);
                break;
            }
            currentDim = [currentDim[0], nextDim[1]];
            computationSteps.push(`Szorzás eredménye: ${currentDim[0]}×${currentDim[1]}`);
        } else if (operator === "+" || operator === "-") {
            if (currentDim[0] !== nextDim[0] || currentDim[1] !== nextDim[1]) {
                validExpression = false;
                computationSteps.push(`HIBA: Nem kompatibilis mátrixösszeadás/kivonás (${currentDim[0]}×${currentDim[1]}) ${operator} (${nextDim[0]}×${nextDim[1]})`);
                break;
            }
            computationSteps.push(`Összeadás/kivonás megtartja a dimenziót: ${currentDim[0]}×${currentDim[1]}`);
        }
    }
    
    let operationResult = validExpression 
        ? `<p style='color: green;'>A művelet helyes! Végeredmény dimenziója: ${currentDim[0]}×${currentDim[1]}</p>`
        : `<p style='color: red;'>Hibás művelet (dimenzióhiba)!</p>`;
    
    outputDiv.innerHTML = `
        <p><strong>LaTeX Kifejezés:</strong> ${latexInput}</p>
        ${operationResult}
        <h3>Lépések:</h3>
        <ul>${computationSteps.map(step => `<li>${step}</li>`).join("")}</ul>
    `;
    
    console.log("Eredmény kiírása kész");
    MathJax.typeset();

    // Mátrix vizualizáció
    visualizationDiv.innerHTML = "";
    function drawMatrix(rows, cols, label, color, isResult = false) {
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
                
                if (isResult) {
                    cell.innerHTML = `c<sub>${i+1},${j+1}</sub> = a<sub>${i+1},1</sub> * b<sub>1,${j+1}</sub> + ...`;
                } else {
                    let matrixLetter = label.trim();
                    cell.innerHTML = `${matrixLetter.toLowerCase()}<sub>${i+1},${j+1}</sub>`;
                }
                row.appendChild(cell);
            }
            matrix.appendChild(row);
        }
        
        let labelDiv = document.createElement("div");
        labelDiv.className = "matrix-label";
        labelDiv.innerText = label;
        
        matrixWrapper.appendChild(labelDiv);
        matrixWrapper.appendChild(matrix);
        visualizationDiv.appendChild(matrixWrapper);
    }
    
    parsedDimensions.forEach((dim, index) => {
        drawMatrix(dim[0], dim[1], terms[index * 2], index % 2 === 0 ? "lightblue" : "lightgreen");
    });
    if (validExpression) {
        drawMatrix(currentDim[0], currentDim[1], "Végeredmény", "orange", true);
    }
}