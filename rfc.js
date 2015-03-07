function storageService() {
    var reqOpen = window.indexedDB.open('rfc');
    var service = {
        addBook: addBook,
        updateBook: updateBook,
        removeBook: removeBook,
        findByID: findByID,
        findByName: findByName,
        findByRef: findByRef
    };
    var dbPromise = new Promise(function (resolve, reject) {
        reqOpen.onsuccess = function (e) {
            var db = e.target.result;
            resolve(db);
            db.onerror = function (e) {
                var error = {
                    name: e.target.error.name,
                    message: e.target.error.message
                }
                console.log(error);
            };
        };
        reqOpen.onerror = function (e) {
            reject(e);
        };
        reqOpen.onupgradeneeded = function (e) {
            var bookStore = e.target.result.createObjectStore('books', {
                autoIncrement: true,
                keyPath: 'id'
            });
            bookStore.createIndex('ref', 'ref', {
                unique: true
            });
            bookStore.createIndex('name', 'name', {
                unique: false
            });
        };
    });
    function addBook(book) {
        dbPromise.then(function (db) {
            var bookStore = db.transaction('books', 'readwrite').objectStore('books');
            bookStore.add(book);
        }, function (e) {
            var error = {
                name: e.target.error.name,
                message: e.target.error.message
            }
            console.log(error);
        });
    }
    function updateBook(book) {
        dbPromise.then(function (db) {
            var bookStore = db.transaction('books', 'readwrite').objectStore('books');
            bookStore.get(parseInt(book.id)).onsuccess = function (e) {
                var dbbook = e.target.result;
                dbbook.name = book.name;
                dbbook.ref = book.ref;
                dbbook.description = book.description;
                dbbook.content = book.content;
                dbbook.related = book.related;
                bookStore.put(dbbook);
            };
        }, function (e) {
            var error = {
                name: e.target.error.name,
                message: e.target.error.message
            }
            console.log(error);
        });
    }
    function removeBook(id) {
        dbPromise.then(function (db) {
            var bookStore = db.transaction('books', 'readwrite').objectStore('books');
            bookStore.delete (id);
        }, function (e) {
            var error = {
                name: e.target.error.name,
                message: e.target.error.message
            }
            console.log(error);
        });
    }
    function findByID(id) {
        return dbPromise.then(function (db) {
            var bookPromise = new Promise(function (resolve) {
                var bookStore = db.transaction('books', 'readwrite').objectStore('books');
                bookStore.get(id).onsuccess = function (e) {
                    resolve(e.target.result);
                };
            });
            return bookPromise;
        }, function (e) {
            var error = {
                name: e.target.error.name,
                message: e.target.error.message
            }
            console.log(error);
        });
    }
    // Need to refine regex

    function findByName(name) {
        return dbPromise.then(function (db) {
            var booksPromise = new Promise(function (resolve) {
                var books = [
                ];
                var bookStore = db.transaction('books', 'readwrite').objectStore('books');
                bookStore.index('name').openCursor().onsuccess = function (e) {
                    var cursor = e.target.result;
                    if (cursor) {
                        if (name != null && cursor.key.match(name)) {
                            books.push(cursor.value);
                        }
                        else if (name == null) {
                            books.push(cursor.value);
                        }
                        cursor.continue ();
                    }
                    else {
                        resolve(books);
                    }
                };
            });
            return booksPromise;
        }, function (e) {
            var error = {
                name: e.target.error.name,
                message: e.target.error.message
            }
            console.log(error);
        });
    }
    function findByRef(ref) {
        return dbPromise.then(function (db) {
            var bookPromise = new Promise(function (resolve) {
                var bookStore = db.transaction('books', 'readwrite').objectStore('books');
                bookStore.index('ref').get(ref).onsuccess = function (e) {
                    resolve(e.target.result);
                };
            });
            return bookPromise;
        }, function (e) {
            var error = {
                name: e.target.error.name,
                message: e.target.error.message
            }
            console.log(error);
        });
    }
    return service;
}
function sideController(storageService) {
    var service = storageService();
    var savebutton = document.getElementById('save');
    var updatebutton = document.getElementById('update');
    var deletebutton = document.getElementById('delete');
    listBooks();
    function listBooks() {
        service.findByName(null).then(function (books) {
            var ul = document.createElement('ul');
            books.forEach(function (book) {
                var li = document.createElement('li');
                li.classList.add('stylelist');
                if (book.name) {
                    li.innerHTML = book.name;
                }
                else {
                    li.innerHTML = book.ref;
                }
                li.addEventListener('click', function () {
                    var mainframe = document.getElementById('mainframe');
                    var url = window.URL.createObjectURL(book.content);
                    var relatedItems = '';
                    // book.related.forEach(function(item){ relatedItems += item + " "});
                    mainframe.src = url;
                    document.getElementById('dbID').value = book.id;
                    document.getElementById('name').value = book.name;
                    document.getElementById('description').value = book.description;
                    document.getElementById('ref').value = book.ref;
                    document.getElementById('content').files[0] = book.content;
                    document.getElementById('related').value = relatedItems;
                });
                ul.appendChild(li);
            });
            var booklist = document.getElementById('booklist');
            booklist.appendChild(ul);
        });
    }
    savebutton.addEventListener('click', function () {
        service.addBook({
            name: document.getElementById('name').value,
            description: document.getElementById('description').value,
            ref: document.getElementById('ref').value,
            content: document.getElementById('content').files[0],
            related: document.getElementById('related').value
        })
    });
    updatebutton.addEventListener('click', function () {
        service.updateBook({
            id: document.getElementById('dbID').value,
            name: document.getElementById('name').value,
            description: document.getElementById('description').value,
            ref: document.getElementById('ref').value,
            content: document.getElementById('content').files[0],
            related: document.getElementById('related').value
        })
    });
    deletebutton.addEventListener('click', function () {
        service.removeBook(3);
    });
}
window.onload = function () {
    sideController(storageService);
}
