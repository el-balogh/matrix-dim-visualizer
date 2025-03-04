function processInput() {
    console.log("Függvény meghívva: processInput()");
    let latexInput = document.getElementById("latexInput").value.trim();
    let matrixSize = document.getElementById("matrixSize").value;
    let outputDiv = document.getElementById("output");
    let visualizationDiv = document.getElementById("matrix-visualization");
    let computationDiv = document.getElementById("computation-steps");
    
    if (!latexInput) {
        outputDiv.innerHTML = "<p style='color: red;'>Adj meg egy LaTeX kifejezést!</p>";
        console.log("Hiba: nincs LaTeX input");
        return;
    }
    
    let terms = latexInput.split(/([*+\-])/).map(m => m.trim());
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
    let intermediateResults = [];
    
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
            intermediateResults.push([...currentDim]);
        } else if (operator === "^-1") {
            currentDim = [currentDim[1], currentDim[0]];
            computationSteps.push(`Inverz képzése: ${currentDim[0]}×${currentDim[1]}`);
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

    visualizationDiv.innerHTML = "";
    computationDiv.innerHTML = "<h3>Köztes Eredmények:</h3>";
    function drawMatrix(rows, cols, label, color, isResult = false) {
        let matrixWrapper = document.createElement("div");
        matrixWrapper.className = "matrix-wrapper";
        let matrix = document.createElement("div");
        matrix.className = "matrix";
        matrix.style.border = `3px solid ${color}`;
        
        let bracketLeft = document.createElement("div");
        bracketLeft.className = "bracket-left";
        bracketLeft.innerHTML = "{";
        let bracketRight = document.createElement("div");
        bracketRight.className = "bracket-right";
        bracketRight.innerHTML = "}";
        
        matrixWrapper.appendChild(bracketLeft);
        matrixWrapper.appendChild(matrix);
        matrixWrapper.appendChild(bracketRight);
        
        let labelDiv = document.createElement("div");
        labelDiv.className = "matrix-label";
        labelDiv.innerText = label;
        matrixWrapper.appendChild(labelDiv);
        visualizationDiv.appendChild(matrixWrapper);
    }
    
    parsedDimensions.forEach((dim, index) => {
        drawMatrix(dim[0], dim[1], terms[index * 2], index % 2 === 0 ? "lightblue" : "lightgreen");
    });
    intermediateResults.forEach((dim, index) => {
        drawMatrix(dim[0], dim[1], `Köztes ${index + 1}`, "gray");
    });
    if (validExpression) {
        drawMatrix(currentDim[0], currentDim[1], "Végeredmény", "orange", true);
    }
}