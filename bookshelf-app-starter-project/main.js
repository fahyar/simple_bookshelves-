// Do your work here...

const books = [];
const RENDER_EVENT = "render-books";

function generateId() {
  return +new Date();
}

function generateBooks(
  id,
  bookItemTitle,
  bookItemAuthor,
  bookItemYear,
  bookItemIsComplete
) {
  return {
    id,
    bookItemTitle,
    bookItemAuthor,
    bookItemYear,
    bookItemIsComplete,
  };
}

function findBooks(books_id) {
  for (const bookItem of books) {
    if (bookItem.id === books_id) {
      return bookItem;
    }
  }
  return null;
}

function bookIndex(books_id) {
  for (const index in books) {
    if (books[index].id === books_id) {
      return index;
    }
  }
  return -1;
}

//membentuk article buku dalam list
function insertBooks(booksObject) {
  const {
    id,
    bookItemTitle,
    bookItemAuthor,
    bookItemYear,
    bookItemIsComplete,
  } = booksObject;

  const bookTitle = document.createElement("h3");
  bookTitle.innerText = bookItemTitle;

  const bookAuthor = document.createElement("p");
  bookAuthor.innerText = bookItemAuthor;

  const bookYear = document.createElement("p");
  bookYear.innerText = bookItemYear;

  const actionButton = document.createElement("div");
  actionButton.classList.add("action");

  // const bookArticle = document.createElement("div");
  // bookArticle.append(bookTitle, bookAuthor, bookYear, actionButton);

  const article = document.createElement("article");
  article.classList.add("book_item");
  article.append(bookTitle, bookAuthor, bookYear, actionButton);
  article.setAttribute("id", `books-${id}`);

  if (bookItemIsComplete) {
    let unfinishedButton = document.createElement("button");
    unfinishedButton.classList.add("unfinished_btn");
    unfinishedButton.textContent = "belum selesai membaca";
    unfinishedButton.addEventListener("click", function () {
      //tambahkan fungsi belum selesai membaca
      undoBookFromCompleted(id);
    });

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete_btn");
    deleteButton.textContent = "Hapus Buku";
    deleteButton.addEventListener("click", function () {
      //tambahkan fungsi hapus buku
      removeBook(id);
    });

    const editButton = document.createElement("button");
    editButton.classList.add("edit_btn");
    editButton.textContent = "Edit Buku";
    deleteButton.addEventListener("click", function () {
      //tambahkan fungsi edit buku
    });

    actionButton.append(unfinishedButton, deleteButton, editButton);
    article.append(actionButton);
  } else {
    const finishedButton = document.createElement("button");
    finishedButton.classList.add("finish_btn");
    finishedButton.textContent = "Selesai Membaca";
    finishedButton.addEventListener("click", function () {
      //tambahkan fungsi selesai membaca
      addBookToCompleted(id);
    });

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete_btn");
    deleteButton.textContent = "Hapus Buku";
    deleteButton.addEventListener("click", function () {
      //tambahkan fungsi hapus buku
      removeBook(id);
    });

    const editButton = document.createElement("button");
    editButton.classList.add("edit_btn");
    editButton.textContent = "Edit Buku";
    editButton.addEventListener("click", function () {
      //tambahkan fungsi edit  buku
    });
    actionButton.append(finishedButton, deleteButton, editButton);
    article.append(actionButton);
  }
  return article;
}

//fungsi submit form pencarian buku
function searchBook() {
  //const formSearchBook = document.getElementById("searchBook");
  const inputSearchBook = document.getElementById("searchBookTitle");

  const querySearchBook = inputSearchBook.value.toLowerCase().trim();

  const searchResult = books.filter((book) => {
    return (
      book.bookItemTitle.toLowerCase().includes(querySearchBook) ||
      book.bookItemAuthor.toLowerCase().includes(querySearchBook) ||
      book.bookItemYear.toString().includes(querySearchBook)
    );
  });

  updateSearchResult(searchResult);
}

//fungsi memperbarui tampilan hasil pencarian
function updateSearchResult(results) {
  const incompleteBooks = document.getElementById("incompleteBookList");
  const completeBooks = document.getElementById("completeBookList");

  incompleteBooks.innerHTML = "";
  completeBooks.innerHTML = "";

  for (const book of results) {
    const bookItem = insertBooks(book);
    if (book.bookItemIsComplete) {
      completeBooks.appendChild(bookItem);
    } else {
      incompleteBooks.appendChild(bookItem);
    }
  }
}

//fungsi menambahkan buku kedalam list
function addBooks() {
  const bookTitle = document.getElementById("bookFormTitle").value;
  const bookAuthor = document.getElementById("bookFormAuthor").value;
  const bookYear = Number(document.getElementById("bookFormYear").value);
  const bookIsComplete = document.getElementById("bookFormIsComplete").checked;

  const generatedID = generateId();
  const bookObject = generateBooks(
    generatedID,
    bookTitle,
    bookAuthor,
    bookYear,
    bookIsComplete
  );
  books.push(bookObject);
  document.dispatchEvent(new Event(RENDER_EVENT));
  // tambahkan fungsi menyimpan data
  saveData();
}

//fungsi menambahkan buku ke daftar selesai
function addBookToCompleted(books_id) {
  const bookTarget = findBooks(books_id);
  if (bookTarget == null) return;

  bookTarget.bookItemIsComplete = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

//fungsi menghapus buku dari list
function removeBook(books_id) {
  const bookTarget = bookIndex(books_id);

  if (bookTarget === -1) return;

  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

//fungsi undo buku dari daftar selesai membaca
function undoBookFromCompleted(books_id) {
  const bookTarget = findBooks(books_id);

  if (bookTarget == null) return;
  bookTarget.bookItemIsComplete = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

//fungsi mengedit buku pada daftar

//handle fungsi submit tambah buku dan pencarian buku
document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("bookForm");
  const formSearchBook = document.getElementById("searchBook");

  if (isStorageExist()) {
    loadDataFromStorage();
  }

  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBooks();

    //mengosongkan input form setelah submit buku
    document.getElementById("bookFormTitle").value = "";
    document.getElementById("bookFormAuthor").value = "";
    document.getElementById("bookFormYear").value = "";
    document.getElementById("bookFormIsComplete").checked = false;
  });

  formSearchBook.addEventListener("submit", function (event) {
    event.preventDefault();
    searchBook();
  });

  //handle submit form untuk pencarian buku
  //const searchBook = document.getElementById("searchBook");
});

//render daftar buku setelah submit berjalan
document.addEventListener(RENDER_EVENT, function () {
  const incompleteBooks = document.getElementById("incompleteBookList");
  const completeBooks = document.getElementById("completeBookList");

  incompleteBooks.innerHTML = "";
  completeBooks.innerHTML = "";

  for (const bookItem of books) {
    const bookElement = insertBooks(bookItem);
    if (bookItem.bookItemIsComplete) {
      completeBooks.append(bookElement);
    } else {
      incompleteBooks.append(bookElement);
    }
  }
});

//menyimpan data di web storage
function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "BOOKSHELF_APPS";

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("browser tidak bisa local storage");
    return false;
  }
  return true;
}

document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
  alert("buku berhasil ditambahkan");
});

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}
