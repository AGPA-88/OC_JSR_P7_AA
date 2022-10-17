/* Selecting the HTML elements with the id of recipes and search. */
const recipesNode = document.querySelector("#recipes");
const searchInput = document.querySelector("#search");
const ingredientsSelect = document.querySelector("#ingredients-select");
const devicesSelect = document.querySelector("#devices-select");
const ustensilsSelect = document.querySelector("#ustensils-select");
const closeIngredientButton = document.querySelector('#closeIngredient');
const closeDeviceButton = document.querySelector('#closeDevice');
const closeUstensilButton = document.querySelector('#closeUstensil');
const REMOVE_INGREDIENT_CLASSES = 'remove-filter remove-ingredient-filter';
const REMOVE_DEVICE_CLASSES = 'remove-filter remove-device-filter';
const REMOVE_USTENSIL_CLASSES = 'remove-filter remove-ustensil-filter';


// GET RECIPES
const getRecipes = async () => {
    let res = await fetch("/data.json");
    return await res.json();
};


// GET INGREDIENTS
const getIngredients = (recipes) => {
    let ingredients = [];
    recipes.forEach((recipe) => {
        recipe.ingredients.forEach((ingredient) => {
            if (!ingredients.includes(ingredient.ingredient.toLowerCase()) 
            && 
            ingredient.ingredient.toLowerCase().includes(document.querySelector("#ingredients-search").value.toLowerCase())) {
                ingredients.push(ingredient.ingredient.toLowerCase());
            }
        });
    });

    return ingredients;
};



// GET DEVICES
const getDevices = (recipes) => {
    let devices = [];
    recipes.forEach((recipes) => {
        if (!devices.includes(recipes.appliance.toLowerCase())
        &&
        recipes.appliance.toLowerCase().includes(document.querySelector("#devices-search").value.toLowerCase())) {
            devices.push(recipes.appliance.toLowerCase());
        }
    });

    return devices;
};

// GET UTENSILS
const getUstensils = (recipes) => {
    let ustensils = [];
    recipes.forEach((recipe) => {
        recipe.ustensils.forEach((ustensil) => {
            if (!ustensils.includes(ustensil.toLowerCase())
            &&
            ustensil.toLowerCase().includes(document.querySelector("#ustensils-search").value.toLowerCase())) {
                ustensils.push(ustensil.toLowerCase());
            }
        });
    });

    return ustensils;
};


