"use script";

let library = new Array();

function Book(title, author, releaseDate, pages, readStatus, imgSrc) {
  this.title = title;
  this.author = author;
  this.releaseDate = releaseDate;
  this.pages = pages;
  this.status = readStatus;
  this.imgSrc = imgSrc;
}
Book.prototype.read = function() {
  this.status = this.pages;
}
Book.prototype.info = function() {
  return `${this.title} by ${this.author}, ${this.pages} pages, released in ${this.releaseDate}, ${this.status ? "read" : "not read yet"}`;
}

function addBook(arr, title, author, releaseDate, pages, readStatus, imgSrc) {
  arr.push(new Book(title, author, releaseDate, pages, readStatus, imgSrc));
}

const DOM_main = document.querySelector("main");
const DOM_loadButton = document.querySelector("li.load");


// Example Books_

const book1 = new Book(
  "The Lord of the Rings",
  "J.R.K. Tolkien",
  1921,
  256,
  57,
  null
);

addBook(
  library,
  "The Lord of the Rings",
  "J.R.K. Tolkien",
  1921,
  256,
  57,
  null
);

function addBooksFromLibrary() {
  for (const book of library) {
    const newElement = document.createElement("article");
    newElement.classList.add("book");
    if (book.imgSrc) {
      newElement.style.background = `url(${imgSrc}) center / cover no-repeat`;
    } else {
      newElement.innerHTML = `<h2 class="title">${book.title}</h2>
                                <address class="author">By ${book.author}</address>
                                <progress value="${book.status / book.pages}"></progress>
                              </article>`
    }
    console.log(book.pages);
    console.log(book.status);
    console.log(book.status / book.pages);
    book.id = newElement.id = crypto.randomUUID();
    console.log(book.id);
    DOM_main.appendChild(newElement);
  }
}

DOM_loadButton.addEventListener("click", addBooksFromLibrary);
