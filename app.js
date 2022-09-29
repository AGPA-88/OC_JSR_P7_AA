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



    // Filtering functions
    // TODO : INSERT AFTER THE FILTER FUNCTIONS DECLARATION


    // FILTER RECIPES
    const filterRecipes = (e) => {
        if (e.keyCode === 13) {e.preventDefault();
            e.stopPropagation();
        }
        const input = document.querySelector("#search-box").value.toLocaleLowerCase();
    
        if (input.length > 2){
            console.log(filters);
            recipes = mainSearch(recipes, input);
      
        }else{
            recipes = data;
        }


        console.log({ recipes });
        renderRecipes(recipes);
    
        if (recipes.length === 0) recipesNode.innerHTML = 'No recipe matches your criteria... <br> You can search for "apple pie", "fish", etc...'; 
              
    };
        
     
    // FILTER INGREDIENTES
    const filterIngredients = (e) => {
        console.log({ e });
    
        document.querySelector("#ingredients-list").innerHTML = "";
        document.querySelector("#ingredients-select").classList.add("open");

        document.querySelector(".fa-angle-down").style.display="none";
        document.querySelector(".fa-angle-up").style.display="inline";
        
        document.querySelectorAll('.select-ingredient')?.forEach(btn => btn.addEventListener('click', (e) => {
            e.preventDefault();
    
            console.log(e.target.innerText);
            filters.ingredients = [...filters.ingredients, e.target.innerText];
            filterIngredientsAndRecipes(e);
        
        }));
    };
        
    
    // FILTER DEVICES
    const filterDevices = (e) => {
        console.log({ e });
    
        document.querySelector("#devices-list").innerHTML = "";
        document.querySelector("#devices-select").classList.add("open");

        document.querySelector(".fa-angle-down").style.display="none";
        document.querySelector(".fa-angle-up").style.display="inline";

        document.querySelectorAll('.select-devices')?.forEach(btn => btn.addEventListener('click', (e) => {
            e.preventDefault();
    
            console.log(e.target.innerText);
            filters.devices = [...filters.devices, e.target.innerText];
            // document.querySelector("#ingredients-select").classList.remove("open");
            filterDevicesAndRecipes(e);
        
        }));
    };
    
    
    // FILTER UTENSILS
    const filterUstensils = (e) => {
        console.log({ e });
    
        document.querySelector("#ustensils-list").innerHTML = "";
        document.querySelector("#ustensils-select").classList.add("open");

        document.querySelector(".fa-angle-down").style.display="none";
        document.querySelector(".fa-angle-up").style.display="inline";
        
        document.querySelectorAll('.select-ustensils')?.forEach(btn => btn.addEventListener('click', (e) => {
            e.preventDefault();
    
            console.log(e.target.innerText);
            filters.ustensils = [...filters.ustensils, e.target.innerText];
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
    

    renderRecipes(recipes);

})();
function mainSearch(recipes, input) {
    recipes = recipes.filter((recipe) => {
        return JSON.stringify(recipe).toLocaleLowerCase().includes(input);
    });
    return recipes;
}

