'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    "2020-07-26T17:01:17.194Z",
    "2020-07-28T23:36:17.929Z",
    "2020-08-01T10:51:36.790Z",
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions

   // formatting date and other //
   const formatMovementDate = function(date){
    
    const calcDaysPassed = (date1 , date2) => 
     Math.round( Math.abs(date2 - date1) / (1000 * 60 * 60 * 24 ));
    
      const daysPassed = calcDaysPassed(new Date() ,date);
      console.log(daysPassed);

      if(daysPassed === 0) return "Today";
      if(daysPassed === 1) return "Yesterday";
      if(daysPassed <= 7) return `${daysPassed} Day ago`;
      
      else{
        
        const day = `${date.getDate()}`.padStart(2 , 0) ;
        const month = `${date.getMonth()}` .padStart(2 , 0);
        const year = date.getFullYear();
        
        return `${day} / ${month} / ${year}`;

      }

   }

   const displayMovements = function (acc, sort = false) {
    containerMovements.innerHTML = "";
  
    console.log(acc);
    const movs = sort
    ? acc?.movements?.slice().sort((a, b) => a - b) : acc.movements;
    
    console.log(movs);
      // console.log(sort
      //   ? acc.movements.slice().sort((a, b) => a - b) : acc.movements);
  
      movs?.map(function (mov, i) {
      const type = mov > 0 ? 'deposit' : 'withdrawal';
  
      const date =  new Date(acc.movementsDates[i]);
      const displayDate = formatMovementDate(date);
  
      const html = `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
        i + 1
      } ${type}</div>
          <div class="movements__date">${displayDate}</div>
          <div class="movements__value">${mov.toFixed(2)}€</div>
        </div>
      `;
  
      containerMovements.insertAdjacentHTML('afterbegin', html);
    });
  };

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance.toFixed(2)}€`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes.toFixed(2)}€`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out).toFixed(2)}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest.toFixed(2)}€`;
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

/////////////////////////////////////
// logout Base timer  //

  const startLogOutTimer = function(){
   
    // that use immediately call function that way create new fun
    const tick = function(){
      const min = String(Math.trunc(time / 60)).padStart(2,0);
      const sec = String(time % 60).padStart(2,0);
      //In each call , print the remaining time to UI
        labelTimer.textContent = `${min} :${sec} `; 

        
      
      // when 0 second , stop timer and log out user
      if(time === 0){
        clearInterval(timer);
       
        labelWelcome.textContent = `Log in get Started, ${
          currentAccount.owner.split(' ')[0]
        }`;
        containerApp.style.opacity = 0;
    
      }
      //Decrease 1s
      time--; 

    }

    // set time 5 minutes

      let time = 1200;

      tick();
    // call the timer every second
      const timer =  setInterval( tick, 1000);
      return timer;

  }

///////////////////////////////////////
// Event handlers //
let currentAccount , timer;

// FAKE ALWAYS LOGGED IN // FAKE LOGIN
/*currentAccount = account1;
updateUI(currentAccount);
containerApp.style.opacity = 100;*/

// day/month/year

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === +(inputLoginPin.value)) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    
const now = new Date();
const day = `${now.getDate()}`.padStart(2 , 0) ;
const month = `${now.getMonth()}` .padStart(2 , 0);
const year = now.getFullYear();
const hours = now.getHours();
const min = now.getMinutes();
labelDate.textContent = `${day} / ${month} / ${year} ${hours}:${min}`;


    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // set timer user interact with show UI
    //timer 
    if(timer) clearInterval(timer);
    timer = startLogOutTimer();

    // Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    // Update UI
    updateUI(currentAccount);

    //Reset timer
    clearInterval(timer);
    timer = startLogOutTimer();
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) 
    {
    
    setTimeout(function(){
          // Add movement
          currentAccount.movements.push(amount);

        // add transfer date
        currentAccount.movementsDates.push(new Date().toISOString());
    
    // Update UI
    updateUI(currentAccount);
  } , 3000); 
  }
  inputLoanAmount.value = '';

  
    //Reset timer
    clearInterval(timer);
    timer = startLogOutTimer();
    
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // ReLogin and Login text reset
     
    labelWelcome.textContent = `Log in get Started, ${
      currentAccount.owner.split(' ')[0]
    }`;

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  if(currentAccount){
    console.log(currentAccount);
    displayMovements(currentAccount, !sorted);
    sorted = !sorted;
  }

});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES


/////////////////////////////////////////////////
    /// Checking Number ///

    /*
console.log(23 === 23.0);

// Base 10 - 0 to 9
// Binary base 2 - 0 1

console.log(0.1 + 0.2);

//that is js is generate error means false
console.log(0.1 + 0.2 === 0.3);

console.log(Number('23'));

// that + sign automatically covert type 
//  string to number using + sing
console.log(+'23px');// return NaN
console.log(+'23');
// Parsing 
// that is all are global function

// parsing that is ignore number after radix string
console.log(Number.parseInt('30px'));
console.log(Number.parseInt('e32')); // because tha is start with character  

console.log(Number.parseInt('2.5rem'));
console.log(Number.parseFloat('2.5rem'));

// NaN that  is check not a number or what
console.log(Number.isNaN(20));
console.log(Number.isNaN('20'));
console.log(Number.isNaN(+'20px'));
console.log(Number.isNaN(NaN));
console.log(Number.isNaN(23 / 0));

// checking if value is number
console.log(Number.isFinite(20));
console.log(Number.isFinite('20'));

console.log(Number.isInteger(20));
console.log(Number.isInteger("20"));
*/

/////////////////////////////////////////////////
    // Math and Rounding //

    // MATH //
    /*
    console.log(Math.sqrt(25));
    console.log(25 ** (1/2));
    console.log(8 ** (1/3));

    console.log(Math.max(5,4,3,1,"8",2,1)); // 8
    console.log(Math.max(5,4,3,1,"8px",2,1)); // that is return NaN 

    console.log(Math.min(6,43,2,"4","6","21",1));
    console.log(Math.min(6,43,'px',"4","6","21","1px"));

    // find circle radius
    console.log(Math.PI * Number.parseFloat('20px') ** 2);

    // random value
    console.log(Math.floor( Math.random() * 6) + 1);

    const randomInt = (min,max) =>{
      return Math.floor(Math.random() * (max - min) + 1) + min; 
    }
    console.log(randomInt(1,10));

    const arr = Array.from({length : 7} ,() => randomInt(1,10) );
    console.log(arr);
    */  

    // ROUNDING INTEGER//

    /*
    console.log(Math.trunc(23.333));

    console.log(Math.round(23.3));
    console.log(Math.round(23.9));

    console.log(Math.ceil(23.3));
    console.log(Math.ceil(23.9));

    console.log(Math.floor(23.3));
    console.log(Math.floor("23.9"));
    console.log(Math.floor(-23.9));*/

    // ROUNDING DECIMAL//

    // console.log((2.7).toFixed(0));
    // console.log((2.7).toFixed(3));
    // console.log(+(2.345).toFixed(2));

/////////////////////////////////////////////////

        // Remainder //
/*
    console.log(5 % 2); // return remainder
    console.log(5 / 2);
    console.log(8 % 3);

    console.log(6 % 2 === 0);
    console.log(7 % 2 === 0);

    const isEvenOrOdd = n => n % 2 === 0 ? 'even' : 'odd';
    console.log(isEvenOrOdd(7));

labelBalance.addEventListener('click' , function(){
  [...document.querySelectorAll(".movements__row")]
    .forEach(function(row , i ){
      // 0 , 2, 4, row number that apply css
      if(i % 2 === 0)row.style.backgroundColor = "orange";
    })
});*/

  // Big Integer //
/*
  console.log(2 ** 53 - 1);
  console.log(Number.MAX_SAFE_INTEGER);

  console.log(BigInt("4154215151"));

  //operation
  console.log(10000n + 10000n);

  // exception
  console.log(20n === 20);
  
  const huge = 1231242341223n;
  console.log(huge + 'is Really big!!!');

  //division
  console.log( 11n / 3n);
  console.log( 11 / 3);*/

/////////////////////////////////////////////////

        // DATE AND TIME //

        // create a Date
        // 4 ways to create
        /*
        const now  = new Date();
        console.log(now);

        // string
        console.log(new Date("June 1,2024"));

        console.log(new Date(account1.movementsDates[0]));

        console.log(new Date(2024 , 5 ,1 , 15, 23,5));

        console.log(new Date(0));

        console.log(new Date(3 * 24 * 60 * 60 * 1000)); // that is return 259200000 timestamp
          */
        // working with Dates
      /* const future = new Date(2024 , 5 ,1 , 15, 23,5);
        console.log(future);

        console.log(future.getFullYear());
        console.log(future.getMonth());
        console.log(future.getDate());
        console.log(future.getDay());
        console.log(future.getTime());
        console.log(future.getHours());
        console.log(future.getUTCDate());

        const today = new Date();
        console.log(today.toISOString());
        console.log(today.toDateString());

        console.log(Date.now());

        future.setFullYear(2025);
        console.log(future);*/

            
        
        // TIME //
/*
        const future = new Date();

        const calcDaysPassed = (date1 , date2) => 
         Math.abs(date2 - date1) / (1000 * 60 * 60 * 24 );

        const days1 = calcDaysPassed(
          new Date(2037, 3 , 14) , new Date(2037, 3 , 4) );
          console.log(days1);*/


          // SET TIMEOUT//
            /*
          // that is use in  Asynchronous js
          // syntax : setTimeout(fun , millisecond , param1 ,param2,....)

          // setTimeout((ing1,ing2) => 
          //   console.log(`'here is your pizza ${ing1} ,${ing2} 🍕' `) , 3000 , 'gemsBoand' ,'jonny');

          // console.log("clear your pizza");

          // clear timeout
          
          //" settimeout use in this app to loan section 
          // because bank can approve at some day and week "// 

          const ingredients = ['olives' , '']
          const pizzaTimer = setTimeout((ing1,ing2) => 
            console.log(`'here is your pizza ${ing1} ,${ing2} 🍕' `) 
          , 3000 ,
           ...ingredients);
           console.log("Waiting...");

           if(ingredients.includes('spinach')) clearTimeout(pizzaTimer); 
           // that is use then do not see about setTimer because that is clear timeout
          */

           // SET INTERVAL //

          //that method repeatedly calls function or
          //execute a code snippet with fixed time delay between each call

          // syntax : setInterval(func,delay , arg1,arg1...n);

          // so you can remove it later by calling 
          // clearInterval();

          // setInterval(function(){
          //   const currentTime = new Date();
          //   const hour = currentTime.getHours();
          // const minute = currentTime.getMinutes();
          // const second = currentTime.getSeconds();
          // console.clear();
          // console.log(`${hour}:${minute}:${second}`);  
          // },1000);

          
        
          // setInterval(function(){
          //   
          // },1000);
          
          
        
