"use strict";

const library = new Array();

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

  if (bookTitle) bookTitle.innerHTML = bookObject.name;
  if (bookAuthor) bookAuthor.innerHTML = `By ${bookObject.author}`;
  if (bookPublishingDate) bookPublishingDate.innerHTML = `In ${bookObject.publishingDate}`;
  if (bookReadPercentage) bookReadPercentage.value = bookObject.readPages / bookObject.totalPages;

  if (bookObject.coverURL && bookArticle) {
    bookArticle.style.background = `center / cover no-repeat url("${bookObject.coverURL}")`;
  }
}

function addNewBook(name, author, publishingDate, coverURL, totalPages, readPages) {
  library.push(new Book(name, author, publishingDate, coverURL, totalPages, readPages, crypto.randomUUID()));

  
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
