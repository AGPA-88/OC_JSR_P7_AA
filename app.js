/* Selecting the HTML elements with the id of recipes and search. */
const recipesNode = document.querySelector("#recipes");
const searchInput = document.querySelector("#search");
const ingredientsSelect = document.querySelector("#ingredients-select");
const devicesSelect = document.querySelector("#devices-select");
const ustensilsSelect = document.querySelector("#ustensils-select");


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

    };

    // RENDER INGREDIENTS TAGS
    const displayEnabledIngredients = (filters) => {


        filters.ingredients.map((ing) => selectedFilters.innerHTML+=`<div class="ingredient">${ing} <div class="remove-ingredient-filter" data-value="${ing}">x</div></div>`);

        document.querySelectorAll('.remove-ingredient-filter')?.forEach(elm => {
            console.log(elm);
            elm.addEventListener('click', e => {
                e.preventDefault();
    
                const newIngFilter = filters.ingredients.filter(ing => {
                    console.log({ing, value: e.target.dataset.value});
                    return ing !== e.target.dataset.value;
                });
    
                filters.ingredients = newIngFilter;
                displayEnabledTags(filters);
                filterRecipes(e);
    
    
                console.dir(e.target);
            });
        });
    };

    // RENDER DEVICES TAGS
    const displayEnabledDevices = (filters) => {

        filters.devices.map((dev) => selectedFilters.innerHTML+=`<div class="devices">${dev} <div class="remove-device-filter" data-value="${dev}">x</div></div>`);

        document.querySelectorAll('.remove-device-filter')?.forEach(elm => {
            elm.addEventListener('click', e => {
                e.preventDefault();
    
                const newDevFilter = filters.devices.filter(dev => {
                    console.log({dev, value: e.target.dataset.value});
                    return dev !== e.target.dataset.value;
                });
    
                filters.devices = newDevFilter;
                console.log(filters);
                displayEnabledTags(filters);
                filterRecipes(e);
    
    
                console.dir(e.target);
            });
        });
    };


    // RENDER UTENSILS TAGS
    const displayEnabledUstensils = (filters) => {

        filters.ustensils.map((ust) => selectedFilters.innerHTML+=`<div class="ustensil">${ust} <div class="remove-ustensil-filter" data-value="${ust}">x</div></div>`);

        document.querySelectorAll('.remove-ustensil-filter')?.forEach(elm => {
            elm.addEventListener('click', e => {
                e.preventDefault();
    
                const newUstFilter = filters.ustensils.filter(ust => {
                    console.log({ust, value: e.target.dataset.value});
                    return ust !== e.target.dataset.value;
                });
    
                filters.ustensils = newUstFilter;
                displayEnabledTags(filters);
                filterRecipes(e);
    
    
                console.dir(e.target);
            });
        });
    };

    // Filtering functions
    // TODO : INSERT AFTER THE FILTER FUNCTIONS DECLARATION

    const filterIngredientsAndRecipes = (e) => {
        filterIngredients(e);
        filterRecipes(e);
    };

    const filterDevicesAndRecipes = (e) => {
        console.log('tata');
        filterDevices(e);
        filterRecipes(e);
        console.log('toto');
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
        const input = document.querySelector("#search-box").value.toLocaleLowerCase();
    
        if (input.length > 2){
            console.log(filters);
            recipes = recipes.filter((recipe) => {
                return JSON.stringify(recipe).toLocaleLowerCase().includes(input);
            });
      
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
    
        const ingredients = getIngredients(recipes);
        document.querySelector("#ingredients-list").innerHTML = "";
        document.querySelector("#ingredients-select").classList.add("open");
    
        ingredients.map((i) => {
            document.querySelector("#ingredients-list").innerHTML += `<li><button class="select-ingredient">${i}</button></li>`;
        });
    
        document.querySelectorAll('.select-ingredient')?.forEach(btn => btn.addEventListener('click', (e) => {
            e.preventDefault();
    
            console.log(e.target.innerText);
            filters.ingredients = [...filters.ingredients, e.target.innerText];
            displayEnabledTags(filters);
            // document.querySelector("#ingredients-select").classList.remove("open");
            filterIngredientsAndRecipes(e);
        
        }));
    };
        
    
    // FILTER DEVICES
    const filterDevices = (e) => {
        console.log({ e });
    
        const devices = getDevices(recipes);
        document.querySelector("#devices-list").innerHTML = "";
        document.querySelector("#devices-select").classList.add("open");
    
        devices.map((device) => {
            document.querySelector("#devices-list").innerHTML += `<li><button class="select-devices">${device}</button></li>`;
        });

        document.querySelectorAll('.select-devices')?.forEach(btn => btn.addEventListener('click', (e) => {
            e.preventDefault();
    
            console.log(e.target.innerText);
            filters.devices = [...filters.devices, e.target.innerText];
            displayEnabledTags(filters);
            // document.querySelector("#ingredients-select").classList.remove("open");
            filterDevicesAndRecipes(e);
        
        }));
    };
    
    
    // FILTER UTENSILS
    const filterUstensils = (e) => {
        console.log({ e });
    
        const ustensils = getUstensils(recipes);
        document.querySelector("#ustensils-list").innerHTML = "";
        document.querySelector("#ustensils-select").classList.add("open");
    
        ustensils.map((ustensil) => {
            document.querySelector("#ustensils-list").innerHTML += `<li><button class="select-ustensils">${ustensil}</button></li>`;
        });

        document.querySelectorAll('.select-ustensils')?.forEach(btn => btn.addEventListener('click', (e) => {
            e.preventDefault();
    
            console.log(e.target.innerText);
            filters.ustensils = [...filters.ustensils, e.target.innerText];
            displayEnabledTags(filters);
            // document.querySelector("#ingredients-select").classList.remove("open");
            filterUstensilsAndRecipes(e);
        
        }));
    };

    // Event adding
    //TODO : INSERT HERE THE ADDEVENTLISTENER 

    ingredientsSelect.addEventListener(
        "click",
        filterIngredients,
        { once: true }
    );

    devicesSelect.addEventListener(
        "click",
        filterDevices,
        { once: true }
    );

    searchInput.addEventListener("keyup", filterRecipes);

    document.querySelector("#ingredients-search").addEventListener(
        "keyup",
        filterIngredients
    );

    document.querySelector("#devices-search").addEventListener(
        "keyup",
        filterDevices
    );


    ustensilsSelect.addEventListener(
        "click",
        filterUstensils,
        { once: true }
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
