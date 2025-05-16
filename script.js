"use strict";

/* ********************************** */
/* * GLOBAL CONSTANTS AND VARIABLES * */
/* ********************************** */

const library = new Array();

const DOM_main = document.querySelector("main");

const DOM_addButton = document.querySelector(".add-button");
const DOM_readButton = document.querySelector(".read-button");
const DOM_readAllButton = document.querySelector(".read-all-button");
const DOM_removeButton = document.querySelector(".remove-button");
const DOM_editButton = document.querySelector(".edit-button");

const DOM_addDialog = document.querySelector(".add-book");
const DOM_readDialog = document.querySelector(".read-book");
const DOM_readAllDialog = document.querySelector(".read-all-book");
const DOM_removeDialog = document.querySelector(".remove-book");
const DOM_editDialog = document.querySelector(".edit-book");

const DOM_addSubmit = document.querySelector(".add-submit");


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
  this.bookID = bookID;
}

function createBookDOM(bookObject) {
  const DOM_book = document.createElement("article");
  DOM_book.classList.add("book");
  DOM_book.id = `id${bookObject.bookID}`;
  if (bookObject.coverURL) DOM_book.style.background = `center / cover no-repeat url("${bookObject.coverURL}")`;

  const DOM_title = document.createElement("h2");
  DOM_title.classList.add("title");
  DOM_title.innerHTML = bookObject.name;

  const DOM_author = document.createElement("address");
  DOM_author.classList.add("author");
  DOM_author.innerHTML = bookObject.author ?? "Unknown";

  const DOM_publishingDate = document.createElement("address");
  DOM_publishingDate.classList.add("date");
  DOM_publishingDate.innerHTML = `Published in</br>${bookObject.publishingDate ?? "Unknown"}`;

  const DOM_progress = document.createElement("progress");
  DOM_progress.value = bookObject.readPages / bookObject.totalPages;

  const DOM_pOutOF = document.createElement("p");
  DOM_pOutOF.classList.add("pages-read");
  DOM_pOutOF.innerHTML = `${bookObject.readPages} / ${bookObject.totalPages}`;

  DOM_book.appendChild(DOM_title);
  DOM_book.appendChild(DOM_author);
  DOM_book.appendChild(DOM_publishingDate);
  DOM_book.appendChild(DOM_progress);
  DOM_book.appendChild(DOM_pOutOF);

  DOM_main.appendChild(DOM_book);
}

function addEventListenerToBook(bookID, callback) {
  const DOM_book = document.querySelector(`#id${bookID}`);
  if (DOM_book) {
    DOM_book.addEventListener("click", callback);
  }
}

function getCurrentID(e) {
  if (currentlySelectedID) {
    const currentlySelectedElement = document.querySelector(`#${currentlySelectedID}`);
    currentlySelectedElement.classList.remove("selected");
  }
  currentlySelectedID = e.currentTarget.id;
  e.currentTarget.classList.add("selected");
}

function addNewBook(name, author, publishingDate, coverURL, totalPages, readPages) {
  library.push(new Book(name, author, publishingDate, coverURL, totalPages, readPages, crypto.randomUUID()));
  createBookDOM(library.at(-1));
  addEventListenerToBook(library.at(-1).bookID, getCurrentID);
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

function readBook(numberPages, bookID) {
  const bookIndex = getBookIndex(bookID);
  if (bookIndex < 0) return;

  const book = library[bookIndex];
  book.readPages += numberPages;
  if (book.readPages > book.totalPages) book.readPages = book.totalPages;

  updateDOM(book);
}

function readAllBook(bookID) {
  const bookIndex = getBookIndex(bookID);
  if (bookIndex < 0) return;

  const book = library[bookIndex];
  book.readPages = book.totalPages;

  updateDOM(book);
}

function editBook(title, author, publishingDate, bookID) {
  const bookIndex = getBookIndex(bookID);
  if (bookIndex < 0) return;

  const book = library[bookIndex];
  book.title = title;
  book.author = author;
  book.publishingDate = publishingDate;

  updateDOM(book);
}



/* *************** */
/* * OPEN MODALS * */
/* *************** */

DOM_addButton.addEventListener("click", function() {
  DOM_addDialog.showModal();
})

DOM_readButton.addEventListener("click", function() {
  DOM_readDialog.showModal();
})

DOM_readAllButton.addEventListener("click", function() {
  DOM_readAllDialog.showModal();
})

DOM_removeButton.addEventListener("click", function() {
  DOM_removeDialog.showModal();
})

DOM_editButton.addEventListener("click", function() {
  DOM_editDialog.showModal();
})



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
  const file = document.getElementById("add-image").files[0]
  const image = file ? URL.createObjectURL(file) : null;

  let date = "";
  if (day && month && year) date = `${day}/${month}/${year}`;
  else if (month && year) date = `${month}/${year}`;
  else if (year) date = year;
  else date = null;

  addNewBook(title, author, date, image, totalPages, 0);

  DOM_addDialog.close();
});

