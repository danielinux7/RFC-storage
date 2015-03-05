var mainModule = function module() {
    this.mainController = {
        // Shared scope variables and functions. (closures)
        navController: function () {
            console.log('show me some controller');
        },
        asideController: function () {
        },
        articleController: function () {
        }
    },
    this.mainService = new function(){
        // Shared scope variables and functions. (closures)
        var reqOpen = window.indexedDB.open('rfc');
        var dbPromise = new Promise(function (resolve, reject) {
            reqOpen.onsuccess = function (e) {
                resolve(e.target.result);
            };
            reqOpen.onerror = function (e) {
                reject(e);
            };
        });
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
        function handleDBErrors(dbPromise) {
            dbPromise.then(function (db) {
                db.onerror = function (e) {
                    var error = {
                        name: e.target.error.name,
                        message: e.target.error.message
                    }
                    console.log(error);
                };
            });
        }
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
        function updateBook(book, dbPromise) {
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
            dbPromise.then(function (db) {
                var bookStore = db.transaction('books', 'readwrite').objectStore('books');
                return bookStore.get(id);
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
            dbPromise.then(function (db) {
                var books = [
                ];
                var bookStore = db.transaction('books', 'readwrite').objectStore('books');
                var namePromise = new Promise(function (resolve, reject) {
                    bookStore.index('name').openKeyCursor().onsuccess = function (e) {
                        var cursor = e.target.result;
                        if (cursor) {
                            if (cursor.key.match(name)) {
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
        function findByRef(ref) {
            dbPromise.then(function (db) {
                var bookStore = db.transaction('books', 'readwrite').objectStore('books');
                return bookStore.index('ref').get(ref);
            }, function (e) {
                var error = {
                    name: e.target.error.name,
                    message: e.target.error.message
                }
                console.log(error);
            });
        }
        handleDBErrors(dbPromise);
        this.navService = new function () {
            console.log('show me some service');
        },
        this.asideService = new function () {
        	this.addBook = addBook;
        },
        this.articleService = new function () {
        }
    }
};
var navModule = function navModule(controller, service) {
    // Nav scope variables and functions. (closures)
    this.navController = controller,
    this.navService = service
};
var asideModule = function asideModule(controller, service) {
    // Aside scope variables and functions. (closures)
    this.asideController = controller,
    this.asideService = service
};
var articleModule = function articleModule(controller, service) {
    // Article scope variables and functions. (closures)
    this.articleController = controller,
    this.articleService = service
};
// Entry point.
window.onload = function () {
    Array.prototype.isEmpty = function () {
        if (this.length == 0) {
            return true;
        }
        else {
            return false;
        };
    };
    mainModule = new mainModule;
    var mainController = mainModule.mainController;
    var mainService = mainModule.mainService;
    navModule = new navModule(mainController.navController, mainService.navService);
    asideModule = new asideModule(mainController.asideController, mainService.asideService);
    articleModule = new articleModule(mainController.articleController, mainService.articleService);
//     var books = [
//     {
//         name: 'Danielson',
//         ref: 42342,
//         description: 'Show me some essa manyana',
//         content: new Blob,
//         related: [
//             54566
//         ]
//     }
// ];
//     asideModule.asideService.addBook(books[0]);
}

