function processInput() {
    console.log("Függvény meghívva: processInput()");
    let latexInput = document.getElementById("latexInput").value.trim();
    let matrixType = document.getElementById("matrixType").value;
    let matrixSize = document.getElementById("matrixSize").value;
    let outputDiv = document.getElementById("output");
    
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
    
    let parsedDimensions = [];
    
    for (let dim of matrixDimensions) {
        let dims = dim.split("x").map(Number);
        if (dims.length === 2 && !isNaN(dims[0]) && !isNaN(dims[1])) {
            parsedDimensions.push(dims);
        }
    }
    
    if (parsedDimensions.length < 2) {
        outputDiv.innerHTML = "<p style='color: red;'>Adj meg legalább két mátrix dimenziót (pl. 3x4, 4x2).</p>";
        console.log("Hiba: Nem elég mátrix dimenzió lett megadva");
        return;
    }
    
    let firstDim = parsedDimensions[0]; // A mátrix dimenziója
    let secondDim = parsedDimensions[1]; // B mátrix dimenziója
    
    let dimensionText = `${matrices[0]}: ${firstDim[0]}×${firstDim[1]}, ${matrices[1]}: ${secondDim[0]}×${secondDim[1]}`;
    
    let validOperation = false;
    let resultDimension = "";
    
    // Ellenőrizzük, hogy a művelet helyes-e (mátrix szorzás)
    if (firstDim[1] === secondDim[0]) {
        validOperation = true;
        resultDimension = `${firstDim[0]}×${secondDim[1]}`;
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
        <p><strong>LaTeX Kifejezés:</strong> <span class='highlight' data-dim="${firstDim[0]}×${firstDim[1]}">${matrices[0]}</span> * <span class='highlight' data-dim="${secondDim[0]}×${secondDim[1]}">${matrices[1]}</span></p>
        <p><strong>Típus:</strong> ${matrixTypeText}</p>
        <p><strong>${dimensionText}</strong></p>
        ${operationResult}
    `;
    
    console.log("Eredmény kiírása kész");
    MathJax.typeset();

    // Tooltip hozzáadása
    document.querySelectorAll(".highlight").forEach(el => {
        el.addEventListener("mouseover", function() {
            let tooltip = document.createElement("div");
            tooltip.className = "tooltip";
            tooltip.innerText = `Dimenzió: ${el.getAttribute("data-dim")}`;
            document.body.appendChild(tooltip);
            let rect = el.getBoundingClientRect();
            tooltip.style.left = `${rect.left + window.scrollX}px`;
            tooltip.style.top = `${rect.top + window.scrollY - 30}px`;
        });
        el.addEventListener("mouseout", function() {
            document.querySelectorAll(".tooltip").forEach(t => t.remove());
        });
    });
}