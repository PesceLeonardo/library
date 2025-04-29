"use script";

let library = new Array();

function Book(title, author, pages, releaseDate, readStatus = false) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.releaseDate = releaseDate;
  this.status = readStatus;
}
Book.prototype.read = function() {
  this.status = true;
}
Book.prototype.info = function() {
  return `${this.title} by ${this.author}, ${this.pages} pages, released in ${this.releaseDate}, ${this.status ? "read" : "not read yet"}`;
}

