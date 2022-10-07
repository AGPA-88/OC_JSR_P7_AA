/* Selecting the HTML elements with the id of recipes and search. */
const recipesNode = document.querySelector("#recipes");
const searchInput = document.querySelector("#search");
const ingredientsSelect = document.querySelector("#ingredients-select");
const devicesSelect = document.querySelector("#devices-select");
const ustensilsSelect = document.querySelector("#ustensils-select");
const closeIngredientButton = document.querySelector('#closeIngredient')
const closeDeviceButton = document.querySelector('#closeDevice')
const closeUstensilButton = document.querySelector('#closeUstensil')
const REMOVE_INGREDIENT_CLASSES = 'remove-filter remove-ingredient-filter';
const REMOVE_DEVICE_CLASSES = 'remove-filter remove-device-filter'
const REMOVE_USTENSIL_CLASSES = 'remove-filter remove-ustensil-filter'

const getSelectNode = (type) => {
    return document.querySelector(`#${type}s-select`)
};

const capitalize = s => s && s[0].toUpperCase() + s.slice(1);
const getCloseButton = (type) => {
    return document.querySelector(`#close${capitalize(type)}`)
}

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
                        itemContent = item.ingredient.toLowerCase()
                    if (!result.includes(itemContent) 
                    && 
                    itemContent.includes(document.querySelector(`#${type}s-search`).value.toLowerCase())) {
                        result.push(itemContent);
                    }
                });
                break

            case 'device':
                if (!result.includes(recipe.appliance.toLowerCase())
                &&
                recipe.appliance.toLowerCase().includes(document.querySelector("#devices-search").value.toLowerCase())) {
                    result.push(recipe.appliance.toLowerCase());
                }
                break

            case 'ustensil':
                recipe.ustensils.forEach((ustensil) => {
                    if (!result.includes(ustensil.toLowerCase())
                    &&
                    ustensil.toLowerCase().includes(document.querySelector("#ustensils-search").value.toLowerCase())) {
                        result.push(ustensil.toLowerCase());
                    }
                });
                break

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
        if (e) e.stopPropagation()
        getSelectNode('ingredient').classList.remove("open");
        document.querySelector("#openIngredient").style.display="inline";
        document.querySelector("#closeIngredient").style.display="none";
        document.querySelector("#labelIngredient").style.display="inline";
        document.querySelector("#ingredients-search").style.display="none";
        getSelectNode('ingredient').addEventListener(
            "click",
            filterIngredients
        );
    }
    const closeDeviceFilter = (e)=> {
        if (e) e.stopPropagation()
        getSelectNode('device').classList.remove("open");
        document.querySelector("#openDevice").style.display="inline";
        document.querySelector("#closeDevice").style.display="none";
        document.querySelector("#labelDevice").style.display="inline";
        document.querySelector("#devices-search").style.display="none";
        getSelectNode('device').addEventListener(
            "click",
            filterDevices
        );
    }
    const closeUstensilFilter = (e)=> {
        if (e) e.stopPropagation()
        getSelectNode('ustensil').classList.remove("open");
        document.querySelector("#openUstensil").style.display="inline";
        document.querySelector("#closeUstensil").style.display="none";
        document.querySelector("#labelUstensil").style.display="inline";
        document.querySelector("#ustensils-search").style.display="none";
        getSelectNode('ustensil').addEventListener(
            "click",
            filterUstensils
        );
    }

    // Filtering functions

    const filterByTags = (tagName, tagType) => {
        if (tagType === "ingredient") {
            closeDeviceFilter();
            closeUstensilFilter();
            
            const tagsOfRecipes = getInformation(recipes, tagType);
            document.querySelector(`#${tagType}s-list`).innerHTML = "";
            getSelectNode(tagType).classList.add("open");
            
            tagsOfRecipes.map((tag) => {    
                if (!filters[tagType + 's'].includes(tag)) document.querySelector(`#${tagType}s-list`).innerHTML += `<li><button class="select-${tagType}">${tag}</button></li>`;
            });
            
            document.querySelector(`#open${capitalize(tagType)}`).style.display="none";
            document.querySelector(`#close${capitalize(tagType)}`).style.display="inline";
            document.querySelector(`#label${capitalize(tagType)}`).style.display="none";
            document.querySelector(`#${tagType}s-search`).style.display="inline";
    
            
            document.querySelectorAll(`.select-${tagType}`)?.forEach(btn => btn.addEventListener('click', (e) => {
                e.preventDefault();
                
                console.log(e.target.innerText);
                filters[tagType + 's'] = [...filters[tagType + 's'], e.target.innerText];
                displayEnabledTags(filters);
                filterIngredientsAndRecipes(e);
                
            }));
            getSelectNode(tagType).removeEventListener(
                "click",
                filterIngredients
            );
        };

        if (tagType === "device") {
            closeIngredientFilter();
            closeUstensilFilter();
        
            const devices = getInformation(recipes, 'device');
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
        

        if (tagType === "ustensil") {
            closeIngredientFilter();
            closeDeviceFilter();
        
            const ustensils = getInformation(recipes, 'ustensil');
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
            console.log(filters);
            let filteredRecipes = [];
            
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

    getSelectNode('ingredient').addEventListener(
        "click",
        filterIngredients
    );

    getCloseButton('ingredient').addEventListener(
        "click",
        closeIngredientFilter
    )

    
    searchInput.addEventListener("keyup", filterRecipes);
    
    document.querySelector("#ingredients-search").addEventListener(
        "keyup",
        filterIngredients
        );
        
    getSelectNode('device').addEventListener(
        "click",
        filterDevices,
    );

    getCloseButton('device').addEventListener(
        "click",
        closeDeviceFilter
    )
    document.querySelector("#devices-search").addEventListener(
        "keyup",
        filterDevices
    );


    getSelectNode('ustensil').addEventListener(
        "click",
        filterUstensils,
    );

    getCloseButton('ustensil').addEventListener(
        "click",
        closeUstensilFilter
    )

    document.querySelector("#ustensils-search").addEventListener(
        "keyup",
        filterUstensils
    );

    // RENDERING 
    // TODO : INSERT HERE THE RENDER/DISPLAY FUNCTIONS CALL
    
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
            console.log(e.target.parentNode.className)
            let filtersToCheck = []
            switch(e.target.parentNode.className){
                case REMOVE_INGREDIENT_CLASSES:
                    filtersToCheck = 'ingredients'
                    break;
                case REMOVE_DEVICE_CLASSES:
                    filtersToCheck = 'devices'
                    break;                    
                case REMOVE_USTENSIL_CLASSES:
                    filtersToCheck = 'ustensils'
                    break;                    
                default: 
                    filtersToCheck = ''
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

