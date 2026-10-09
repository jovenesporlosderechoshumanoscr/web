interface SendEmail {
	send(message: EmailMessage | EmailMessageBuilder): Promise<EmailSendResult>;
}

interface EmailAddress {
	email: string;
	name: string;
}


interface Attachment {
	content: string | ArrayBuffer | ArrayBufferView; // Base64 string or binary content
	filename: string;
	type: string; // MIME type
	disposition: "attachment" | "inline";
	contentId?: string; // For inline attachments
}

interface EmailSendResult {
	messageId: string; // Unique email ID
}
