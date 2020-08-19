// Declare the Object constructor.
function Book(title, author, pages, isbn, read, bookURL) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.isbn = isbn;
  this.read = read;
  this.bookURL = bookURL;
}

Book.prototype.toggleStatus = function () {
  if (this.read == 'Read') {
    this.read = 'Not Read';
    return 1; // We will use these returns to change the display of our buttons later.
  } else if (this.read == 'Not Read') {
    this.read = 'Reading';
    return 2;
  } else if (this.read == 'Reading') {
    this.read = 'Read';
    return 3;
  }
}

// Initalize library variables.
let myLibrary = [];
const container = document.querySelector('.books-container');


// Display and Hide the "Add a Book" form.
const popup = document.querySelector('.form-popup');
const addBtn = document.querySelector('.add-btn');
const cancelBtn = document.getElementById('cancel-btn');

addBtn.addEventListener('click', function () {
  popup.style.display = 'block'; // Show
})

cancelBtn.addEventListener('click', function () {
  popup.style.display = 'none'; // Hide
})

// #### Book Form Start 
// ##

// Get the form values
const form = document.getElementById('form1');

form.addEventListener('submit', function (event) {
  const title = document.forms[0].elements[1].value;
  const author = document.forms[0].elements[2].value;
  const pages = document.forms[0].elements[3].value;
  const isbn = document.forms[0].elements[4].value;
  const bookURL = document.forms[0].elements[0].value;
  // Check which radio button has been selected.
  let read = '';
  if (document.getElementById('read').checked) {
    read = 'Read';
  } else if (document.getElementById('unread').checked) {
    read = 'Not Read';
  } else {
    read = 'Reading';
  }

  // Prevent page from refreshing and closing the form popup.
  event.preventDefault();
  popup.style.display = 'none';

  // Add our book.
  addBookToLibrary(title, author, pages, isbn, read, bookURL);

  // Display the books and reset the form.
  render();
  form.reset();

})

// Display our cover preview. 
const cover = document.querySelector('.cover-preview');
const isbnField = document.getElementById('isbn'); // In case ISBN has been typed
const coverURL = document.getElementById('url'); // In case URL has been used.

coverURL.addEventListener('change', function () {
  cover.style.background = `url(${document.forms[0].elements[0].value})`;
  cover.style.backgroundSize = 'cover';
})

isbnField.addEventListener('change', function () {
  if (document.forms[0].elements[0].value == '') { // URL takes preference as it's chosen by user.
    cover.style.background = `url(http://covers.openlibrary.org/b/isbn/${document.forms[0].elements[4].value}-M.jpg)`;
    cover.style.backgroundSize = 'cover';
  }
})


// Add a given book to myLibrary array
function addBookToLibrary(title, author, pages, isbn, read, bookURL) {
  let book = new Book(title, author, pages, isbn, read, bookURL);
  myLibrary.push(book);
}

// ##
// #### Book Form End


// Display the books in our HTML

