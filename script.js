"use strict";

const library = new Array();

const DOM_main = document.querySelector("main");
let currentlySelectedID = "";

function Book(name, author, publishingDate, coverURL, totalPages, readPages, bookID) {
  this.name = name;
  this.author = author;
  this.publishingDate = publishingDate;
  this.coverURL = coverURL;
  this.readPages = readPages;
  this.totalPages = totalPages;
  this.bookID = bookID;
}

function getBookIndex(bookID) {
  return library.findIndex(book => book.bookID === bookID);
}

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

function addNewBook(name, author, publishingDate, coverURL, totalPages, readPages) {
  library.push(new Book(name, author, publishingDate, coverURL, totalPages, readPages, crypto.randomUUID()));
  createBookDOM(library.at(-1));
  addEventListenerToBook(library.at(-1).bookID, getCurrentID);
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

function createBookDOM(bookObject) {
  const DOM_book = document.createElement("article");
  DOM_book.classList.add("book");
  DOM_book.id = bookObject.bookID;
  if (coverURL) DOM_book.style.background = `center / cover no-repeat url("${bookObject.coverURL}")`;

  const DOM_title = document.createElement("h2");
  DOM_title.classList.add("title");
  DOM_title.innerHTML = bookObject.name;

  const DOM_author = document.createElement("address");
  DOM_author.classList.add("author");
  DOM_author.innerHTML = bookObject.author;

  const DOM_publishingDate = document.createElement("address");
  DOM_publishingDate.classList.add("date");
  DOM_publishingDate.innerHTML = `Published in</br>${bookObject.publishingDate}`;

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
  const DOM_book = document.querySelector(`#${bookID}`);
  if (DOM_book) {
    DOM_book.addEventListener("click", callback);
  }
}

function getCurrentID(e) {
  const currentlySelectedElement = document.querySelector(`#${currentlySelectedID}`);
  currentlySelectedElement.classList.remove("selected");
  currentlySelectedID = e.currentTarget.id;
  e.currentTarget.classList.add("selected");
}
