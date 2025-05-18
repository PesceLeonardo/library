"use strict";

/* ********************************** */
/* * GLOBAL CONSTANTS AND VARIABLES * */
/* ********************************** */

const library = new Array();

const DOM_main = document.querySelector("main");

const DOM_addButton = document.querySelector(".add-button");
const DOM_readButton = document.querySelector(".read-button");
const DOM_readAllButton = document.querySelector(".read-all-button");
const DOM_resetButton = document.querySelector(".reset-button");
const DOM_removeButton = document.querySelector(".remove-button");
const DOM_editButton = document.querySelector(".edit-button");

const DOM_addDialog = document.querySelector(".add-book");
const DOM_readDialog = document.querySelector(".read-book");
const DOM_editDialog = document.querySelector(".edit-book");

const DOM_addSubmit = document.querySelector(".add-submit");
const DOM_readSubmit = document.querySelector(".read-submit");
const DOM_editSubmit = document.querySelector(".edit-submit");

let currentlySelectedID = "";



/* *************** */
/* * CREATE BOOK * */
/* *************** */

function Book(name, author, publishingDate, coverURL, totalPages, readPages, bookID) {
  this.name = name;
  this.author = author;
  this.publishingDate = publishingDate;
  this.coverURL = coverURL;
  this.readPages = readPages;
  this.totalPages = totalPages;
  this.bookID = `id${bookID}`;
}

function createBookDOM(bookObject) {
  const DOM_book = document.createElement("article");
  DOM_book.classList.add("book");
  DOM_book.id = bookObject.bookID;
  if (bookObject.coverURL) DOM_book.style.background = `center / cover no-repeat url("${bookObject.coverURL}")`;

  const DOM_title = document.createElement("h2");
  DOM_title.classList.add("title");
  DOM_title.innerHTML = bookObject.name;

  const DOM_author = document.createElement("address");
  DOM_author.classList.add("author");
  DOM_author.innerHTML = bookObject.author || "Unknown";

  const DOM_publishingDate = document.createElement("address");
  DOM_publishingDate.classList.add("date");
  DOM_publishingDate.innerHTML = `Published in</br>${bookObject.publishingDate ?? "Unknown"}`;

  const DOM_progress = document.createElement("progress");
  DOM_progress.value = bookObject.readPages / bookObject.totalPages;

  const DOM_pOutOF = document.createElement("p");
  DOM_pOutOF.classList.add("pages-read");
  DOM_pOutOF.innerHTML = `${bookObject.readPages} / ${bookObject.totalPages}`;

  const DOM_remove = document.createElement("button");
  DOM_remove.classList.add("cross");
  DOM_remove.innerHTML = "REMOVE";

  DOM_book.appendChild(DOM_title);
  DOM_book.appendChild(DOM_author);
  DOM_book.appendChild(DOM_publishingDate);
  DOM_book.appendChild(DOM_progress);
  DOM_book.appendChild(DOM_pOutOF);
  DOM_book.appendChild(DOM_remove);

  DOM_main.appendChild(DOM_book);
}

function addEventListenerToBook(bookID, callback_book, callback_remove) {
  const DOM_book = document.querySelector(`#${bookID}`);
  if (DOM_book) {
    DOM_book.addEventListener("click", callback_book);
  }
  const DOM_removeButton = document.querySelector(`#${bookID} .cross`);
  if (DOM_removeButton) {
    DOM_removeButton.addEventListener("click", callback_remove);
  }
}

function getCurrentID(e) {
  if (currentlySelectedID) {
    const currentlySelectedElement = document.getElementById(currentlySelectedID);
    currentlySelectedElement.classList.remove("selected");
  }
  currentlySelectedID = e.currentTarget.id;
  e.currentTarget.classList.add("selected");
}

function loadBook(bookObject) {
  createBookDOM(bookObject);
  addEventListenerToBook(bookObject.bookID, getCurrentID, function() { removeBook(bookObject.bookID) });
}

function addNewBook(name, author, publishingDate, coverURL, totalPages, readPages) {
  library.push(new Book(name, author, publishingDate, coverURL, totalPages, readPages, crypto.randomUUID()));
  loadBook(library.at(-1));
}



/* ************** */
/* * UPDATE BOOK* */
/* ************** */

function updateDOM(bookObject) {
  const bookID = bookObject.bookID;

  const bookArticle = document.querySelector(`article#${bookID}`);
  const bookTitle = document.querySelector(`article#${bookID} h2.title`);
  const bookAuthor = document.querySelector(`article#${bookID} address.author`);
  const bookPublishingDate = document.querySelector(`article#${bookID} address.date`);
  const bookReadPercentage = document.querySelector(`article#${bookID} progress`);
  const bookReadOutOf = document.querySelector(`article#${bookID} p.pages-read`);

  if (bookTitle) bookTitle.innerHTML = bookObject.name;
  if (bookAuthor) bookAuthor.innerHTML = `${bookObject.author}`;
  if (bookPublishingDate) bookPublishingDate.innerHTML = `Published in</br>${bookObject.publishingDate}`;
  if (bookReadPercentage) bookReadPercentage.value = bookObject.readPages / bookObject.totalPages;
  if (bookReadOutOf) bookReadOutOf.innerHTML = `${bookObject.readPages} / ${bookObject.totalPages}`;

  if (bookObject.coverURL && bookArticle) {
    bookArticle.style.background = `center / cover no-repeat url("${bookObject.coverURL}")`;
  }
}



/* ************* */
/* * EDIT BOOK * */
/* ************* */

function getBookIndex(bookID) {
  return library.findIndex(book => book.bookID === bookID);
}

