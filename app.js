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

const getSelectNode = (type) => {
    return document.querySelector(`#${type}s-select`);
};

const capitalize = s => s && s[0].toUpperCase() + s.slice(1);
const getCloseButton = (type) => {
    return document.querySelector(`#close${capitalize(type)}`);
};

// GET RECIPES
const getRecipes = async () => {
    let res = await fetch("/data.json");
    return await res.json();
};


const getInformation = (recipes, type) => {
    let result = [];
    recipes.forEach((recipe) => {
        let itemContent = ""; 
        switch (type){
        case 'ingredient':
            recipe[type + 's'].forEach((item) => {
                itemContent = item.ingredient.toLowerCase();
                if (!result.includes(itemContent) 
                    && 
                    itemContent.includes(document.querySelector(`#${type}s-search`).value.toLowerCase())) {
                    result.push(itemContent);
                }
            });
            break;

        case 'device':
            if (!result.includes(recipe.appliance.toLowerCase())
                &&
                recipe.appliance.toLowerCase().includes(document.querySelector("#devices-search").value.toLowerCase())) {
                result.push(recipe.appliance.toLowerCase());
            }
            break;

        case 'ustensil':
            recipe.ustensils.forEach((ustensil) => {
                if (!result.includes(ustensil.toLowerCase())
                    &&
                    ustensil.toLowerCase().includes(document.querySelector("#ustensils-search").value.toLowerCase())) {
                    result.push(ustensil.toLowerCase());
                }
            });
            break;

        }
    });

    return result;
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
        displayEnabledTagItems(filters, 'ingredient');
        displayEnabledTagItems(filters, 'device');
        displayEnabledTagItems(filters, 'ustensil');
        addRemoveActionOnCloseButtons(filters, displayEnabledTags, filterRecipes);
    };

    const displayEnabledTagItems =(filters, type) => {
        let itemClass = '';
        switch (type) {
        case 'ingredient':
            itemClass = REMOVE_INGREDIENT_CLASSES;
            break;
        case 'device':
            itemClass = REMOVE_DEVICE_CLASSES;
            break;
        case 'ustensil':
            itemClass = REMOVE_USTENSIL_CLASSES;
            break;
        }
        filters[type + 's'].map((item) => {
            selectedFilters.innerHTML+=`<div id="filter-${type}s-tags" class="tags ${type} ${type}-tag-color">${item} <div class="${itemClass}" data-value="${item}"> <i class="fa fa-times-circle-o" aria-hidden="true"></i> </div></div>`;
        });
    };

    //closing functions

    const closeTagFilter = (type) => {
        
        getSelectNode(type).classList.remove("open");
        document.querySelector(`#open${capitalize(type)}`).style.display="inline";
        document.querySelector(`#close${capitalize(type)}`).style.display="none";
        document.querySelector(`#label${capitalize(type)}`).style.display="inline";
        document.querySelector(`#${type}s-search`).style.display="none";
        let filterItem = () => {};
        switch (type) {
        case 'ingredient':
            filterItem = filterIngredients;
            break;
        case 'device':
            filterItem = filterDevices;
            break;
        case 'ustensil':
            filterItem = filterUstensils;
            break;
        } 
        getSelectNode('ingredient').addEventListener(
            "click",
            filterItem
        );
    };

    const closeIngredientFilter = (e)=> {
        if (e) e.stopPropagation();
        closeTagFilter('ingredient');
    };
    const closeDeviceFilter = (e)=> {
        if (e) e.stopPropagation();
        closeTagFilter('device');
    };
    const closeUstensilFilter = (e)=> {
        if (e) e.stopPropagation();
        closeTagFilter('ustensil');
    };

    // Filtering functions

    const filterByTags = (tagName, tagType) => {
        console.log(tagType);
        closeDeviceFilter();
        closeUstensilFilter();
        closeIngredientFilter();
        
        const tagsOfRecipes = getInformation(recipes, tagType);
        document.querySelector(`#${tagType}s-list`).innerHTML = "";
        getSelectNode(tagType).classList.add("open");

        tagsOfRecipes.map((tag) => {    
            if (!filters[tagType + 's'].includes(tag)) document.querySelector(`#${tagType}s-list`).innerHTML += `<li><button class="select-${tagType}s">${tag}</button></li>`;
        });

        document.querySelector(`#open${capitalize(tagType)}`).style.display="none";
        document.querySelector(`#close${capitalize(tagType)}`).style.display="inline";
        document.querySelector(`#label${capitalize(tagType)}`).style.display="none";
        document.querySelector(`#${tagType}s-search`).style.display="inline";

        let filterItem = () => {};
        switch (tagType) {
        case 'ingredient':
            filterItem = filterIngredients;
            break;
        case 'device':
            filterItem = filterDevices;
            break;
        case 'ustensil':
            filterItem = filterUstensils;
            break;
        } 

        document.querySelectorAll(`.select-${tagType}s`)?.forEach(btn => btn.addEventListener('click', (e) => {
            e.preventDefault();
            
            console.log(e.target.innerText);
            filters[tagType + 's'] = [...filters[tagType + 's'], e.target.innerText];
            displayEnabledTags(filters);

            if (tagType === "ingredient") {
                filterIngredientsAndRecipes(e);
            }
            if (tagType === "device") {    
                filterDevicesAndRecipes(e);
            }
            
            if (tagType === "ustensil") {            
                filterUstensilsAndRecipes(e);
            }
                
            getSelectNode(tagType).removeEventListener(
                "click",
                filterItem
            );
        }));



    };

    

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

        //close buttons
        closeIngredientFilter();
        closeDeviceFilter();
        closeUstensilFilter();

        const input = document.querySelector("#search-box").value.toLocaleLowerCase();
    
        if (input.length > 2){            
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
        filterByTags('','ingredient');
    };
        
    
    // FILTER DEVICES
    const filterDevices = (e) => {
        filterByTags('','device');
    };
    
    
    // FILTER UTENSILS
    const filterUstensils = (e) => {
        filterByTags('','ustensil');
    };

    // Event adding
    searchInput.addEventListener("keyup", filterRecipes);

    const tagTypes = [
        {name:'ingredient', filterMethod:filterIngredients, closeMethod:closeIngredientFilter},
        {name:'device', filterMethod:filterDevices, closeMethod:closeDeviceFilter},
        {name:'ustensil', filterMethod:filterUstensils, closeMethod:closeUstensilFilter}
    ];

    tagTypes.forEach(type => {
        getSelectNode(type.name).addEventListener(
            "click",
            type.filterMethod
        );
        getCloseButton(type.name).addEventListener(
            "click",
            type.closeMethod
        );
        document.querySelector(`#${type.name}s-search`).addEventListener(
            "keyup",
            type.filterMethod
        );
    }); 

    // RENDERING 
    
    displayEnabledTags(filters);

    renderRecipes(recipes);

})();

function mainSearch(recipes, input) {
    recipes = recipes.filter((recipe) => {
        const recipeContent = JSON.stringify(recipe).toLocaleLowerCase();
        return recipeContent.includes(input);
    });
    return recipes;
}

// REMOVE TAGS FUNCTION
function addRemoveActionOnCloseButtons(filters, displayEnabledTags, filterRecipes) {
    document.querySelectorAll('.remove-filter')?.forEach(elm => {
        console.log(elm);
        elm.addEventListener('click', e => {
            e.preventDefault();
            const filterToClose = e.target.parentNode.getAttribute("data-value");
            console.log(e.target.parentNode.className);
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
            displayEnabledTags(filters);
            filterRecipes(e);

            console.dir(e.target);
        });
    });
}

