/* Selecting the HTML elements with the id of recipes and search. */
const recipesNode = document.querySelector("#recipes");
const searchInput = document.querySelector("#search");
const ingredientsSelect = document.querySelector("#ingredients-select");
const devicesSelect = document.querySelector("#devices-select");
const ustensilsSelect = document.querySelector("#ustensils-select");

const getRecipes = async () => {
    let res = await fetch("/data.json");
    return await res.json();
};

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
    const data = await getRecipes();
    let recipes = data;

    // INGREDIENTES
    const filterIngredients = (e) => {
        console.log({ e });

        const ingredients = getIngredients(recipes);
        document.querySelector("#ingredients-list").innerHTML = "";
        document.querySelector("#ingredients-select").classList.add("open");

        ingredients.map((i) => {
            document.querySelector("#ingredients-list").innerHTML += `<li><button>${i}</button></li>`;
        });
    };
    
    ingredientsSelect.addEventListener(
        "click",
        filterIngredients,
        { once: true }
    );
    document.querySelector("#ingredients-search").addEventListener(
        "keyup",
        filterIngredients
    );


    // DEVICES
    const filterDevices = (e) => {
        console.log({ e });

        const devices = getDevices(recipes);
        document.querySelector("#devices-list").innerHTML = "";
        document.querySelector("#devices-select").classList.add("open");

        devices.map((i) => {
            document.querySelector("#devices-list").innerHTML += `<li><button>${i}</button></li>`;
        });
    };

    devicesSelect.addEventListener(
        "click",
        filterDevices,
        { once: true }
    );

    document.querySelector("#devices-search").addEventListener(
        "keyup",
        filterDevices
    );

    // UTENSILS
    const filterUstensils = (e) => {
        console.log({ e });

        const ustensils = getUstensils(recipes);
        document.querySelector("#ustensils-list").innerHTML = "";
        document.querySelector("#ustensils-select").classList.add("open");

        ustensils.map((i) => {
            document.querySelector("#ustensils-list").innerHTML += `<li><button>${i}</button></li>`;
        });
    };
    ustensilsSelect.addEventListener(
        "click",
        filterUstensils,
        { once: true }
    );

    document.querySelector("#ustensils-search").addEventListener(
        "keyup",
        filterUstensils
    );

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

    renderRecipes(recipes);

    searchInput.addEventListener("keyup", (e) => {
        if (e.keyCode === 13) {e.preventDefault();
            e.stopPropagation();
        }
        const input = e.target.value.toLocaleLowerCase();
        console.log(input.length);

        if (input.length > 2){
            recipes = recipes.filter((recipe) => {
                console.log({ name: recipe.name, input });
                return JSON.stringify(recipe).toLocaleLowerCase().includes(input);
            });
  
        }else{
            recipes = data;
        }
        console.log({ recipes });
        renderRecipes(recipes);
          
    });
})();