function readBook(numberPages, bookID, upTo) {
  const bookIndex = getBookIndex(bookID);
  if (bookIndex < 0) return;

  const book = library[bookIndex];
  if (upTo) book.readPages = numberPages;
  else book.readPages += numberPages;

  if (book.readPages > book.totalPages) book.readPages = book.totalPages;

  updateDOM(book);
}

function readAllBook(bookID, reset = false) {
  const bookIndex = getBookIndex(bookID);
  if (bookIndex < 0) return;

  const book = library[bookIndex];
  book.readPages = !reset ? book.totalPages : 0;

  updateDOM(book);
}

function removeBook(bookID) {
  const bookIndex = getBookIndex(bookID);
  if (bookIndex < 0) return;

  const DOM_bookNode = document.getElementById(bookID);
  DOM_main.removeChild(DOM_bookNode);
  library.splice(bookIndex, 1);

  currentlySelectedID = "";
}

function getFullDate(day, month, year) {
  if (day && month && year) return `${day}/${month}/${year}`;
  else if (month && year) return `${month}/${year}`;
  else if (year) return year;
  else return null;
}

function editBook(bookID) {
  const bookIndex = getBookIndex(bookID);
  if (bookIndex < 0) return;

  const book = library[bookIndex];

  const title = document.getElementById("edit-title").value;
  const author = document.getElementById("edit-author").value;
  const day = document.getElementById("edit-day").value;
  const month = document.getElementById("edit-month").value;
  const year = document.getElementById("edit-year").value;
  const totalPages = document.getElementById("edit-pages").value;

  const file = document.getElementById("edit-image").files[0];
  const useDefault = document.getElementById("use-default").checked;

  book.name = title;
  book.author = author;
  book.publishingDate = getFullDate(day, month, year);
  book.totalPages = totalPages;
  if (book.readPages > book.totalPages) book.readAllBook = book.totalPages;

  if (useDefault || !file) {
    book.coverURL = null;
  } else {
    book.coverURL = URL.createObjectURL(file);
  }

  updateDOM(book);
}



/* *************** */
/* * OPEN MODALS * */
/* *************** */

DOM_addButton.addEventListener("click", function() {
  DOM_addDialog.showModal();
});

DOM_readButton.addEventListener("click", function() {
  if (!currentlySelectedID) return;
  DOM_readDialog.showModal();
});

DOM_editButton.addEventListener("click", function() {
  if (!currentlySelectedID) return;

  DOM_editDialog.showModal();
  fillEditModal(currentlySelectedID);
});

function fillEditModal(bookID) {
  const bookIndex = getBookIndex(bookID);
  if (bookIndex < 0) return;

  const book = library[bookIndex];

  const DOM_title = document.getElementById("edit-title");
  const DOM_author = document.getElementById("edit-author");
  const DOM_day = document.getElementById("edit-day");
  const DOM_month = document.getElementById("edit-month");
  const DOM_year = document.getElementById("edit-year");
  const DOM_pages = document.getElementById("edit-pages");

  DOM_title.value = book.name;
  DOM_author.value = book.author ?? "";
  DOM_pages.value = book.totalPages;

  const dateArray = book.publishingDate.split("/");
  switch (dateArray.length) {
    case 3:
      DOM_day.value = dateArray.at(-3);
    case 2:
      DOM_month.value = dateArray.at(-2);
    case 1:
      DOM_year.value = dateArray.at(-1);
      break;
  }
}



/* ************ */
/* * GET DATA * */
/* ************ */

DOM_addSubmit.addEventListener("click", function() {
  const title = document.getElementById("add-title").value;
  const author = document.getElementById("add-author").value;
  const day = document.getElementById("add-day").value;
  const month = document.getElementById("add-month").value;
  const year = document.getElementById("add-year").value;
  const totalPages = document.getElementById("add-pages").value;
  const file = document.getElementById("add-image").files[0];
  const image = file ? URL.createObjectURL(file) : null;

  if (!title || !totalPages || Number(totalPages) < 1) return;

  let date = "";
  date = getFullDate(day, month, year);

  addNewBook(title, author, date, image, Number(totalPages), 0);

  DOM_addDialog.close();
});

DOM_readSubmit.addEventListener("click", function() {
  const DOM_upTo = document.querySelector("input[name=\"read-option\"]:checked");
  const pages = document.getElementById("read-pages").value;
  if (!DOM_upTo || !pages || Number(pages) < 1) return;

  const upTo = Number(DOM_upTo.value);

  readBook(Number(pages), currentlySelectedID, upTo);

  DOM_readDialog.close();
});

DOM_readAllButton.addEventListener("click", function() {
  readAllBook(currentlySelectedID, false);
});

DOM_resetButton.addEventListener("click", function() {
  readAllBook(currentlySelectedID, true);
});

DOM_removeButton.addEventListener("click", function() {
  removeBook(currentlySelectedID);
});

DOM_editSubmit.addEventListener("click", function() {
  editBook(currentlySelectedID);

  DOM_editDialog.close();
});



/* **************** */
/* * LOAD LIBRARY * */
/* **************** */

function loadLibrary() {
  for (const book of library) {
    loadBook(book);
  }
}

document.addEventListener("DOMContentLoaded", function() {
  library.push(new Book("Inheritance", "Paolini", "1987", null, 627, 0, crypto.randomUUID()));
  library.push(new Book("Eldest", "Paolini", "1993", null, 415, 0, crypto.randomUUID()));
  library.push(new Book("V for Vendetta", "Lloyd", "1995", null, 90, 0, crypto.randomUUID()));

  loadLibrary();
});



