let pdfDoc = null;
        let pageNum = 1;
        let imageFiles = [null];
        let clinicStamp = new Image()
        clinicStamp.src = "imagem/carimbo.jpg"
        
        document.getElementById("pdfDropZone").addEventListener("click", () => {
            document.getElementById("pdfInput").click();
        });

        document.getElementById("imageDropZone1").addEventListener("click", () => {
            document.getElementById("imageInput1").click();
        });

        document.getElementById("pdfInput").addEventListener("change", (event) => {
            const file = event.target.files[0];
            if (file) {
                const fileReader = new FileReader();
                fileReader.onload = function() {
                    const typedArray = new Uint8Array(this.result);
                    pdfjsLib.getDocument(typedArray).promise.then((pdf) => {
                        pdfDoc = pdf;
                        renderPage();
                    });
                };
                fileReader.readAsArrayBuffer(file);
            }
        });

        document.getElementById("imageInput1").addEventListener("change", (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    imageFiles[0] = new Image();
                    imageFiles[0].src = e.target.result;
                    imageFiles[0].onload = renderPage;
                };
                reader.readAsDataURL(file);
            }
        });

        document.getElementById("exportButton").addEventListener("click", () => {
            if (!pdfDoc) {
                alert("Por favor, carregue um PDF primeiro.");
                return;
            }
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF({
                orientation: "portrait",
                unit: "px",
                format: [pdfCanvas.width, pdfCanvas.height],
                compress: true 
            });
            const canvas = document.getElementById("pdfCanvas");
            const imgData = canvas.toDataURL("image/jpeg", 0.6);
            doc.addImage(imgData, "JPEG", 0, 0, canvas.width, canvas.height);
            const fileName = document.getElementById("filename").value.trim() || "Guia-de-encaminhamento";
            doc.save(`${fileName}.pdf`);
        });

        function renderPage() {
            if (!pdfDoc) return;
            pdfDoc.getPage(pageNum).then((page) => {
                const scale = 1.5;
                const viewport = page.getViewport({ scale });
                const canvas = document.getElementById("pdfCanvas");
                const ctx = canvas.getContext("2d");
                canvas.width = viewport.width;
                canvas.height = viewport.height;
                
                const renderContext = {
                    canvasContext: ctx,
                    viewport: viewport
                };
                page.render(renderContext).promise.then(() => {       
                    if (imageFiles[0]) {
                        ctx.drawImage(imageFiles[0], 100, 840, 250, 50);
                    }         
                    ctx.drawImage(clinicStamp, canvas.width - 250, canvas.height / 6, 170, 110);
                });
            });
        }
        document.getElementById("exportButton").addEventListener("click", () => {
            if (!pdfDoc) {
                alert("Por favor, carregue um PDF primeiro.");
                return;
            }
    
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF({
                orientation: "portrait",
                unit: "px",
                format: [pdfCanvas.width / 2, pdfCanvas.height /2],
                compress: true 
            });
    
            const canvas = document.getElementById("pdfCanvas");
            const imgData = canvas.toDataURL("image/jpeg", 0.7);
            doc.addImage(imgData, "JPEG", 0, 0, canvas.width / 2, canvas.height /2);
            const filename = document.getElementById("filename").value || "Guia-de-encaminhamento";
            doc.save(`${fileName}.pdf`);
        });
        
