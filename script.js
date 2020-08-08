let todo = {
    data: [], // holder for todo list array
    load: function () {
        // todo.load() : attempt to load todo list from local storage

        // Init localstorage
        if (localStorage.list == undefined) {
            localStorage.list = "[]";
        }

        // Parse JSON
        // [0] = Task
        // [1] = Status : 0 not done, 1 completed, 2 cancelled
        todo.data = JSON.parse(localStorage.list);
        todo.list();
    },

    save: function () {
        // todo.save() : save the current data to local storage

        localStorage.list = JSON.stringify(todo.data);
        todo.list();
    },

    list: function () {
        // todo.list() : update todo list HTML

        // Clear the old list
        let container = document.getElementById("todo-list");
        container.innerHTML = "";

        // Rebuild list
        if (todo.data.length > 0) {
            let row = "", el = "";
            for (let key in todo.data) {
                // Row container
                row = document.createElement("div");
                row.classList.add("clearfix");
                row.dataset.id = key;

                // Item text
                el = document.createElement("div");
                el.classList.add("item");
                if (todo.data[key][1] == 1) {
                    el.classList.add("done");
                }
                if (todo.data[key][1] == 2) {
                    el.classList.add("cx");
                }
                el.innerHTML = todo.data[key][0];
                row.appendChild(el);

                // Add cancel button
                el = document.createElement("input");
                el.setAttribute("type", "button");
                el.value = "\u2716";
                el.classList.add("bdel");
                el.addEventListener("click", function () {
                    todo.status(this, 2);
                });
                row.appendChild(el);

                // Add done button
                el = document.createElement("input");
                el.setAttribute("type", "button");
                el.value = "\u2714";
                el.classList.add("bdone");
                el.addEventListener("click", function () {
                    todo.status(this, 1);
                });
                row.appendChild(el);

                // Add row to list
                container.appendChild(row);
            }
        }
    },

    add: function () {
        // todo.add() : add a new item

        todo.data.push([
            document.getElementById("todo-add").value, 0
        ]);
        document.getElementById("todo-add").value = "";
        todo.save();
    },

    status: function (el, stat) {
        // todo.status() : update item status

        const parent = el.parentElement;
        todo.data[parent.dataset.id][1] = stat;
        todo.save();
    },

    del: function (type) {
        // todo.del() : delete items

        if (confirm("Delete tasks?")) {
            // Delete all
            if (type == 0) {
                todo.data = [];
                todo.save();
            }
            // Filter, keep only not completed
            else {
                todo.data = todo.data.filter(row => row[1] == 0);
                todo.save();
            }
        }
    }
};

// Page init
window.addEventListener("load", function () {
    document.getElementById("todo-da").addEventListener("click", function () {
        todo.del(0);
    });
    document.getElementById("todo-dc").addEventListener("click", function () {
        todo.del(1);
    });
    document.getElementById("todo-form").addEventListener("submit", function (evt) {
        evt.preventDefault();
        todo.add();
    });
    todo.load();
});