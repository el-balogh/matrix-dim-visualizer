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
    if (matrixSize.trim()) {
        dimensionText = `Dimenzió: ${matrixSize}`;
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
    
    outputDiv.innerHTML = `
        <p><strong>LaTeX Kifejezés:</strong> \(${latexInput}\)</p>
        <p><strong>Típus:</strong> ${matrixTypeText}</p>
        <p><strong>${dimensionText}</strong></p>
    `;
    
    MathJax.typeset();
}