(async () => {

    //Initialization
    const data = await getRecipes();
    let recipes = data;
    let filters = {
        ingredients: [],
        devices: [],
        ustensils: []
    };

    //HTML Elements
    const selectedFilters = document.querySelector('#selected-filters');

    // Rendering functions
    // RENDER RECIPES
    const renderRecipes = (data) => {
        recipesNode.innerHTML = "";

        data.map((recipe) => {
            let ingredientsHtml = "";
            recipe.ingredients.forEach((ingredient) => {
                ingredientsHtml += `<p class="card-text">${ingredient.ingredient} ${
                    ingredient.quantity ? ": " + ingredient.quantity : ""
                }</p>`;
            });

            let description = "";
            const sizeLimit = 200;
            if (recipe.description.length > sizeLimit) {
                description = recipe.description.substring(0, sizeLimit - 5) + "(...)";
            } else {
                description = recipe.description;
            }

            recipesNode.innerHTML += `
                    <div class="col-md-4 mb-3">
                        <div class="card">
                            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mM8vm/ffwAH2wNEx3f/kwAAAABJRU5ErkJggg==" class="card-img-top" alt="...">
                            <div class="card-body">
                                <div class="title_section">
                                    <div class="card-title">
                                    <h6>${recipe.name}</h6>
                                    </div>
                                    <br>
                                    <div class="time_container">
                                        <i class="fa fa-clock-o" aria-hidden="true"></i> 
                                        ${recipe.time} min
                                    </div>
                                </div>    
                                <div class="description_section">  
                                    <div>       
                                    ${ingredientsHtml}   
                                    </div>                                                                                     
                                    <p class="card-text">${description}</p>
                                </div>    
                            </div>
                          </div>
                    </div>
                `;
        });
    };

    const displayEnabledTags = (filters) => {
        selectedFilters.innerHTML="";
        displayEnabledIngredients(filters);
        displayEnabledDevices(filters);
        displayEnabledUstensils(filters);
        addRemoveActionOnCloseButtons(filters, displayEnabledTags, filterRecipes);

    };

    // RENDER INGREDIENTS TAGS
    const displayEnabledIngredients = (filters) => {


        filters.ingredients.map((ing) => selectedFilters.innerHTML+=`<div id="filter-ingredients-tags" class="tags ingredient ingredient-tag-color">${ing} <div class="${REMOVE_INGREDIENT_CLASSES}" data-value="${ing}"> <i class="fa fa-times-circle-o" aria-hidden="true"></i> </div></div>`);

        
    };

    // RENDER DEVICES TAGS
    const displayEnabledDevices = (filters) => {

        filters.devices.map((dev) => selectedFilters.innerHTML+=`<div id="filter-devices-tags" class="tags devices devices-tag-color">${dev} <div class="${REMOVE_DEVICE_CLASSES}" data-value="${dev}"> <i class="fa fa-times-circle-o" aria-hidden="true"></i> </div></div>`);
    };


    // RENDER UTENSILS TAGS
    const displayEnabledUstensils = (filters) => {

        filters.ustensils.map((ust) => selectedFilters.innerHTML+=`<div id="filter-ustensils-tags" class="tags ustensil ustensils-tag-color">${ust} <div class="${REMOVE_USTENSIL_CLASSES}" data-value="${ust}"> <i class="fa fa-times-circle-o" aria-hidden="true"></i> </div></div>`);
    };

    //closing functions

    const closeIngredientFilter = (e)=> {
        if (e) e.stopPropagation();
        ingredientsSelect.classList.remove("open");
        document.querySelector("#openIngredient").style.display="inline";
        document.querySelector("#closeIngredient").style.display="none";
        document.querySelector("#labelIngredient").style.display="inline";
        document.querySelector("#ingredients-search").style.display="none";
        ingredientsSelect.addEventListener(
            "click",
            filterIngredients
        );
    };
    const closeDeviceFilter = (e)=> {
        if (e) e.stopPropagation();
        devicesSelect.classList.remove("open");
        document.querySelector("#openDevice").style.display="inline";
        document.querySelector("#closeDevice").style.display="none";
        document.querySelector("#labelDevice").style.display="inline";
        document.querySelector("#devices-search").style.display="none";
        devicesSelect.addEventListener(
            "click",
            filterDevices
        );
    };
    const closeUstensilFilter = (e)=> {
        if (e) e.stopPropagation();
        ustensilsSelect.classList.remove("open");
        document.querySelector("#openUstensil").style.display="inline";
        document.querySelector("#closeUstensil").style.display="none";
        document.querySelector("#labelUstensil").style.display="inline";
        document.querySelector("#ustensils-search").style.display="none";
        ustensilsSelect.addEventListener(
            "click",
            filterUstensils
        );
    };

    // Filtering functions

    const filterIngredientsAndRecipes = (e) => {
        filterIngredients(e);
        filterRecipes(e);
    };

    const filterDevicesAndRecipes = (e) => {
        filterDevices(e);
        filterRecipes(e);
    };

    const filterUstensilsAndRecipes = (e) => {
        filterUstensils(e);
        filterRecipes(e);
    };

    // FILTER RECIPES
    const filterRecipes = (e) => {
        if (e.keyCode === 13) {e.preventDefault();
            e.stopPropagation();
        }
        
        //ReInit the recipes array
        recipes = data;

        //close buttons
        closeIngredientFilter();
        closeDeviceFilter();
        closeUstensilFilter();

        const input = document.querySelector("#search-box").value.toLocaleLowerCase();
    
        if (input.length > 2){
            console.log(filters);            
            recipes = mainSearch(recipes, input);
      
        }else{
            recipes = data;
        }

        // INGREDIENTS
        if (filters.ingredients.length > 0) {
            console.log("Ingrdient filtering");
            let filteredRecipes = recipes;
            filters.ingredients.forEach(ingredient => {
                filteredRecipes = [...filteredRecipes.filter(recipe => JSON.stringify(recipe.ingredients).toLocaleLowerCase().includes(ingredient))];
            });
            recipes = filteredRecipes;
        }

        // DEVICES
        if (filters.devices.length > 0) {
            console.log("Devices filtering");
            let filteredRecipes = recipes;
            filters.devices.forEach(device => {
                filteredRecipes = [...filteredRecipes.filter(recipe => JSON.stringify(recipe.appliance).toLocaleLowerCase().includes(device))];
            });
            recipes = filteredRecipes;
        }

        // USTENSILS
        if (filters.ustensils.length > 0) {
            console.log("Ustensils filtering");
            let filteredRecipes = recipes;
            filters.ustensils.forEach(ustensil => {
                filteredRecipes = [...filteredRecipes.filter(recipe => JSON.stringify(recipe.ustensils).toLocaleLowerCase().includes(ustensil))];
            });
            recipes = filteredRecipes;
        }
        console.log({ recipes });
        renderRecipes(recipes);
    
        if (recipes.length === 0) recipesNode.innerHTML = 'No recipe matches your criteria... <br> You can search for "apple pie", "fish", etc...'; 
              
    };
        
     
    // FILTER INGREDIENTES
    const filterIngredients = (e) => {
        console.log({ e });
        closeDeviceFilter();
        closeUstensilFilter();
        
        const ingredients = getIngredients(recipes);
        document.querySelector("#ingredients-list").innerHTML = "";
        ingredientsSelect.classList.add("open");
        
        ingredients.map((ingredient) => {    
            if (!filters.ingredients.includes(ingredient)) document.querySelector("#ingredients-list").innerHTML += `<li><button class="select-ingredient">${ingredient}</button></li>`;
        });
        
        document.querySelector("#openIngredient").style.display="none";
        document.querySelector("#closeIngredient").style.display="inline";
        document.querySelector("#labelIngredient").style.display="none";
        document.querySelector("#ingredients-search").style.display="inline";

        
        document.querySelectorAll('.select-ingredient')?.forEach(btn => btn.addEventListener('click', (e) => {
            e.preventDefault();
            
            console.log(e.target.innerText);
            filters.ingredients = [...filters.ingredients, e.target.innerText];
            displayEnabledTags(filters);
            filterIngredientsAndRecipes(e);
            
        }));
        ingredientsSelect.removeEventListener(
            "click",
            filterIngredients
        );
        console.log(ingredientsSelect);
    };
        
    
    // FILTER DEVICES
    const filterDevices = (e) => {
        console.log({ e });
        closeIngredientFilter();
        closeUstensilFilter();
    
        const devices = getDevices(recipes);
        document.querySelector("#devices-list").innerHTML = "";
        document.querySelector("#devices-select").classList.add("open");
        
        devices.map((device) => {
            if (!filters.devices.includes(device)) document.querySelector("#devices-list").innerHTML += `<li><button class="select-devices">${device}</button></li>`;
        });
        
        document.querySelector("#openDevice").style.display="none";
        document.querySelector("#closeDevice").style.display="inline";
        document.querySelector("#labelDevice").style.display="none";
        document.querySelector("#devices-search").style.display="inline";

        document.querySelectorAll('.select-devices')?.forEach(btn => btn.addEventListener('click', (e) => {
            e.preventDefault();
    
            console.log(e.target.innerText);
            filters.devices = [...filters.devices, e.target.innerText];
            displayEnabledTags(filters);
            filterDevicesAndRecipes(e);
        }));
    };
    
    
    // FILTER UTENSILS
    const filterUstensils = (e) => {
        console.log({ e });
        closeIngredientFilter();
        closeDeviceFilter();
    
        const ustensils = getUstensils(recipes);
        document.querySelector("#ustensils-list").innerHTML = "";
        document.querySelector("#ustensils-select").classList.add("open");
        
        ustensils.map((ustensil) => {
            if (!filters.ustensils.includes(ustensil)) document.querySelector("#ustensils-list").innerHTML += `<li><button class="select-ustensils">${ustensil}</button></li>`;
        });
        
        document.querySelector("#openUstensil").style.display="none";
        document.querySelector("#closeUstensil").style.display="inline";
        document.querySelector("#labelUstensil").style.display="none";
        document.querySelector("#ustensils-search").style.display="inline";
        
        document.querySelectorAll('.select-ustensils')?.forEach(btn => btn.addEventListener('click', (e) => {
            e.preventDefault();
    
            console.log(e.target.innerText);
            filters.ustensils = [...filters.ustensils, e.target.innerText];
            displayEnabledTags(filters);
            filterUstensilsAndRecipes(e);
        
        }));
    };

    // Event adding

    ingredientsSelect.addEventListener(
        "click",
        filterIngredients
    );

    closeIngredientButton.addEventListener(
        "click",
        closeIngredientFilter
    );

    
    searchInput.addEventListener("keyup", filterRecipes);
    
    document.querySelector("#ingredients-search").addEventListener(
        "keyup",
        filterIngredients
    );
        
    devicesSelect.addEventListener(
        "click",
        filterDevices,
    );

    closeDeviceButton.addEventListener(
        "click",
        closeDeviceFilter
    );
    document.querySelector("#devices-search").addEventListener(
        "keyup",
        filterDevices
    );


    ustensilsSelect.addEventListener(
        "click",
        filterUstensils,
    );

    closeUstensilButton.addEventListener(
        "click",
        closeUstensilFilter
    );

    document.querySelector("#ustensils-search").addEventListener(
        "keyup",
        filterUstensils
    );

    // RENDERING 
    // TODO : INSERT HERE THE RENDER/DISPLAY FUNCTIONS CALL
    
    displayEnabledTags(filters);

    renderRecipes(recipes);

})();

