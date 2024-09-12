class soldier{
    constructor(id, name, rank, position, platoon, status, time){
        this.id = id;
        this.name = name;
        this.rank = rank;
        this.position = position;
        this.platoon = platoon;
        this.status = status;
        this.time = time;
    }
    id;
    name;
    rank;
    position;
    platoon;
    status;
    time;
}

class service{
    soldiers = [];
    constructor(){
        this.soldiers = JSON.parse(localStorage.soldiers || '[]');
    }

    add(name, rank, position, platoon, status, time){
        let maxId = this.soldiers.length > 0 ? Math.max(...(this.soldiers.map(e => e.id))) : 0;
        this.soldiers.push(new soldier(maxId + 1, name, rank, position, platoon, status, time));
        this.save();
    }

    remove(id){
        this.soldiers = this.soldiers.filter(s => s.id !== id);
        this.save();
    }

    sort(){
        return this.soldiers.sort((a, b) => {
            let nameA = a.name.toUpperCase();
            let nameB = b.name.toUpperCase();
            return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
        });
    }
    sorted = false;
    sortReverse(){
        if (!this.sorted) {
            this.sorted = true;
            return this.sort().reverse();
        }
        this.sorted = false;
        return this.sort();
    }

    getById(id){
        return this.soldiers.find(s => s.id === id);
    }

    edit(id, newS){
        let sold = this.soldiers.find(s => s.id === id);
        sold.name = newS.name;
        sold.rank = newS.rank;
        sold.position = newS.position;
        sold.platoon = newS.platoon;
        sold.status = newS.status;
        sold.time = newS.time;
        this.save();
    }

    save(){
        localStorage.soldiers = JSON.stringify(this.soldiers);
    }
}

function HomePage(){
    document.body.innerHTML = '';
    const serv = new service();
    // header
    const formHeader = document.createElement('div');
    formHeader.classList.add('header');
    formHeader.textContent = 'BATTALION FORCE MANAGEMENT';
    // form
    const form = document.createElement('form');
    form.classList.add('form');

    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.name = 'name';
    nameInput.placeholder = 'Full Name';
    const rankInput = document.createElement('input');
    rankInput.type = 'text';
    rankInput.name = 'rank';
    rankInput.placeholder = 'Rank';
    const positionInput = document.createElement('input');
    positionInput.type = 'text';
    positionInput.name = 'position';
    positionInput.placeholder = 'Position';
    const platoonInput = document.createElement('input');
    platoonInput.type = 'text';
    platoonInput.name = 'platoon';
    platoonInput.placeholder = 'Platoon';
    const timeInput = document.createElement('input');
    timeInput.type = 'number';
    timeInput.name = 'time';
    timeInput.placeholder = 'Time';
    const statusInput = document.createElement('select', {class: 'select'});
    const options = [document.createElement('option'), document.createElement('option'), document.createElement('option')];
    options[0].textContent = 'Active'; options[0].value = 'Active';
    options[1].textContent = 'Inactive'; options[1].value = 'Inactive';
    options[2].textContent = 'Retired'; options[2].value = 'Retired';
    statusInput.append(...options);
    statusInput.name = 'status';
    
    const submitInput = document.createElement('input');
    submitInput.type = 'submit';
    submitInput.classList.add('submit');
    submitInput.value = 'Add Personnel';
    submitInput.addEventListener('click', (e) => {
        e.preventDefault();
        if (nameInput.value === '' || rankInput.value === '' || positionInput.value === '' || platoonInput.value === '' || statusInput.value === '' || timeInput.value === '') {
            alert('Please fill in all fields');
            return;
        }
        serv.add(nameInput.value, rankInput.value, positionInput.value, platoonInput.value, statusInput.value, timeInput.value);
        populateTable();
        form.querySelectorAll('input[type="text"], input[type="number"]').forEach(e => e.value = '');
    });
    form.append(nameInput, rankInput, positionInput, platoonInput, timeInput, statusInput, submitInput);

    const tableContainer = document.createElement('div');
    tableContainer.classList.add('table-container');
    const tableHeader = document.createElement('div');
    tableHeader.classList.add('header');
    tableHeader.textContent = 'FORCES OVERVIEW';
    const table = document.createElement('table');
    table.classList.add('table');
    tableContainer.appendChild(tableHeader);
    tableContainer.appendChild(table);
    
    
    // populate table
    const populateTable = (reverse = false) => {
        table.innerHTML = '';
        // headers for table
        const headers = ['Rank', 'Position', 'Platoon', 'Status', 'Time', 'Actions'];
        const headerRow = document.createElement('tr');
        const nameOrder = document.createElement('th');
        const order = document.createElement('button');
        order.textContent = 'Full Name';
        order.classList.add('order-button');
        order.addEventListener('click', () => populateTable(true));
        nameOrder.appendChild(order);
        headerRow.appendChild(nameOrder);
        headers.forEach(h => {
            const th = document.createElement('th');
            th.textContent = h;
            headerRow.appendChild(th);
        });
        table.appendChild(headerRow);


        // table rows
        let soldiers = reverse ? serv.sortReverse() : serv.sort();
        soldiers.forEach(s => {
            const row = document.createElement('tr');
            const name = document.createElement('td');
            name.textContent = s.name;
            const rank = document.createElement('td');
            rank.textContent = s.rank;
            const position = document.createElement('td');
            position.textContent = s.position;
            const platoon = document.createElement('td');
            platoon.textContent = s.platoon;
            const status = document.createElement('td');
            status.textContent = s.status;
            const time = document.createElement('td');
            time.textContent = s.time;
            const buttons = document.createElement('td');
            buttons.classList.add('buttons');
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Remove';
            deleteButton.addEventListener('click', () => {
                serv.remove(s.id);
                populateTable();
            });
            buttons.appendChild(deleteButton);
            if (s.status !== 'Retired') {
                const missionButton = document.createElement('button');
                missionButton.textContent = 'Mission';
                missionButton.addEventListener('click', () => {
                    let interval = setInterval(() => {
                        if (s.time > 0){
                            missionButton.textContent = s.time;
                            s.time--;
                        } else {
                            missionButton.textContent = 'Mission Complete';
                            clearInterval(interval);
                        }
                    }, 1000);
                });
                buttons.appendChild(missionButton)
            }
            
            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.addEventListener('click', () => {
                EditPage(serv.getById(s.id));
            })
            buttons.appendChild(editButton);
            row.append(name, rank, position, platoon, status, time, buttons);
            table.appendChild(row);
        })
    }
    populateTable();


    document.body.appendChild(formHeader);
    document.body.appendChild(form);
    document.body.appendChild(tableContainer);
}

