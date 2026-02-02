// Handle view/create mode switching based on query parameter
(function() {
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('mode');
    
    const viewDiv = document.getElementById('view');
    const createDiv = document.getElementById('create');
    
    if (mode === 'new') {
        if (createDiv) createDiv.classList.add('active');
        if (viewDiv) viewDiv.classList.remove('active');
    } else {
        if (viewDiv) viewDiv.classList.add('active');
        if (createDiv) createDiv.classList.remove('active');
    }
})();

// --- Edit form: image preview ---
(function() {
    const imageInput = document.getElementById('edit-recipe-image-url');
    const imagePreview = document.getElementById('edit-recipe-image-preview');
    if (!imageInput || !imagePreview) return;

    function tryPreview() {
        const url = (imageInput.value || '').trim();
        if (!url) {
            imagePreview.style.display = 'none';
            imagePreview.removeAttribute('src');
            return;
        }
        const img = new Image();
        img.onload = function() {
            imagePreview.src = url;
            imagePreview.style.display = 'block';
        };
        img.onerror = function() {
            imagePreview.style.display = 'none';
            imagePreview.removeAttribute('src');
        };
        img.src = url;
    }

    imageInput.addEventListener('input', tryPreview);
    imageInput.addEventListener('change', tryPreview);
})();

// --- Edit form: dynamic ingredients and steps (add, remove, reorder) ---
(function() {
    const ingredientsContainer = document.getElementById('create-ingredients');
    const stepsContainer = document.getElementById('create-steps');
    const addIngredientBtn = document.getElementById('add-ingredient-btn');
    const addStepBtn = document.getElementById('add-step-btn');

    function createIngredientRow() {
        const wrap = document.createElement('div');
        wrap.className = 'ingredient-row ingredient-create';
        wrap.innerHTML =
            '<div class="ingredient-field">' +
            '  <label>Name:</label>' +
            '  <input type="text" class="ingredient-name" placeholder="Ingredient name">' +
            '</div>' +
            '<div class="ingredient-field">' +
            '  <label>Amount:</label>' +
            '  <input type="text" class="ingredient-amount" placeholder="e.g. 2 cups">' +
            '</div>' +
            '<div class="row-actions">' +
            '  <button type="button" class="btn-remove-ingredient">Remove</button>' +
            '  <button type="button" class="btn-move-up" title="Move up">↑</button>' +
            '  <button type="button" class="btn-move-down" title="Move down">↓</button>' +
            '</div>';
        return wrap;
    }

    function createStepRow() {
        const wrap = document.createElement('div');
        wrap.className = 'step-row step';
        const index = stepsContainer.querySelectorAll('.step-row').length + 1;
        wrap.innerHTML =
            '<label class="step-label">Step #<span class="step-number">' + index + '</span>:</label>' +
            '<textarea class="step-content" placeholder="Describe this step..."></textarea>' +
            '<div class="row-actions">' +
            '  <button type="button" class="btn-remove-step">Remove</button>' +
            '  <button type="button" class="btn-move-up" title="Move up">↑</button>' +
            '  <button type="button" class="btn-move-down" title="Move down">↓</button>' +
            '</div>';
        return wrap;
    }

    function renumberSteps() {
        stepsContainer.querySelectorAll('.step-row').forEach(function(row, i) {
            const num = row.querySelector('.step-number');
            if (num) num.textContent = i + 1;
        });
    }

    function addIngredient() {
        const row = createIngredientRow();
        ingredientsContainer.appendChild(row);
        row.querySelector('.btn-remove-ingredient').addEventListener('click', function() {
            if (ingredientsContainer.querySelectorAll('.ingredient-row').length > 1) {
                row.remove();
            }
        });
        row.querySelector('.btn-move-up').addEventListener('click', function() {
            const prev = row.previousElementSibling;
            if (prev) ingredientsContainer.insertBefore(row, prev);
        });
        row.querySelector('.btn-move-down').addEventListener('click', function() {
            const next = row.nextElementSibling;
            if (next) ingredientsContainer.insertBefore(next, row);
        });
    }

    function addStep() {
        const row = createStepRow();
        stepsContainer.appendChild(row);
        renumberSteps();
        row.querySelector('.btn-remove-step').addEventListener('click', function() {
            if (stepsContainer.querySelectorAll('.step-row').length > 1) {
                row.remove();
                renumberSteps();
            }
        });
        row.querySelector('.btn-move-up').addEventListener('click', function() {
            const prev = row.previousElementSibling;
            if (prev) {
                stepsContainer.insertBefore(row, prev);
                renumberSteps();
            }
        });
        row.querySelector('.btn-move-down').addEventListener('click', function() {
            const next = row.nextElementSibling;
            if (next) {
                stepsContainer.insertBefore(next, row);
                renumberSteps();
            }
        });
    }

    if (addIngredientBtn) addIngredientBtn.addEventListener('click', addIngredient);
    if (addStepBtn) addStepBtn.addEventListener('click', addStep);

    // Start with one ingredient and one step
    addIngredient();
    addStep();
})();

// --- Edit form: submit → build recipe JSON ---
(function() {
    const form = document.getElementById('edit-recipe-form');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const nameEl = document.getElementById('edit-recipe-name');
        const imageEl = document.getElementById('edit-recipe-image-url');
        const descriptionEl = document.getElementById('edit-recipe-description');
        const ingredientsContainer = document.getElementById('create-ingredients');
        const stepsContainer = document.getElementById('create-steps');

        const ingredients = [];
        ingredientsContainer.querySelectorAll('.ingredient-row').forEach(function(row) {
            const nameInput = row.querySelector('.ingredient-name');
            const amountInput = row.querySelector('.ingredient-amount');
            ingredients.push({
                name: (nameInput && nameInput.value) ? nameInput.value.trim() : '',
                amount: (amountInput && amountInput.value) ? amountInput.value.trim() : ''
            });
        });

        const steps = [];
        stepsContainer.querySelectorAll('.step-row').forEach(function(row) {
            const textarea = row.querySelector('.step-content');
            steps.push((textarea && textarea.value) ? textarea.value.trim() : '');
        });

        const recipe = {
            name: (nameEl && nameEl.value) ? nameEl.value.trim() : '',
            image: (imageEl && imageEl.value) ? imageEl.value.trim() : '',
            description: (descriptionEl && descriptionEl.value) ? descriptionEl.value.trim() : '',
            ingredients: ingredients,
            steps: steps
        };

        const json = JSON.stringify(recipe, null, 2);
        console.log('Recipe JSON (for backend):', json);
        // Placeholder for future backend call, e.g.:
        // fetch('/api/recipes/', { method: 'POST', body: json, headers: { 'Content-Type': 'application/json' } });
    });
})();