<template>
  <div id="app">
    <div class="main-container">
      <div class="layout">
        <div class="top-content">
          <button
            class="button button_add-note"
            @click="$root.$emit('show-modal-edit-note')"
          >
            Добавить заметку
          </button>
        </div>
        <div class="main-content">
          <div class="layout">
            <div
              class="main-content__item"
              v-for="(item, index) in data_from_ls"
              :key="index"
            >
              <node-card
                :note_info="item"
              ></node-card>
            </div>
            <div
              class="notif-null-data"
              v-if="!data_from_ls[0]">
              У Вас нет ни одной заметки
            </div>
          </div>
        </div>
      </div>
    </div>
    <modal-confirm
      v-if="show_modal_confirm"
      @reject="closeModalConfirm()"
      @accept="accept()"
      :modal_text="modal_text"
    ></modal-confirm>
    <modal-edit
      v-if="show_modal_edit_note"
      :edit_note="edit_note"
      :modal_title="modal_edit_title"
      @change-edit="saveEditNote($event)"
      @close-modal="closeModalEditNote()"
    ></modal-edit>
    <notification></notification>
  </div>
</template>

<script>

    import ModalConfirm from './components/modal_confirm.vue'
    import NodeCard from './components/node_card.vue'
    import Notification from './components/notification.vue'
    import ModalEdit from './components/modal_edit_note.vue'

    export default {
        name: 'app',
        components: {
            'modal-confirm': ModalConfirm,
            'node-card': NodeCard,
            'notification': Notification,
            'modal-edit': ModalEdit
        },
        data() {
            return {
                data_from_ls: [],
                note_id_arr: [],

                show_modal_confirm: false,
                modal_text: null,

                confirm_delete: false,

                show_modal_edit_note: false,
                modal_edit_title: 'Редактирование заметки',

                edit_note: {
                    Name: '',
                    Tasks: []
                },
                edit_note_empty: {
                    Name: '',
                    Tasks: []
                },
            }
        },
        methods: {
            /**В ТЗ сказано, что после перезагрузки стр. данные должны быть сохранены.
             * Для этого при первой загрузке app из LS берутся эти самые данные.
             * При каждом изменении данных они сохраняются в LS.*/
            //в начале получим из LS данные
            getDataLS() {
                this.data_from_ls = JSON.parse(localStorage.getItem('data_from_ls'));
                !this.data_from_ls ? this.data_from_ls = [] : 0;
                //своеобразная чекалка id, замена бэка
                this.note_id_arr = this.data_from_ls.map(item => {
                    return item.NoteID;
                })
                console.log(this.data_from_ls);
            },
            //при изменении данных вносим их в LS
            setDataLS() {
                localStorage.setItem('data_from_ls', JSON.stringify(this.data_from_ls));
            },
            //delete note-------------------------------------
            accept() {
                if (this.show_modal_edit_note) {
                    if (this.confirm_delete) {
                        this.deleteNote();
                    }
                    this.closeModalEditNote();
                    this.show_modal_confirm = false;
                } else {
                    this.deleteNote();
                }
                this.confirm_delete = false;
            },
            deleteNote() {
                this.data_from_ls = this.data_from_ls.filter(item => {
                    return item.NoteID !== this.edit_note.NoteID;
                })
                this.note_id_arr = this.note_id_arr.filter(item => {
                    return item !== this.edit_note.NoteID;
                })
                this.setDataLS();
                this.$root.$emit('notification', 'Заметка успешно удалена', 'success');
                this.show_modal_confirm = false;
                this.edit_note = JSON.parse(JSON.stringify(this.edit_note_empty));
            },
            //-------------------------------------------------
            //edit/create note---------------------------------
            closeModalEditNote() {
                this.show_modal_edit_note = false;
                this.edit_note = JSON.parse(JSON.stringify(this.edit_note_empty));
            },
            saveEditNote(note_data) {
                let note_data_local = JSON.parse(JSON.stringify(note_data));
                if (note_data_local.NoteID == undefined) {
                    //своеобразная чекалка id, замена бэка
                    let counter = 0;
                    while (this.note_id_arr.includes(counter)) {
                        counter++;
                    }
                    this.note_id_arr.push(counter);

                    this.$set(note_data_local, 'NoteID', counter);
                    this.data_from_ls.push(note_data_local);
                    this.closeModalEditNote();
                    this.$root.$emit('notification', 'Заметка успешно добавлена', 'success');
                } else {
                    for (let item of this.data_from_ls) {
                        if (item.NoteID == note_data_local.NoteID) {
                            item.Name = note_data_local.Name;
                            item.Tasks = note_data_local.Tasks;
                        }
                    }
                    this.$root.$emit('notification', 'Заметка успешно изменена', 'success');
                }
                this.setDataLS();
            },
            //-------------------------------------------------
            closeModalConfirm() {
                this.show_modal_confirm = false;
                this.edit_note = JSON.parse(JSON.stringify(this.edit_note_empty));
            }
        },
        mounted() {
            this.getDataLS();
            this.$root.$on('delete-note-item', (note_info) => {
                this.edit_note = note_info;
                this.modal_text = 'Удалить заметку?';
                this.confirm_delete = true;
                this.show_modal_confirm = true;
            })
            this.$root.$on('confirm-close-modal-edit', () => {
                this.modal_text = 'Закрыть окно редактирования?';
                this.confirm_delete = false;
                this.show_modal_confirm = true;
            })
            this.$root.$on('show-modal-edit-note', (val) => {
                if (val) {
                    this.modal_edit_title = 'Редактирование заметки';
                    this.edit_note = val;
                } else {
                    this.modal_edit_title = 'Добавление заметки';
                }
                this.show_modal_edit_note = true;
            })
        }
    }
</script>

<style>

  * {
    margin: 0px;
  }

  body {
    min-width: 320px;
  }

  * {
    box-sizing: border-box;
  }

  .notif-null-data {
    color: #e5539a;
    font-weight: bolder;
  }

  .button {
    color: #bababa;
    background: transparent;
    outline: none;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    padding: 5px;
    transition: .3s;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }

  .button:hover {
    background: #ededed;
    color: #000;
  }

  .button:active {
    background: #dbdbdb;
  }

  .modal-wrapper {
    background: rgba(0, 0, 0, 0.45);
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    z-index: 100;
  }

  .modal {
    background: #fff;
    box-shadow: 0px 0px 18px rgba(0, 0, 0, 0.12);
    border-radius: 9px;
    max-width: 800px;
    width: auto;
    overflow: hidden;
  }

  .modal__button {
    width: 55px;
    height: 55px;
  }

  .modal__button > i {
    font-size: 40px;
    user-select: none;
  }

  .main-container {
    z-index: 5;
    position: relative;
    padding: 24px;
  }

  .main-container .top-content {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
  }

  .main-container .button_add-note {
    padding: 8px 16px;
    font-size: 14px;
    text-transform: uppercase;
    font-weight: 600;
  }

  .main-container .main-content {
    margin-top: 18px;
  }

  .main-container .main-content .layout {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }

  .main-content__item {
    padding: 5px;
    min-width: 25%;
    max-width: 25%;
  }

  @media (max-width: 959px) {
    .main-container {
      padding: 16px;
    }

    .main-content__item {
      min-width: 33.33333333%;
      max-width: 33.33333333%;
    }
  }

  @media (max-width: 768px) {
    .main-content__item {
      min-width: 50%;
      max-width: 50%;
    }
  }

  @media (max-width: 599px) {
    .main-content__item {
      min-width: 100%;
      max-width: 100%;
    }
  }

</style>
