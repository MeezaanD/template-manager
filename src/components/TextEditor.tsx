import React from 'react';
import { Box, TextField, IconButton, Tooltip } from '@mui/material';
import { CiExport } from "react-icons/ci";
import jsPDF from 'jspdf';

interface TextEditorProps {
	selectedTemplate: string | null;
	templateText: string;
	setTemplateText: (text: string) => void;
	saveTemplate: () => void;
	copyText: () => void;
}

const TextEditor: React.FC<TextEditorProps> = ({
	selectedTemplate,
	templateText,
	setTemplateText,
}) => {
	// Function to handle PDF export
	const exportToPDF = () => {
		const doc = new jsPDF();

		// Add text to the PDF and format it for A4
		doc.setFontSize(12);
		doc.text(templateText, 10, 10, {
			maxWidth: 190, // A4 width - margins
		});

		// Save the PDF with the template name or default
		const pdfName = selectedTemplate ? `${selectedTemplate}.pdf` : 'template.pdf';
		doc.save(pdfName);
	};

	return (
		<Box>
			<TextField
				fullWidth
				multiline
				rows={20}
				value={templateText}
				onChange={(e) => setTemplateText(e.target.value)}
				placeholder="Edit template text here..."
			/>
			<Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
				<Tooltip title="Export As PDF" arrow>
					<IconButton onClick={exportToPDF}>
						Export as PDF<CiExport />
					</IconButton>
				</Tooltip>
			</Box>
		</Box>
	);
};

export default TextEditor;
