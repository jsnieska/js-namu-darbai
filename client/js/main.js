import FormComponent from "./components/form-component.js";
import todoValidator from "./helpers/validators/todo-validator.js";
import ApiService from "./helpers/api-service.js";

// Surandame elementę, į kurį dėsime listItem'us
const travelList = document.querySelector('.js-country-list'); // <div class="js-country-list todo-list"></div>

// Funkcija, kuri priimą objektą, ir pagal priimtą objektą, sukurią naują listItem'ą į įdeda jį
// į "travelList" kintamajį
const displayCountry = ({
  completed,
  title,
  id,
}) => {
  const listItem = document.createElement('div'); // <div></div>
  listItem.className = 'list_item'; // <div class="list_item"></div>

  const checkbox = document.createElement('div');  // <div></div>
  checkbox.className = 'checkbox';  // <div class="checkbox"></div>
  if (completed) checkbox.classList.add('checked'); // <div class="checkbox checked"></div>
  checkbox.addEventListener('click', async () => {
    await ApiService.updateTodo({
      id,
      completed: !checkbox.classList.contains('checked')
    });

    checkbox.classList.toggle('checked');
  });

  const listItemText = document.createElement('div'); // <div></div>
  listItemText.className = 'list_item__text'; // <div class="list_item__text"></div>
  listItemText.innerText = title; // <div class="list_item__text">{{ title }}</div>

  const btnDelete = document.createElement('button'); // <button></button>
  btnDelete.className = 'button'; // <button class="button"</button>
  btnDelete.innerHTML = '<i class="bi bi-trash3"></i>'; // <button class="button">✖</button>
  btnDelete.addEventListener('click', async () => {
    await ApiService.deleteTodo(id);
    if(confirm("Are you sure you want to delete this?")){
      listItem.remove();
    }
  });

  listItem.append(  // <div class="list_item">
    checkbox,       //   <div class="checkbox checked"></div>
    listItemText,   //   <div class="list_item__text">{{ text }}</div>
    btnDelete       //   <button class="button">✖</button>
  );                // </div>

  /*
   <div class="js-country-list todo-list">
      {listItem}  <- afterBegin
      ...
   </div>
  */
  travelList.insertAdjacentElement('afterBegin', listItem);
}

// Kuriame Formos komponentą, kuris konstravimo metu paruošia validavimo procesą
const formAddTodo = new FormComponent(
  '.js-country-list-input ', /* selector */
  todoValidator, /* formatErrors */
  // OnSuccess handler
  async ({ title }) => {
    const createdTodo = await ApiService.createTodo({ title });
    displayCountry(createdTodo);
  }
);

// Pradinių duomenų parsiuntimas
const todos = await ApiService.fetchTodos();
todos.forEach(displayCountry);

/* 
  Data-based-rendering
    * Atvaizdavimui skirti duomenys saugomi bendrai pasiekiamoje vietoje
    * 1 funkcija skirta atvaizdavimui, kuri kviečiama kiekvieną kartą kai keičiasi duomenys
    * Visų EventLister'ių funkcijos keičia duomenis
*/
