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
function widgetService() {
    var service = {
        addDockItem: addDockItem,
        addDockItem2: addDockItem2
    }
    function addDockItem(bgcolor, bcolor, callback) {
        var dock = document.getElementById('dock');
        var div = document.createElement('div');
        div.classList.add('dockItem', 'fa');
        div.style.background = bgcolor;
        div.style.borderColor = bcolor;
        div.addEventListener('click', callback);
        // div.addEventListener('mouseover',function(e){this.style.background = '#FF44be'});
        // div.addEventListener('mouseleave',function(e){this.style.background = bgcolor});
        dock.appendChild(div);
        return div;
    }
    function addDockItem2(options) {
        var dock = document.getElementById('dock');
        var div = document.createElement('div');
        if (options.active == false) {
            div.classList.add('disabled');
        }
        div.classList.add('dockItem', 'fa');
        div.style.borderColor = options.icon.border;
        div.addEventListener('click', options.click);
        // div.addEventListener('mouseover',function(e){this.style.background = '#FF44be'});
        // div.addEventListener('mouseleave',function(e){this.style.background = bgcolor});
        dock.appendChild(div);
        return div;
    }
    return service
}
function sideController(storageService) {
    var service = storageService();
    var widget = widgetService();
    var divfile = document.getElementById('divfile');
    var content = document.getElementById('content');
    divfile.addEventListener('click', function (e) {
        content.click();
    });
    content.addEventListener('change', function (e) {
        if (e.target.files[0]) {
            divfile.innerHTML = e.target.files[0].name;
        }
        else {
            divfile.innerHTML = 'Selected file';
        }
    });
    listBooks();
    function listBooks() {
        service.findByName(null).then(function (books) {
            var ul = document.createElement('ul');
            ul.classList.add('styleul');
            books.forEach(function (book) {
                var li = document.createElement('li');
                li.classList.add('styleli');
                if (book.name) {
                    li.innerHTML = book.name.toUpperCase();
                }
                else {
                    li.innerHTML = book.ref;
                }
                li.addEventListener('click', function () {
                    var mainframe = document.getElementById('mainframe');
                    var url;
                    if (book.content instanceof Blob) {
                        url = window.URL.createObjectURL(book.content);
                    }
                    else {
                        url = '';
                    }
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
            var widgetList = widget.addDockItem('rgba(73, 255, 69, 0.41)', 'rgba(6, 255, 0, 0.98)', function (e) {
                return;
            });
            widgetList.appendChild(ul);
        });
    }
    widget.addDockItem('rgba(73, 255, 69, 0.41)', 'rgba(6, 255, 0, 0.98)', function (e) {
        service.addBook({
            name: document.getElementById('name').value,
            description: document.getElementById('description').value,
            ref: document.getElementById('ref').value,
            content: document.getElementById('content').files[0],
            related: document.getElementById('related').value
        })
    }).innerHTML = 'Add';
    widget.addDockItem('rgba(36, 103, 250, 0.25)', 'rgba(36, 47, 255, 0.45)', function (e) {
        service.updateBook({
            id: document.getElementById('dbID').value,
            name: document.getElementById('name').value,
            description: document.getElementById('description').value,
            ref: document.getElementById('ref').value,
            content: document.getElementById('content').files[0],
            related: document.getElementById('related').value
        })
    }).innerHTML = 'Update';
    widget.addDockItem('rgba(255, 73, 73, 0.6)', '#FF4444', function (e) {
        var id = parseInt(document.getElementById('dbID').value);
        service.removeBook(id);
    }).innerHTML = 'Remove';
}
window.onload = function () {
    sideController(storageService);
}
