function storageService(){
var reqOpen = window.indexedDB.open('rfc');
var service = {
	addBook: addBook,
	updateBook: updateBook,
	removeBook: removeBook,
	findByID: findByID,
	findByName: findByName,
	findByRef : findByRef
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
        bookStore.put(book);
    }, function (e) {
        var error = {
            name: e.target.error.name,
            message: e.target.error.message
        }
        console.log(error);
    });
}
function removeBook(book) {
    dbPromise.then(function (db) {
        var bookStore = db.transaction('books', 'readwrite').objectStore('books');
        bookStore.delete (book.id);
    }, function (e) {
        var error = {
            name: e.target.error.name,
            message: e.target.error.message
        }
        console.log(error);
    });
}
function findByID(book) {
    dbPromise.then(function (db) {
        var bookStore = db.transaction('books', 'readwrite').objectStore('books');
        return bookStore.get(book.id);
    }, function (e) {
        var error = {
            name: e.target.error.name,
            message: e.target.error.message
        }
        console.log(error);
    });
}
// Need to refine regex

function findByName(book) {
    dbPromise.then(function (db) {
        var books = [
        ];
        var bookStore = db.transaction('books', 'readwrite').objectStore('books');
        var namePromise = new Promise(function (resolve, reject) {
            bookStore.index('name').openKeyCursor().onsuccess = function (e) {
                var cursor = e.target.result;
                if (cursor) {
                    if (cursor.key.match(book.name)) {
                        books.push(cursor.value);
                    }
                    cursor.continue;
                }
            };
        });
        if (books.isEmpty()) {
            reject(books);
        }
        else {
            resolve(books);
        }
        return namePromise;
    }, function (e) {
        var error = {
            name: e.target.error.name,
            message: e.target.error.message
        }
        console.log(error);
    });
}
function findByRef(book) {
    dbPromise.then(function (db) {
        var bookStore = db.transaction('books', 'readwrite').objectStore('books');
        return bookStore.index('ref').get(book.ref);
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
window.onload = function(){
Array.prototype.isEmpty = function () {
    if (this.length == 0) {
        return true;
    }
    else {
        return false;
    };
};
var books = [
    {
        name: 'Danielson',
        ref: 42342,
        description: 'Show me some essa manyana',
        content: new Blob,
        related: [
            54566
        ]
    }
];
}