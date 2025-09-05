'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ExerciseFile } from '@/types/task';

interface PdfViewerProps {
  exerciseFile: ExerciseFile;
  taskTitle: string;
}

export function PdfViewer({ exerciseFile, taskTitle }: PdfViewerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = exerciseFile.dataUrl;
    link.download = exerciseFile.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenInNewTab = () => {
    const newWindow = window.open();
    if (newWindow) {
      newWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${exerciseFile.name}</title>
            <style>
              body { 
                margin: 0; 
                padding: 0; 
                background: #f0f0f0;
              }
              .container {
                display: flex;
                flex-direction: column;
                height: 100vh;
              }
              .header {
                background: white;
                padding: 16px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                border-bottom: 1px solid #e0e0e0;
              }
              .header h1 {
                margin: 0;
                font-size: 18px;
                color: #333;
                font-family: Arial, sans-serif;
              }
              .pdf-container {
                flex: 1;
                display: flex;
                justify-content: center;
                align-items: center;
                background: #f5f5f5;
              }
              embed {
                width: 100%;
                height: 100%;
                border: none;
              }
              .error {
                text-align: center;
                color: #666;
                font-family: Arial, sans-serif;
                padding: 40px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>📄 ${taskTitle} - ${exerciseFile.name}</h1>
              </div>
              <div class="pdf-container">
                <embed src="${exerciseFile.dataUrl}" type="application/pdf">
                <div class="error">
                  <h3>Não foi possível exibir o PDF</h3>
                  <p>Seu navegador pode não suportar a visualização de PDFs embutidos.</p>
                  <a href="${exerciseFile.dataUrl}" download="${exerciseFile.name}">
                    📥 Baixar arquivo PDF
                  </a>
                </div>
              </div>
            </div>
          </body>
        </html>
      `);
      newWindow.document.close();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="bg-red-50 hover:bg-red-100 text-red-700 border-red-200"
        >
          📄 Exercícios
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-lg">
            📄 {exerciseFile.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col h-full">
          {/* Action buttons */}
          <div className="flex gap-2 mb-4 pb-4 border-b">
            <Button onClick={handleOpenInNewTab} variant="outline" size="sm">
              🔗 Abrir em Nova Aba
            </Button>
            <Button onClick={handleDownload} variant="outline" size="sm">
              📥 Baixar
            </Button>
          </div>

          {/* PDF Preview */}
          <div className="flex-1 bg-gray-100 rounded-lg overflow-hidden">
            <iframe
              src={exerciseFile.dataUrl}
              className="w-full h-full border-none"
              title={`PDF: ${exerciseFile.name}`}
            />
          </div>

          {/* Fallback message */}
          <div className="text-center text-sm text-gray-500 mt-2">
            Se o PDF não carregar corretamente, use os botões acima para visualizar ou baixar
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}