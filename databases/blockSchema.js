import Realm from 'realm';

// define all schemas
export const TODOLIST_SCHEMA = 'TodoList';
export const TODO_SCHEMA = 'Todo';

// define models and their properties
export const TodoSchema = {
  name: TODO_SCHEMA,
  primaryKey: 'id',
  properties: {
    id: 'int', //primary key
    name: {
      type: 'string',
      indexed: true,
    },
    done: {
      type: 'bool',
      default: false,
    },
  },
};

export const TodoListSchema = {
  name: TODOLIST_SCHEMA,
  primaryKey: 'id',
  properties: {
    id: 'int', //primary key
    name: 'string',
    creationDate: 'date',
    todo: {
      type: 'list',
      objectType: TODO_SCHEMA,
    },
  },
};

const databaseOptions = {
  path: 'todoListApp.realm',
  schema: [TodoListSchema, TodoSchema],
  schemaVersion: 0, //optional which is important for migration
};

// functions for TododLists
/** resolve if succeful, reject if there is an error */
export const insertNewTodList = newTodoList =>
  new Promise((resolve, reject) => {
    Realm.open(databaseOptions)
      .then(realm => {
        realm.write(() => {
          realm.create(TODOLIST_SCHEMA, newTodoList);
          console.log(newTodoList);
          resolve(newTodoList);
        });
      })
      .catch(error => reject(error));
  });

// objectForPrimaryKey helps in getting a TodoList for a specific ID
export const updateTodoList = todoList =>
  new Promise((resolve, reject) => {
    Realm.open(databaseOptions)
      .then(realm => {
        realm.write(() => {
          let updatingTodoList = realm.objectForPrimaryKey(
            TODOLIST_SCHEMA,
            todoList.id,
          );
          updateTodoList.name = todoList.name;
          resolve();
        });
      })
      .catch(error => reject(error));
  });

export const deleteTodoList = todoListId =>
  new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
      realm
        .write(() => {
          let deletingTodoLost = realm.objectForPrimaryKey(
            TODOLIST_SCHEMA,
            todoListId,
          );
          realm.delete(deleteTodoList);
          resolve();
        })
        .catch(error => reject(error));
    });
  });

export const deleteAllTodoLists = () =>
  new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
      realm
        .write(() => {
          let allTodoList = realm.objects(TODOLIST_SCHEMA);
          realm.delete(allTodoList);
          resolve(allTodoList);
        })
        .catch(error => reject(error));
    });
  });

export const queryAllTodoLists = () =>
  new Promise((resolve, reject) => {
    Realm.open(databaseOptions)
      .then(realm => {
        let allTodoLists = realm.objects(TODOLIST_SCHEMA);
        resolve(allTodoLists);
      })
      .catch(error => reject(error));
  });

export default new Realm(databaseOptions);
