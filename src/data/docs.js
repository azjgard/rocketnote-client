const docs = {
	features: [
		{
			id: "log-in",
			title: "Log In",
			description: "1. Click the \"Log In\" link in the Rocket Note widget next to the YouTube video. \n\n2. Choose a Google account to link to. \n\n3. If you haven't already, grant permissions to Rocket Note. \n\n4. Refresh the YouTube page you are viewing if necessary.",
			targetSelector: ".rn_notes-placeholder-login",
		},
		{
			id: "take-notes",
			title: "Take A Note",
			description: "1. Click on the input in the Rocket Note widget (or press the \"i\" key).\n\n2. Type the note you would like to save, then click \"Add\" (or press the \"ENTER\" key).",
			targetSelector: "#rn_input-form",
		},
		{
			id: "",
			title: "",
			description: "",
			targetSelector: "#",
		},
		{
			id: "",
			title: "",
			description: "",
			targetSelector: "#",
		},
		{
			id: "",
			title: "",
			description: "",
			targetSelector: "#",
		},
		{
			id: "",
			title: "",
			description: "",
			targetSelector: "#",
		},
	],
	shortcuts: [
		{
			key: "i",
			title: "Focus on 'Add Note' Input",
			description: "Pressing \"i\" puts the cursor in the \"Add Note\" input in the YouTube widget.",
		},
		{
			key: "o",
			title: "Collapse Notes Widget",
			description: "Pressing \"o\" collapses the YouTube widget. Pressing \"o\" again will expand the widget.",
		},
		{
			key: "p",
			title: "Add Pin",
			description: "Pressing \"p\" adds a pinned note with no text.",
		},
		{
			key: "[",
			title: "Toggle Edit Mode",
			description: "Pressing \"[\" toggles Edit mode. This will allow you to click the edit or delete buttons next to a note.",
		},
		{
			key: "SHIFT + 1 or 2",
			title: "Change Widget Tabs",
			description: "Pressing \"SHIFT + 1\" or \"SHIFT + 2\" on a YouTube playlist or live video page changes which tab is active in the YouTube widget.",
		},
		{
			key: "z",
			title: "Show \"Help\" Window (this popup)",
			description: "Pressing \"z\" opens this menu, where you can view keyboard shortcuts and docs.",
		},
	],
};