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
      if (!ingredients.includes(ingredient.ingredient)) {
        ingredients.push(ingredient.ingredient);
      }
    });
  });

  return ingredients;
};

const getDevices = (recipes) => {
  let devices = [];
  devices.push(recipes.appliance);

  return devices;
};

(async () => {
  const data = await getRecipes();
  let recipes = data;

  const ingredients = getIngredients(data);

  ingredientsSelect.addEventListener(
    "click",
    (e) => {
      console.log({ e });
      e.path[1].classList.add("open");

      ingredients.map((i) => {
        e.target.parentNode.childNodes[5].innerHTML += `<li><button>${i}</button></li>`;
      });
    },
    { once: true }
  );

  const devices = getDevices(data);

  devicesSelect.addEventListener(
    "click",
    (e) => {
      console.log({ e });
      e.path[1].classList.add("open");

      devices.map((i) => {
        e.target.parentNode.childNodes[6].innerHTML += `<li><button>${i}</button></li>`;
      });
      console.log(devices);
    },
    { once: true }
  );

  // let devices = [];
  // let ustensils = [];

  // console.log({ ingredients });
  // console.log({ ustensils });
  // console.log({ devices });
  // const devicesInput = document.querySelector("#devices");
  // const ustensilsInput = document.querySelector("#ustensils");

  // ingredients.map(
  //   (i) => (ingredientsInput.innerHTML += `<option value="${i}">${i}</option>`)
  // );
  // ustensils.map(
  //   (i) => (ustensilsInput.innerHTML += `<option value="${i}">${i}</option>`)
  // );
  // devices.map(
  //   (i) => (devicesInput.innerHTML += `<option value="${i}">${i}</option>`)
  // );

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

  searchInput.addEventListener("change", (e) => {
    const input = e.target.value.toLocaleLowerCase();

    data = recipes.filter((r) => {
      console.log({ name: r.name, input });
      return r.name.toLocaleLowerCase().includes(input);
    });

    console.log({ data });

    renderRecipes(data);
  });
})();
