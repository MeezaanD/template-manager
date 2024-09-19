import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import TextEditor from './TextEditor';
import { Box, IconButton, Tooltip } from '@mui/material';
import { MdMenu, MdAdd, MdSave, MdContentCopy } from 'react-icons/md';
import axios from 'axios';

interface Template {
	name: string;
	content: string;
}

const TemplateManager: React.FC = () => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);
	const [templates, setTemplates] = useState<Template[]>([]);
	const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
	const [templateText, setTemplateText] = useState<string>(''); // Text editor content
	const [saveSuccess, setSaveSuccess] = useState(false); // For tooltip

	useEffect(() => {
		const fetchTemplates = async () => {
			try {
				const response = await axios.get('http://localhost:5000/api/templates');
				setTemplates(response.data);
			} catch (error) {
				console.error('Error fetching templates:', error);
			}
		};

		fetchTemplates();
	}, []);

	const saveTemplates = async (updatedTemplates: Template[]) => {
		try {
			await axios.post('http://localhost:5000/api/templates', updatedTemplates);
			setTemplates(updatedTemplates);
			setSaveSuccess(true);
			setTimeout(() => setSaveSuccess(false), 2000); // Hide tooltip after 2 seconds
		} catch (error) {
			console.error('Error saving templates:', error);
		}
	};

	const toggleSidebar = () => {
		setIsSidebarOpen(!isSidebarOpen);
	};

	const addTemplate = () => {
		const newTemplate: Template = {
			name: `Template ${templates.length + 1}`,
			content: '',
		};
		const updatedTemplates = [...templates, newTemplate];
		setTemplates(updatedTemplates);
		setSelectedTemplate(newTemplate);
		setTemplateText(''); // Clear editor for new template
		saveTemplates(updatedTemplates); // Save the new template
	};

	const deleteTemplate = (templateName: string) => {
		const updatedTemplates = templates.filter(t => t.name !== templateName);
		setTemplates(updatedTemplates);
		if (selectedTemplate?.name === templateName) {
			setSelectedTemplate(null);
			setTemplateText('');
		}
		saveTemplates(updatedTemplates); // Save after deletion
	};

	const saveTemplate = () => {
		if (selectedTemplate) {
			const updatedTemplates = templates.map(t =>
				t.name === selectedTemplate.name ? { ...t, content: templateText } : t
			);
			setTemplates(updatedTemplates);
			saveTemplates(updatedTemplates); // Save the edited template
		}
	};

	const copyText = () => {
		navigator.clipboard.writeText(templateText);
	};

	const renameTemplate = (oldName: string, newName: string) => {
		const updatedTemplates = templates.map(t =>
			t.name === oldName ? { ...t, name: newName } : t
		);
		setTemplates(updatedTemplates);
		if (selectedTemplate?.name === oldName) {
			setSelectedTemplate(prev => (prev ? { ...prev, name: newName } : null));
		}
		saveTemplates(updatedTemplates); // Save after renaming
	};

	return (
		<Box sx={{ display: 'flex', height: '100vh' }}>
			{/* Sidebar Section */}
			{isSidebarOpen && (
				<Box sx={{ width: '250px', backgroundColor: '#f4f4f4', transition: 'width 0.3s' }}>
					<Sidebar
						templates={templates}
						selectedTemplate={selectedTemplate?.name || null}
						setSelectedTemplate={(name) => {
							const template = templates.find(t => t.name === name);
							if (template) {
								setSelectedTemplate(template);
								setTemplateText(template.content);
							}
						}}
						deleteTemplate={deleteTemplate}
						renameTemplate={renameTemplate} // Pass the rename function
					/>
				</Box>
			)}

			{/* TextEditor Section */}
			<Box sx={{ flexGrow: 1, transition: 'width 0.3s', padding: '16px' }}>
				{/* Top Bar with Icons */}
				<Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
					<IconButton onClick={toggleSidebar} sx={{ mr: 1 }}>
						<MdMenu />
					</IconButton>

					{/* Add new template button */}
					<Tooltip title="Add New Template" arrow>
						<IconButton onClick={addTemplate} sx={{ mr: 1 }}>
							<MdAdd />
						</IconButton>
					</Tooltip>

					{/* Save button with tooltip */}
					<Tooltip title={saveSuccess ? "Saved Successfully!" : "Save Template"} arrow>
						<IconButton onClick={saveTemplate} sx={{ mr: 1 }}>
							<MdSave />
						</IconButton>
					</Tooltip>

					{/* Copy to clipboard button */}
					<Tooltip title="Copy Text to Clipboard" arrow>
						<IconButton onClick={copyText}>
							<MdContentCopy />
						</IconButton>
					</Tooltip>
				</Box>

				{/* Text Editor */}
				<TextEditor
					selectedTemplate={selectedTemplate?.name || null}
					templateText={templateText}
					setTemplateText={setTemplateText}
					saveTemplate={saveTemplate}
					copyText={copyText}
				/>
			</Box>
		</Box>
	);
};

export default TemplateManager;
