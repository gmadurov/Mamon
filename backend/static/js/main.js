function deleteMessage() {
    const deleteButton = document.getElementById("alert__close");
    if (deleteButton) {
      deleteButton.addEventListener("click", function (event) {
        const messageContainer = event.target.closest(".column");
        messageContainer.remove();
      });
    }
  }