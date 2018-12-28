import { Injectable } from '@angular/core';
import PouchDB from 'pouchdb';

@Injectable()
export class TarefasProvider {

  data: any;
  db: any;
  remote: any;

  constructor() {

    this.db = new PouchDB('tarefas');

    this.remote = 'http://localhost:5984/tarefas';

    let options = {
      live: true,
      retry: true
    };

    this.db.sync(this.remote, options);

  }

  buscarTarefas() {
    if (this.data) {
      return Promise.resolve(this.data);
    }

    return new Promise(resolve => {
      this.db.allDocs({
        include_docs: true
      }).then((result) => {
        this.data = [];

        let docs = result.rows.map((row) => {
          this.data.push(row.doc);
        });

        resolve(this.data);

        this.db.changes({ live: true, since: 'now', include_docs: true }).on('change', (change) => {
          this.handleChange(change);
        });

      }).catch((error) => {
        console.log(error);
      });
    });
  }

  criar(tarefa) {
    this.db.post(tarefa);
  }

  atualizar(tarefa) {
    this.db.put(tarefa).catch((err) => {
      console.log(err);
    });
  }

  apagar(tarefa) {
    this.db.remove(tarefa).catch((err) => {
      console.log(err);
    });
  }

  handleChange(change) {
    
    let changedDoc = null;
    let changedIndex = null;

    this.data.forEach((doc, index) => {
      if (doc._id === change.id) {
        changedDoc = doc;
        changedIndex = index;
      }
    });

    if (change.deleted) {
      this.data.splice(changedIndex, 1);
    }
    else {
      if (changedDoc) {
        this.data[changedIndex] = change.doc;
      }else {
        this.data.push(change.doc);
      }
    }

  }

}
