const docs = {
	features: [
		{
			id: "logging-in",
			title: "Logging In",
			description: "1. Click the \"Log In\" link in the Rocket Note widget next to the YouTube video. \n\n2. Choose a Google account to link to. \n\n3. If you haven't already, grant permissions to Rocket Note. \n\n4. Refresh the YouTube page you are viewing if necessary.",
			targetSelector: ".rn_notes-placeholder-login",
		},
		{
			id: "taking-notes",
			title: "Taking Notes",
			description: "1. Click on the input in the Rocket Note widget (or press the \"i\" key).\n\n2. Type the note you would like to save, then click \"Add\" (or press the \"ENTER\" key).",
			targetSelector: "#rn_input-form",
		},
		{
			id: "adding-pins",
			title: "Adding Pins",
			description: "1. Press the gray button marked with a pin icon (next to the \"Add\" button).\n\n2. You should see the pin has been added and timestamped. You will be able to edit this note just like any other and add text at any time.",
			targetSelector: "#rn_pin",
		},
		{
			id: "timestamps",
			title: "Timestamps",
			description: "Timestamps are links that can bring you back to the time in a video that you took a note (or left a pin).\n\nThese timestamps are automatically set when you take a note. They are (for now) not editable.\n\nClicking one of these timestamps will either bring the current video immediately to the timestamped spot or open a different video at the timestamped spot.",
		},
		{
			id: "tagging-notes",
			title: "Tagging Notes",
			description: "We use a hashtagging system to tag notes. Simply:\n\n1. Begin typing a note as usual.\n\n2. Type a \"#\", followed by any word or series of words without a space.\n\n3. Add the note as usual. You should see any hashtag you typed turn blue.",
			targetSelector: "#rn_input-form",
			addToInput: "#tryAddingThisNote",
		},
		{
			id: "leaving-feedback",
			title: "Leaving Feedback",
			description: "We've made it as easy as adding a note whenever you want to leave us feedback of any kind.\n\nJust type \"#feedback\" in the Rocket Note widget's input field.\n\nYou'll notice the \"Add\" button now says \"Submit Feedback\". Add the note as usual, and we will be notified immediately of your feedback.\n\nPS: We really do listen. Please leave us feedback! It's the only way for us to know what you really want to see next.",
			targetSelector: "#rn_input-form",
			addToInput: "#feedback ",
		},
		{
			id: "all-notes",
			title: "Viewing All My Notes",
			description: "To see all of your notes, click the \"view all\" link. A new tab will open up where you can view all of the notes you have ever taken.\n\nIf you are redirected to the Rocket Note home page, just click \"Log In\" in the menu and then \"My Notes\".",
			targetSelector: ".rn_dashboard-link",
		},
		{
			id: "recent-notes",
			title: "Viewing My Recent Notes",
			description: "Your last 5 notes are always viewable by clicking the Rocket Note icon in your Chrome toolbar.\n\nGo ahead, try it!",
		},
		{
			id: "toolbar",
			title: "Toolbar",
			description: "If you highlight any words on a YouTube video page, you may be surprised by some experimental toolbar features. Wink, wink.",
			targetSelector: "",
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