// REMOVE TAGS FUNCTION
function addRemoveActionOnCloseButtons(filters, displayEnabledTags, filterRecipes) {
    document.querySelectorAll('.remove-filter')?.forEach(elm => {
        console.log(elm);
        elm.addEventListener('click', e => {
            e.preventDefault();
            const filterToClose = e.target.parentNode.getAttribute("data-value");
            console.log(filterToClose);
            let filtersToCheck = [];
            switch(e.target.parentNode.className){
            case REMOVE_INGREDIENT_CLASSES:
                filtersToCheck = 'ingredients';
                break;
            case REMOVE_DEVICE_CLASSES:
                filtersToCheck = 'devices';
                break;                    
            case REMOVE_USTENSIL_CLASSES:
                filtersToCheck = 'ustensils';
                break;                    
            default: 
                filtersToCheck = '';
            }
            const newFilter = filters[filtersToCheck].filter(ing => {
                console.log(ing);
                return ing !== filterToClose;
            });

            filters[filtersToCheck] = newFilter; // filters.ingredients === filters['ingredients']
            console.log(filters);
            displayEnabledTags(filters);
            filterRecipes(e);

            console.dir(e.target);
        });
    });
}


function mainSearch(recipes, input) {
    let result = [];
    for (let i = 0; i < recipes.length; i++) {
        if (JSON.stringify(recipes[i]).toLocaleLowerCase().includes(input)) result[result.length] = recipes[i];
    }
    recipes = result;
    return recipes;
}

