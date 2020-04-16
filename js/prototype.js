//variables
const form = document.getElementById("form");
const html = new HTMLUI();


//event Listeners
eventListeners();

function eventListeners(){
    document.addEventListener('DOMContentLoaded', function(){
        //create option for years
        html.displayYears();
        
    });

    // on submission
    form.addEventListener('submit', function(e){
        e.preventDefault();

        const type = document.getElementById('type').value;
        const year = document.getElementById('years').value;
        const level = document.querySelector('input[name="level"]:checked').value;

        
        if(type === "" || year === "" || level === ""){
            html.displayError('Please fill all the fields');
        } else {            
            // clear previous results
            const previousResults = document.querySelector('#results div');
            if(previousResults != null){
                previousResults.remove();
            }
            // make quotation
            const insurance = new Insurance(type, year, level);
            const price = insurance.calculateQuotation(insurance); 
            
            // print quotation
            html.printQuotation(price, insurance);
        }
        
    });
}




//objects

// all content on insurance & calculations;
function Insurance(type, year, level){
    this.type = type;
    this.year = year;
    this.level = level;
}
// calculations
Insurance.prototype.calculateQuotation = function(insurance){
    let price;
    const base = 5000;

    // get make
    const type = insurance.type;
    /*
        type
        1= Motorcycle--       05% 
        2= Motorcar --        15%
        3= MotorOmnibuses--   25%
        4= HeavyCommercial -- 35% 
        5= tractors/trucks -- 45%
    */
    switch(type){
        case '1':
            price = base * 1.05;
            break;
        case '2':
            price = base * 1.15;
            break;
        case '3':
            price = base * 1.25;
            break;
        case '4':
            price = base * 1.35;
            break;
        case '5':
            price = base * 1.45;
            break;
           
    }

    const year = insurance.year;

    // get the difference bt the current and selected year;
    const difference = this.getYearDifference(year);

    // modify price according to the difference (each year price drops by 4%)
    price = price - ((difference * 4) * price) / 100;

    const level = insurance.level;
    price = this.calculateLevel(price, level);

    return price;

}

// gets the difference in years
Insurance.prototype.getYearDifference = function(year){
    return new Date().getFullYear() - year;
}

// calculate price level
Insurance.prototype.calculateLevel = function(price, level){
    /* modify price by the level of protection
        basic = increase price by 30%;
        comprehensive = increase price by 60%;
    */
   switch(level){
    case 'Basic':
        price = price * 1.3;
        break;
     case 'Comprehensive':
         price = price * 1.6;
         break;   
    }
    return price;
}


// all the htm content 
function HTMLUI() {}

//display years on select
HTMLUI.prototype.displayYears = function(){
    // max & min years
    const max = new Date().getFullYear();
    const min = max - 20;

    // generate list of years
    const selectYears = document.getElementById('years');

    for(let i = max; i >= min; i --){
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        selectYears.appendChild(option);
    }
}
// displays error
HTMLUI.prototype.displayError = function(message){
    const errorDiv = document.createElement('div');
    errorDiv.classList = 'error';

    errorDiv.innerHTML = `
    <p>${message}</p>
    `;
    form.insertBefore(errorDiv, document.querySelector('.form-group'));

    setTimeout(() => {
        errorDiv.remove();
    }, 4000);
}
// print results of the quotation
HTMLUI.prototype.printQuotation = function(price, insurance){
    const result = document.getElementById('results');
    const div = document.createElement('div');

    // read some summary from insurance object
    let type = insurance.type;

    switch(type){
        case '1':
            type = 'Motor cycle';
            break;
        case '2':
            type = 'Motor car';
            break;
        case '3':
            type = 'Motor omnibuses';
            break;
        case '4':
            type = 'Heavy commercial';
            break;
        case '5':
            type = 'Trucks and Tractors';
            break; 

        return type;       
    }
    div.innerHTML = `
        <p class="header">summary</p>
        <p>Type: ${type}</p>
        <p>Year: ${insurance.year}</p>
        <p>Level: ${insurance.level}</p>
        <p>Total: Ksh ${price}</p>
    `;

    // show loading
    const loader = document.getElementById('loading');
    loader.style.display = 'block';
    
    setTimeout(() => {
        loader.style.display = "none";
        // append to the results;
        result.appendChild(div);
    }, 3000);

   
}