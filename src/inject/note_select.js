function watchNoteSelect() {
    $(document).on("click", ".existing-note, .existing-note p", e => {
        $(e.target).closest(".existing-note").toggleClass("selected"); // TODO: Need to get this to target the note when the p tag is clicked.
        console.log("clicked!");

        if ($(".existing-note.selected").length > 0) {
            changeButtonsToEditAndDelete();
            showClearAllButton();
        } else {
            changeButtonsToAddAndPin();
            hideClearAllButton();
        }
    });

    function changeButtonsToAddAndPin() {
        console.log("Add + Pin");
        // Sub out button id's, classes, etc
        const editAttributes = {
            id: "rn_note-submit",
        };
        const deleteAttributes = {

        };

        $("#rn_edit-button").attr(editAttributes).text("Add");
    }

    function changeButtonsToEditAndDelete() {
        // Sub out button id's, classes, etc
        console.log("Edit + Delete");
        const editAttributes = {
            id: "rn_edit-button",
        };
        const deleteAttributes = {

        };

        $("#rn_note-submit").attr(editAttributes).text("Edit");
    }

    function showClearAllButton() {
        console.log("Showing clear all button.");
    }

    function hideClearAllButton() {
        console.log("Hiding clear all button.");
    }
}