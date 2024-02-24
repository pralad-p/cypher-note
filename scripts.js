// scripts.js

document.addEventListener('DOMContentLoaded', () => {
    const textArea = document.getElementById('editable-area');

    // Clear placeholder on focus
    textArea.addEventListener('focus', function() {
        if (this.value === this.getAttribute('placeholder')) {
            this.value = '';
        }
    });

    // Optionally, you can reinsert the placeholder if the textarea is still empty when it loses focus
    textArea.addEventListener('blur', function() {
        if (this.value === '') {
            this.value = this.getAttribute('placeholder');
        }
    });

    document.querySelectorAll('.checkbox-custom').forEach(function(customCheckbox) {
        customCheckbox.addEventListener('click', function() {
            const checkbox = this.nextElementSibling;
            checkbox.checked = !checkbox.checked;
            this.classList.toggle('checked', checkbox.checked);
        });
    });

});
