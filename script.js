function processInput() {
    let latexInput = document.getElementById("latexInput").value;
    let matrixType = document.getElementById("matrixType").value;
    let matrixSize = document.getElementById("matrixSize").value;
    let outputDiv = document.getElementById("output");
    
    if (!latexInput.trim()) {
        outputDiv.innerHTML = "<p style='color: red;'>Adj meg egy LaTeX kifejezést!</p>";
        return;
    }
    
    let dimensionText = "";
    let dimensions = matrixSize.trim().split("x");
    let validOperation = false;
    let resultDimension = "";
    
    if (dimensions.length === 2) {
        let rows = parseInt(dimensions[0]);
        let cols = parseInt(dimensions[1]);
        
        if (!isNaN(rows) && !isNaN(cols)) {
            dimensionText = `Dimenzió: ${rows}×${cols}`;
            
            // Dimenzióellenőrzés alapműveletekre
            if (latexInput.includes("*")) {
                let parts = latexInput.split("*");
                if (parts.length === 2) {
                    let firstDim = dimensions;
                    let secondDim = [cols, Math.floor(Math.random() * 5) + 1]; // Második mátrix oszlopszám randomizálva
                    
                    if (firstDim[1] == secondDim[0]) {
                        validOperation = true;
                        resultDimension = `${firstDim[0]}×${secondDim[1]}`;
                    }
                }
            }
        }
    } else {
        dimensionText = "Dimenzió nem meghatározott";
    }
    
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
        <p><strong>LaTeX Kifejezés:</strong> \(${latexInput}\)</p>
        <p><strong>Típus:</strong> ${matrixTypeText}</p>
        <p><strong>${dimensionText}</strong></p>
        ${operationResult}
    `;
    
    MathJax.typeset();
}