function render(optionalFilter) {

  // Clear our space first.
  const existingDivs = document.querySelectorAll('[data-book]');
  existingDivs.forEach((div) => {
    div.remove();
  });

  for (let i = 0; i < myLibrary.length; i++) {

    // Skip some categories if we are filtering.
    if (optionalFilter == 'Read') {
      if (myLibrary[i]['read'] == 'Not Read' || myLibrary[i]['read'] == 'Reading') {
        continue;
      } 
    }

    if (optionalFilter == 'Not Read') {
      if (myLibrary[i]['read'] == 'Read' || myLibrary[i]['read'] == 'Reading') {
        continue;
      } 
    }

    if (optionalFilter == 'Reading') {
      if (myLibrary[i]['read'] == 'Not Read' || myLibrary[i]['read'] == 'Read') {
        continue;
      } 
    }

    // Move forward to create our book elements.
    let element = document.createElement('div');
    element.classList.add('book');

    // Determine our cover. URL overrides ISBN.
    if (myLibrary[i]['bookURL']) {
      element.style.background = `url(${myLibrary[i]['bookURL']})`;
    } else {
      element.style.background = `url(http://covers.openlibrary.org/b/isbn/${myLibrary[i]['isbn']}-M.jpg)`;
    }
    element.style.backgroundSize = 'cover';
    element.setAttribute("data-book", i);

    // Create our mouse enter divs to display book information.
    let infoDiv = document.createElement('div');
    infoDiv.classList.add('book-info');
    infoDiv.style.display = 'none'; // Set to not display by deafult until mouse enter.
    let titleDiv = document.createElement('div');
    titleDiv.classList.add('info-title');
    titleDiv.textContent = myLibrary[i]['title'];
    let authorDiv = document.createElement('div');
    authorDiv.classList.add('info-author');
    authorDiv.textContent = `by ${myLibrary[i]['author']}`;
    let pagesDiv = document.createElement('div');
    pagesDiv.classList.add('info-pages');
    pagesDiv.textContent = `Pages: ${myLibrary[i]['pages']}`;

    // Create our status buttons and our delete button.
    let buttonsDiv = document.createElement('div');
    buttonsDiv.classList.add('info-buttons');
    let readTag = document.createElement('button');
    readTag.classList.add('info-btn');
    readTag.setAttribute('data-bookstatus', i);

    if (myLibrary[i]['read'] == 'Read') {
      readTag.style.background = '#EBFFE5';
      readTag.textContent = '✔';
    } else if (myLibrary[i]['read'] == 'Not Read') {
      readTag.style.background = '#FFC1B1';
      readTag.textContent = '❌';
    } else {
      readTag.style.background = '#FFFFEA';
      readTag.textContent = '📖';
    }

    let removeTag = document.createElement('button');
    removeTag.classList.add('info-btn');
    removeTag.textContent = '🗑';
    removeTag.setAttribute("data-bookremove", i);



    // Add everything together
    buttonsDiv.appendChild(readTag);
    buttonsDiv.appendChild(removeTag);
    infoDiv.appendChild(titleDiv);
    infoDiv.appendChild(authorDiv);
    infoDiv.appendChild(pagesDiv);
    infoDiv.appendChild(buttonsDiv);
    element.appendChild(infoDiv);


    // Insert the finished product
    container.insertBefore(element, container.firstChild);
  }

  // Display book information on mouseover
  const bookFrames = Array.from(document.querySelectorAll('.book'));

  bookFrames.forEach((bookFrame) => {
    bookFrame.addEventListener('mouseenter', function (e) {
      bookFrame.firstChild.style.display = 'block';
    });
  });

  bookFrames.forEach((bookFrame) => {
    bookFrame.addEventListener('mouseleave', function (e) {
      bookFrame.firstChild.style.display = 'none';
    });
  });

  // Add functionality to our status and delete buttons

  // Status Change Button
  const statusButtons = Array.from(document.querySelectorAll('button[data-bookstatus'));
  statusButtons.forEach((button) => {
    button.addEventListener('click', function () {
      let index = button.getAttribute('data-bookstatus');
      let x = myLibrary[index].toggleStatus();

      switch (x) {
        case 1:
          button.style.background = '#FFC1B1';
          button.textContent = '❌';
          break;
        case 2:
          button.style.background = '#FFFFEA';
          button.textContent = '📖';
          break;
        case 3:
          button.style.background = '#EBFFE5';
          button.textContent = '✔';
          break;

      }
    });
  });

  //Remove button
  const removeButtons = Array.from(document.querySelectorAll('button[data-bookremove]'));
  removeButtons.forEach((button) => {
    button.addEventListener('click', function () {
      let index = button.getAttribute('data-bookremove');
      const bookToRemove = document.querySelector(`div[data-book='${index}']`);
      bookToRemove.remove();  // Remove it from the DOM.
      myLibrary.splice(index, 1); //  Remove it from our array so it does not render again.
    });
  });


}


// Filter by Read, Not Read and Reading

const filterAll = document.querySelector('#filter-all');
const filterRead = document.querySelector('#filter-read');
const filterUnread = document.querySelector('#filter-unread');
const filterReading = document.querySelector('#filter-reading');

filterAll.addEventListener('click', function() {
  render();
});

filterRead.addEventListener('click', function() {
  render('Read');
});

filterUnread.addEventListener('click', function() {
  render('Not Read');
});

filterReading.addEventListener('click', function() {
  render('Reading');
});