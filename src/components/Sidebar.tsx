import React, { useState } from 'react';
import { List, ListItem, IconButton, TextField, Box } from '@mui/material';
import { MdDelete, MdEdit, MdCancel } from 'react-icons/md';

interface SidebarProps {
	templates: { name: string; content: string }[];
	selectedTemplate: string | null;
	setSelectedTemplate: (name: string) => void;
	deleteTemplate: (name: string) => void;
	renameTemplate: (oldName: string, newName: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ templates, selectedTemplate, setSelectedTemplate, deleteTemplate, renameTemplate }) => {
	const [editName, setEditName] = useState<string | null>(null);
	const [newName, setNewName] = useState<string>('');
	const [originalName, setOriginalName] = useState<string>('');

	const handleRename = (oldName: string) => {
		if (newName.trim() && oldName !== newName) {
			renameTemplate(oldName, newName);
			setEditName(null);
			setNewName('');
		}
	};

	const handleCancel = () => {
		setNewName('');
		setEditName(null);
		setNewName(originalName); // Revert to the original name
	};

	return (
		<List>
			{templates.map((template) => (
				<ListItem
					key={template.name}
					selected={template.name === selectedTemplate}
					onClick={() => setSelectedTemplate(template.name)}
					sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
				>
					{editName === template.name ? (
						<Box sx={{ display: 'flex', alignItems: 'center' }}>
							<TextField
								value={newName}
								onChange={(e) => setNewName(e.target.value)}
								onBlur={() => handleRename(template.name)}
								onKeyDown={(e) => {
									if (e.key === 'Enter') {
										handleRename(template.name);
									}
								}}
								autoFocus
								size="small"
								sx={{ mr: 1 }}
							/>
							<IconButton onClick={() => handleRename(template.name)}>
								<MdEdit />
							</IconButton>
							<IconButton onClick={handleCancel} sx={{ ml: 1 }}>
								<MdCancel />
							</IconButton>
						</Box>
					) : (
						<>
							{template.name}
							<IconButton onClick={() => {
								setEditName(template.name);
								setOriginalName(template.name); // Save the original name for cancel
								setNewName(template.name); // Set newName to originalName
							}} sx={{ ml: 1 }}>
								<MdEdit />
							</IconButton>
							<IconButton onClick={() => deleteTemplate(template.name)} sx={{ ml: 1 }}>
								<MdDelete />
							</IconButton>
						</>
					)}
				</ListItem>
			))}
		</List>
	);
};

export default Sidebar;
