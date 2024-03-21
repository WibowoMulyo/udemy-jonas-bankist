'use strict';

// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

let accounts = [account1, account2, account3, account4];

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
const containerForm = document.querySelector('.login');

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
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// Membuat username akun
const createUsername = account => {
  account.forEach(acc => {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(word => word[0])
      .join('');
  });
};
createUsername(accounts);

// Menampilkan history transaksi
const displayMovements = (movements, sort) => {
  containerMovements.innerHTML = '';

  const mov = sort ? movements.slice().sort((a, b) => a - b) : movements;

  mov.map((mov, i) => {
    const transaction = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
    <div class="movements__row">
    <div class="movements__type movements__type--${transaction}">${
      i + 1
    } ${transaction}</div>
    <div class="movements__date">3 days ago</div>
    <div class="movements__value">${mov}€</div>
    </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
// displayMovements(account1.movements);

// Menghitung dan menampilkan total saldo
const calcPrintBalance = movements => {
  const balance = movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${balance}€`;
};
// calcPrintBalance(account1.movements);

// Menghitung dan menampilkan saldo masuk, keluar, dan bunga
const calcPrintSummary = (movements, interestRate) => {
  const incomes = movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;

  const expenses = movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${-expenses}€`;

  const interest = movements
    .filter(mov => mov > 0)
    .map(deposit => deposit * interestRate)
    .filter(int => int >= 1)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}€`;
  console.log(interestRate);
};
// calcPrintSummary(account1.movements);

let greeting;
const getGreeting = () => {
  const currentTime = new Date().getHours();

  if (currentTime >= 5 && currentTime < 12) {
    greeting = 'Good Morning';
  } else if (currentTime >= 12 && currentTime < 18) {
    greeting = 'Good Afternoon';
  } else {
    greeting = 'Good Night';
  }

  return greeting;
};
getGreeting();

const updateUI = acc => {
  displayMovements(acc.movements);
  calcPrintBalance(acc.movements);
  calcPrintSummary(acc.movements, acc.interestRate);
};

// Fitur login
let currentAccount = '';
btnLogin.addEventListener('click', e => {
  e.preventDefault();

  currentAccount = accounts.find(
    acc =>
      acc.username === inputLoginUsername.value &&
      acc.pin === Number(inputLoginPin.value)
  );

  if (currentAccount) {
    containerApp.style.opacity = 1;
    inputLoginPin.value = inputLoginUsername.value = '';
    labelWelcome.textContent = `${greeting}, ${currentAccount.owner}!`;
    updateUI(currentAccount);
  } else {
    console.log('PIN/USERNAME SALAH');
  }
});

// Fitur Logout/Close
let account = '';
let accountIndex = '';
btnClose.addEventListener('click', e => {
  e.preventDefault();

  account = accounts.find(
    acc =>
      acc.username === inputCloseUsername.value &&
      acc.pin === Number(inputClosePin.value)
  );

  accountIndex = accounts.findIndex(
    acc =>
      acc.username === inputCloseUsername.value &&
      acc.pin === Number(inputClosePin.value)
  );

  if (currentAccount === account) {
    currentAccount = account = '';
    containerMovements.innerHTML = '';
    inputCloseUsername.value = inputClosePin.value = '';
    containerApp.style.opacity = 0;

    accounts.splice(accountIndex, 1);
    console.log('YES');
  } else {
    console.log(currentAccount.username, typeof currentAccount.username);
    console.log(currentAccount.pin, typeof currentAccount.pin);
    console.log(account.username, typeof account.username);
    console.log(account.pin, typeof account.pin);
  }
});

// Fitur Transfer
btnTransfer.addEventListener('click', e => {
  e.preventDefault();
  let amount = Number(inputTransferAmount.value);
  let recipientAccount = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  console.log(labelBalance.textContent.slice(0, -1));
  if (
    amount > 0 &&
    // recipientAccount &&
    Number(labelBalance.textContent.slice(0, -1)) >= amount &&
    recipientAccount !== currentAccount
  ) {
    currentAccount.movements.push(-amount);
    recipientAccount.movements.push(amount);
    updateUI(currentAccount);
    inputTransferTo.value = inputTransferAmount.value = '';
    console.log('SUCCESS');
  } else {
    inputTransferTo.value = inputTransferAmount.value = '';
    console.log('FAILED');
  }
});

// Fitur pinjam bank
btnLoan.addEventListener('click', e => {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  const deposit = currentAccount.movements.some(mov => mov >= amount * 0.1);

  if (amount > 0 && deposit) {
    currentAccount.movements.push(amount);

    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
});

// Fitur sort
let sorted = false;
btnSort.addEventListener('click', e => {
  e.preventDefault();

  displayMovements(movements, !sorted);
  sorted = !sorted;
});

// MAXIMAL VALUE
// const balance = movements.reduce(
//   (acc, mov) => (acc < mov ? mov : acc),
//   movements[0]
// );
/////////////////////////////////////////////////

// CODING CHALENGGE
const dogs = [
  {
    weight: 22,
    curFood: 250,
    owners: ['Alice', 'Bob'],
  },
  {
    weight: 8,
    curFood: 200,
    owners: ['Matilda'],
  },
  {
    weight: 13,
    curFood: 275,
    owners: ['Sarah', 'John'],
  },
  {
    weight: 32,
    curFood: 340,
    owners: ['Michael'],
  },
];

// 1
dogs.forEach(dog => {
  dog.recommendedFood = Math.trunc(dog.weight ** 0.75 * 28);
  console.log(dog);
});

// 2
// Bisa menggunakan some atau includes
const dogSarah = dogs.find(dog => dog.owners.some(owner => owner === 'Sarah'));
console.log(
  `it's eating too ${
    dogSarah.curFood > dogSarah.recommendedFood ? 'much' : 'little'
  }`
);

// 3
let ownerEatTooMuch = [];
let ownerEatTooLittle = [];
dogs.map(dog => {
  dog.curFood > dog.recommendedFood
    ? ownerEatTooMuch.push(dog.owners)
    : ownerEatTooLittle.push(dog.owners);
});
ownerEatTooMuch = ownerEatTooMuch.flat();
ownerEatTooLittle = ownerEatTooLittle.flat();
console.log(ownerEatTooMuch);
console.log(ownerEatTooLittle);

// 4
console.log(`${ownerEatTooMuch.join(' and ')}'s dogs eat too much!`);
console.log(`${ownerEatTooLittle.join(' and ')}'s dogs eat too little!`);

// 5
