const APP_NAME = 'planr';
const DEFAULT_OWNER =  'Suban';
const DEFAULT_STATUS = 'Not Groomed';

let store;
let selectedItem;


const statusMap = {
    "In Progress" : "in-progress",
    "Completed" : "completed",
    "Blocked" : "blocked",
    "Not Groomed" : "not-groomed",
    "Not Started" : "not-started"
};

const updateStore = (work_item_id,work_item_column,work_item_column_value) => {
    for(let work_item_index = 0;work_item_index < store.sprints[store.currentSprint].length;work_item_index++){
        if(store.sprints[store.currentSprint][work_item_index]['wp-id'] === work_item_id){
            store.sprints[store.currentSprint][work_item_index][work_item_column] = work_item_column_value;
            break;
        }
    }
}

const handleStatusClick = (e) => {
    selectedItem = e.currentTarget.parentElement;
    document.querySelector('#status_modal').showModal();

}

const handleOwnerClick = (e) => {
    selectedItem = e.currentTarget.parentElement;
    document.querySelector('#owner_modal').showModal();

}

const handleOwnerChange = (status_ele) => {
    let new_owner = status_ele.currentTarget.children[0].textContent.trim();
    selectedItem.querySelector('div.wp-owner').children[0].textContent = new_owner;
    updateStore(selectedItem.id, 'wp-owner', new_owner);
    updateLocalStorage();
    document.querySelector('#owner_modal').close();
}

const handleStatusValueChange = (work_item,work_item_status) => {
    work_item.querySelector('div.wp-status').children[0].textContent = work_item_status;
    work_item.querySelector('div.wp-status').classList.value = 
        work_item.querySelector('div.wp-status').classList[0]
        +' '+
        work_item.querySelector('div.wp-status').classList[1]
        +' '+
        work_item.querySelector('div.wp-status').classList[2];

    work_item.querySelector('div.wp-status').classList.add(statusMap[work_item_status]);
}

const handleStatusChange = (status_ele) => {
    let new_status = status_ele.currentTarget.children[0].textContent.trim();
    handleStatusValueChange(selectedItem,new_status);
    updateStore(selectedItem.id, 'wp-status', new_status);
    updateLocalStorage();
    document.querySelector('#status_modal').close();
}

const onValueChange = (e) => {

    if(!e.target.textContent) return;

    let work_item_id = e.target.parentElement.parentElement.id;
    let work_item_column = e.target.dataset.column;
    let work_item_column_value = e.target.textContent;
    updateStore(work_item_id, work_item_column, work_item_column_value);
    if(work_item_column === 'wp-point'){
        document.querySelector('ul.wp-aggregator li  div.wp-total-point span').textContent = store.sprints[store.currentSprint].reduce(function(a,b){return a+Number(b['wp-point'])},0);
    }
    updateLocalStorage();
}

const updateLocalStorage = () => {
    window.localStorage.setItem(APP_NAME,JSON.stringify(store));
}

const openNewItemModal = () => {
    document.querySelector('#new_item_modal').showModal();
}

const loadApp = () => {

    if(!window.localStorage.getItem(APP_NAME)) window.localStorage.setItem(APP_NAME,'[]');

    store = JSON.parse(window.localStorage.getItem(APP_NAME));
    document.querySelector('.sprint').textContent = store.currentSprint;
    let currentSprintItems = store.sprints[store.currentSprint];
    if(currentSprintItems && currentSprintItems.length){
        currentSprintItems.forEach(item => {
            let work_item = WORK_ITEM.content.cloneNode(true);
            work_item.querySelector('li').id = item['wp-id'];
            for(let item_key in item){
                let contentSelector = '.'+item_key+' > span';
                work_item.querySelector(contentSelector).textContent = item[item_key];
                if(item_key.indexOf('status') > -1){
                    work_item.querySelector('.'+item_key).classList.add(statusMap[item[item_key]]);   
                }
            }
            document.querySelector('ul.wp-container').appendChild(work_item);
        });
        
        document.querySelector('ul.wp-aggregator li  div.wp-total-point span').textContent = currentSprintItems.reduce(function(a,b){return a+Number(b['wp-point'])},0);
    }
    
    if(store.statuses){
        const status_modal_container = document.querySelector('#status_modal > .modal');
        store.statuses.forEach(status => {
            let status_item = STATUS_MODAL_ITEM.content.cloneNode(true);
            status_item.querySelector('div').classList.add(statusMap[status]);
            status_item.querySelector('span').textContent = status;
            status_modal_container.appendChild(status_item);
        });
    }
    
    if(store.developers){
        const owner_modal_container = document.querySelector('#owner_modal > .modal');
        store.developers.forEach(owner => {
            let owner_item = OWNER_MODAL_ITEM.content.cloneNode(true);
            owner_item.querySelector('span').textContent = owner;
            owner_modal_container.appendChild(owner_item);
        });
    
    }
    
}