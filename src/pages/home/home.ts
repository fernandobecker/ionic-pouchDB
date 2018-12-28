import { Component } from "@angular/core";
import { NavController, AlertController } from 'ionic-angular';
import { TarefasProvider } from '../../providers/tarefas/tarefas';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  tarefas: any;

  constructor(public navCtrl: NavController, public tarefasService: TarefasProvider, public alertCtrl: AlertController) {

  }

  ionViewDidLoad(){
    this.tarefasService.buscarTarefas().then((data) => {
      this.tarefas = data;
    });
  }

  doRefresh(refresher){
    this.tarefasService.buscarTarefas().then((data) => {
      this.tarefas = data;
    });
    refresher.complete();
  }

  criar(){

    let prompt = this.alertCtrl.create({
      title: 'Adicionar',
      message: 'O que você gostaria de fazer ?',
      inputs: [
        {
          name: 'title'
        }
      ],
      buttons: [
        {
          text: 'Cancelar'
        },
        {
          text: 'Salvar',
          handler: data => {
            this.tarefasService.criar({title: data.title});
          }
        }
      ]
    });

    prompt.present();

  }

  atualizar(tarefa){

    let prompt = this.alertCtrl.create({
      title: 'Editar',
      message: 'Mudou de ideia ?',
      inputs: [
        {
          name: 'title'
        }
      ],
      buttons: [
        {
          text: 'Cancelar'
        },
        {
          text: 'Salvar',
          handler: data => {
            this.tarefasService.atualizar({
              _id: tarefa._id,
              _rev: tarefa._rev,
              title: data.title
            });
          }
        }
      ]
    });

    prompt.present();
  }

  apagar(tarefa){
    this.tarefasService.apagar(tarefa);
  }

}