function EditPage(sold){
    document.body.innerHTML = '';
    const serv = new service();
    // header
    const formHeader = document.createElement('div');
    formHeader.classList.add('header');
    formHeader.textContent = 'EDIT PERSONNEL';

    // form
    const form = document.createElement('form');
    form.classList.add('form');

    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.name = 'name';
    nameInput.value = sold.name;
    nameInput.placeholder = 'Full Name';
    const rankInput = document.createElement('input');
    rankInput.type = 'text';
    rankInput.name = 'rank';
    rankInput.value = sold.rank;
    rankInput.placeholder = 'Rank';
    const positionInput = document.createElement('input');
    positionInput.type = 'text';
    positionInput.name = 'position';
    positionInput.value = sold.position;
    positionInput.placeholder = 'Position';
    const platoonInput = document.createElement('input');
    platoonInput.type = 'text';
    platoonInput.name = 'platoon';
    platoonInput.value = sold.platoon;
    platoonInput.placeholder = 'Platoon';
    const timeInput = document.createElement('input');
    timeInput.type = 'number';
    timeInput.name = 'time';
    timeInput.value = sold.time;
    timeInput.placeholder = 'Time';
    const statusInput = document.createElement('select', {class: 'select'});
    const options = [document.createElement('option'), document.createElement('option'), document.createElement('option')];
    options[0].textContent = 'Active'; options[0].value = 'Active';
    options[1].textContent = 'Inactive'; options[1].value = 'Inactive';
    options[2].textContent = 'Retired'; options[2].value = 'Retired';
    statusInput.append(...options);
    statusInput.name = 'status';
    statusInput.value = sold.status;
    
    const submitInput = document.createElement('input');
    submitInput.type = 'submit';
    submitInput.classList.add('submit');
    submitInput.value = 'Save Changes';
    submitInput.addEventListener('click', (e) => {
        e.preventDefault();
        if (nameInput.value === '' || rankInput.value === '' || positionInput.value === '' || platoonInput.value === '' || statusInput.value === '' || timeInput.value === '') {
            alert('Please fill in all fields');
            return;
        }
        serv.edit(sold.id, new soldier(0,nameInput.value, rankInput.value, positionInput.value, platoonInput.value, statusInput.value, timeInput.value || 0));
        document.body.innerHTML = '';
        HomePage();
    });
    const cancelInput = document.createElement('input');
    cancelInput.type = 'button';
    cancelInput.classList.add('cancel');
    cancelInput.value = 'Cancel';
    cancelInput.addEventListener('click', () => {
        document.body.innerHTML = '';
        HomePage();
    });
    form.append(cancelInput);
    form.append(nameInput, rankInput, positionInput, platoonInput, timeInput, statusInput, submitInput, cancelInput);

    document.body.appendChild(formHeader);
    document.body.appendChild(form);
}

function initializeData(){
    if (!localStorage.soldiers){
        localStorage.soldiers = ` 
    [{"id":1,"name":"Daniel Robertson","rank":"Private First Class","position":"Medic","platoon":"1st Platoon","status":"Active","time":"16"},{"id":2,"name":"Jacob Turner","rank":"Staff Sergeant","position":"Platoon Sergeant","platoon":"2nd Platoon","status":"Retired","time":"10"},{"id":3,"name":"Marcus Lee","rank":"Specialist","position":"Radio Operator","platoon":"1st Platoon","status":"Inactive","time":"7"}]
    `;}
}

initializeData();
HomePage();



