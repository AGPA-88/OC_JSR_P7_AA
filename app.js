/* Selecting the HTML elements that we will be using in our JavaScript. */
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
/**
 * It fetches the data.json file and returns the data in JSON format
 * @returns An array of objects.
 */
const getRecipes = async () => {
    let res = await fetch("/data.json");
    return await res.json();
};


// GET INGREDIENTS
/**
 * It takes an array of recipes, loops through each recipe, loops through each ingredient in each
 * recipe, and pushes the ingredient to an array if it doesn't already exist in the array and if it
 * matches the search query.
 * @param recipes - an array of objects, each object is a recipe
 * @returns An array of ingredients.
 */
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
/**
 * It takes an array of objects, and returns an array of strings.
 * @param recipes - an array of objects
 * @returns An array of devices.
 */
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
/**
 * It takes an array of recipes and returns an array of ustensils.
 * @param recipes - an array of objects, each object is a recipe
 * @returns An array of ustensils.
 */
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
    /*  Creating a variable called data and assigning it the value of the getRecipes function. */
    const data = await getRecipes();
    let recipes = data;
    let filters = {
        ingredients: [],
        devices: [],
        ustensils: []
    };

    //HTML Elements
    /* The above code is selecting the element with the id of selected-filters. */
    const selectedFilters = document.querySelector('#selected-filters');

    // Rendering functions
    // RENDER RECIPES
    const renderRecipes = (data) => {
        recipesNode.innerHTML = "";

        /* Creating a string of HTML that will be used to display the ingredients for each recipe. */
        data.map((recipe) => {
            let ingredientsHtml = "";
            recipe.ingredients.forEach((ingredient) => {
                ingredientsHtml += `<p class="card-text">${ingredient.ingredient} ${
                    ingredient.quantity ? ": " + ingredient.quantity : ""
                }</p>`;
            });

            /* Checking if the description is longer than 200 characters. If it is, it will cut it off at 200
            characters and add (...) to the end. If it is not, it will just display the description. */
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

    /**
 * It displays the enabled tags (ingredients, devices, ustensils) in the selectedFilters div */
    const displayEnabledTags = (filters) => {
        selectedFilters.innerHTML="";
        displayEnabledIngredients(filters);
        displayEnabledDevices(filters);
        displayEnabledUstensils(filters);
        addRemoveActionOnCloseButtons(filters, displayEnabledTags, filterRecipes);

    };

    /**
     * The function takes in an object called filters, and then maps over the ingredients array in the
     * filters object, and then adds a div to the selectedFilters div with the ingredient name and a remove
     * button. */
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
    /**
 * It removes the class "open" from the ingredientsSelect element, and then it adds an event listener
 * to the ingredientsSelect element that calls the filterIngredients function.
 * @param e - the event object
 */
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
    /**
 * When the user types in the search box, filter the ingredients and recipes. */
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
    /**
 * If the key pressed is the enter key, then prevent the default action and stop the event from
 * propagating. */
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

        /* Selecting the input box and getting the value of the input box. */
        const input = document.querySelector("#search-box").value.toLocaleLowerCase();
    
        /* Searching for the input in the recipes array. */
        if (input.length > 2){      
            recipes = mainSearch(recipes, input);
      
        }else{
            recipes = data;
        }


        /* Filtering the recipes based on the filters selected by the user. */
        // INGREDIENTS
        if (filters.ingredients.length > 0) {
            let filteredRecipes = recipes;
            filters.ingredients.forEach(ingredient => {
                filteredRecipes = [...filteredRecipes.filter(recipe => JSON.stringify(recipe.ingredients).toLocaleLowerCase().includes(ingredient))];
            });
            recipes = filteredRecipes;
        }

        // DEVICES
        if (filters.devices.length > 0) {
            let filteredRecipes = recipes;
            filters.devices.forEach(device => {
                filteredRecipes = [...filteredRecipes.filter(recipe => JSON.stringify(recipe.appliance).toLocaleLowerCase().includes(device))];
            });
            recipes = filteredRecipes;
        }

        // USTENSILS
        if (filters.ustensils.length > 0) {
            let filteredRecipes = recipes;
            filters.ustensils.forEach(ustensil => {
                filteredRecipes = [...filteredRecipes.filter(recipe => JSON.stringify(recipe.ustensils).toLocaleLowerCase().includes(ustensil))];
            });
            recipes = filteredRecipes;
        }
        renderRecipes(recipes);
    
        if (recipes.length === 0) recipesNode.innerHTML = 'No recipe matches your criteria... <br> You can search for "apple pie", "fish", etc...'; 
              
    };
        
     
    // FILTER INGREDIENTES
    const filterIngredients = () => {
        closeDeviceFilter();
        closeUstensilFilter();
        
        const ingredients = getIngredients(recipes);
        document.querySelector("#ingredients-list").innerHTML = "";
        ingredientsSelect.classList.add("open");
        
        /* Creating a list of ingredients that are not in the filters.ingredients array. */
        ingredients.map((ingredient) => {    
            if (!filters.ingredients.includes(ingredient)) document.querySelector("#ingredients-list").innerHTML += `<li><button class="select-ingredient">${ingredient}</button></li>`;
        });
        
        document.querySelector("#openIngredient").style.display="none";
        document.querySelector("#closeIngredient").style.display="inline";
        document.querySelector("#labelIngredient").style.display="none";
        document.querySelector("#ingredients-search").style.display="inline";

        
        /* Adding an event listener to each button with the class 'select-ingredient'. When the button is
        clicked, the event listener will prevent the default action of the button, add the text of the
        button to the filters.ingredients array, display the enabled tags, and filter the ingredients and
        recipes. */
        document.querySelectorAll('.select-ingredient')?.forEach(btn => btn.addEventListener('click', (e) => {
            e.preventDefault();

            filters.ingredients.push(e.target.innerText);
            displayEnabledTags(filters);
            filterIngredientsAndRecipes(e);
            
        }));
        ingredientsSelect.removeEventListener(
            "click",
            filterIngredients
        );
    };
        
    
    // FILTER DEVICES
    const filterDevices = () => {
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
    
            filters.devices.push(e.target.innerText);
            displayEnabledTags(filters);
            filterDevicesAndRecipes(e);
        }));
    };
    
    
    // FILTER UTENSILS
    const filterUstensils = () => {
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
    
            filters.ustensils.push(e.target.innerText);
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
    
    displayEnabledTags(filters);

    renderRecipes(recipes);

})();

// REMOVE TAGS FUNCTION
function addRemoveActionOnCloseButtons(filters, displayEnabledTags, filterRecipes) {
    document.querySelectorAll('.remove-filter')?.forEach(elm => {
        elm.addEventListener('click', e => {
            e.preventDefault();
            const filterToClose = e.target.parentNode.getAttribute("data-value");
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
                return ing !== filterToClose;
            });

            filters[filtersToCheck] = newFilter; // filters.ingredients === filters['ingredients']
            displayEnabledTags(filters);
            filterRecipes(e);
        });
    });
}


/**
 * It takes an array of objects and a string, and returns an array of objects that contain the string
 * @param recipes - an array of objects
 * @param input - The search input
 * @returns An array of objects.
 */
function mainSearch(recipes, input) {
    let result = [];
    for (let i = 0; i < recipes.length; i++) {
        if (JSON.stringify(recipes[i]).toLocaleLowerCase().includes(input)) result[result.length] = recipes[i];
    }
    recipes = result;
    return recipes;
}

