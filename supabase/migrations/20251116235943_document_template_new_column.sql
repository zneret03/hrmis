ALTER TABLE document_templates ADD COLUMN type TEXT CHECK (type IN ('pdf', 'docx'));
