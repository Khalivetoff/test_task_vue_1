<template>
  <div class="modal-wrapper">
    <div class="modal">
      <div class="modal-create-note__layout">
        <div class="layout-row modal-create-note__title">
          <div class="title__text">{{ $store.state.modal_edit.TitleText }}</div>
        </div>
        <div class="modal-create-note__main-content">
          <div class="main-content__container">
            <div class="main-content__layout">
              <div class="layout-row name-block">
                <input
                  class="text-input"
                  type="text"
                  v-model="edit_note_local.Name"
                  placeholder="Название заметки"
                >
                <div class="control-wrapper" v-if="edit_note_local.NoteID !== null">
                  <button
                    v-if="data_is_changed.Forward"
                    class="button"
                    @click="returnData('back')"
                  >
                    <i class="material-icons">chevron_left</i>
                  </button>
                  <button
                    v-else-if="data_is_changed.Back"
                    class="button"
                    @click="returnData('forward')"
                  >
                    <i class="material-icons">chevron_right</i>
                  </button>
                </div>
              </div>
              <div class="tasks-block">
                <div class="tasks-block__title">
                  <div>Пункты</div>
                  <button
                    class="button"
                    @click="addTaskInNote()"
                  >
                    <i class="material-icons">add_circle_outline</i>
                  </button>
                </div>
                <div class="tasks-block-item-wrapper">
                  <div
                    class="tasks-block__item"
                    v-for="(item, index) in edit_note_local.Tasks"
                    :key="index"
                  >
                    <input
                      v-show="edit_note_local.NoteID !== null"
                      type="checkbox"
                      v-model="item.Done"
                    >
                    <input
                      class="text-input"
                      type="text"
                      v-model="item.Name"
                      placeholder="Название задачи"
                    >
                    <button
                      class="button"
                      @click="deleteTaskFromNote(index, item.TaskID)"
                    >
                      <i class="material-icons">clear</i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-create-note__footer">
          <button
            v-show="edit_note_local.NoteID !== null"
            class="button modal__button"
            @click="$store.commit('showModalConfirm', edit_note_local)"
          >
            <i class="material-icons">delete</i>
          </button>
          <button
            class="button modal__button"
            @click="$store.commit('showModalConfirm')"
          >
            <i class="material-icons">clear</i>
          </button>
          <button
            class="button modal__button"
            @click="saveNote()"
          >
            <i class="material-icons">done</i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
    import {emitter} from '../components/emitter.js'
  export default {
      data() {
          return {
              tasks_id_arr: [],
              data_is_changed: {
                  Back: false,
                  Forward: false
              },
              edit_note_local_temp_1: JSON.parse(JSON.stringify(this.$store.state.modal_edit.Value)),
              edit_note_local_temp_2: JSON.parse(JSON.stringify(this.$store.state.modal_edit.Value)),
              edit_note_local: JSON.parse(JSON.stringify(this.$store.state.modal_edit.Value))
          }
      },
      methods: {
          returnData(type) {
              if (type == 'back') {
                  this.edit_note_local = JSON.parse(JSON.stringify(this.edit_note_local_temp_1));
                  this.data_is_changed.Forward = false;
                  this.data_is_changed.Back = true;
              } else if (type == 'forward') {
                  this.edit_note_local = JSON.parse(JSON.stringify(this.edit_note_local_temp_2));
                  this.data_is_changed.Forward = true;
                  this.data_is_changed.Back = false;
              }
              this.$store.commit('saveNote', this.edit_note_local);
          },
          addTaskInNote() {
              let task_id = 0;
              while (this.tasks_id_arr.includes(task_id)) {
                  task_id++;
              }
              this.edit_note_local.Tasks.push({
                  TaskID: task_id,
                  Name: '',
                  Done: false
              })
              this.tasks_id_arr.push(task_id);
          },
          deleteTaskFromNote(index, task_id) {
              this.edit_note_local.Tasks.splice(index, 1);
              this.tasks_id_arr = this.tasks_id_arr.filter(item => {return item !== task_id});
          },
          saveNote() {
              if (this.edit_note_local.Name == '') {
                  emitter.$emit('notification', 'Чтобы сохранить заметку, необходимо ввести ее название', 'error');
                  return;
              } else if (this.edit_note_local.Tasks.some(item => {return item.Name == ''})) {
                  emitter.$emit('notification', 'Все пункты заметки должны иметь название', 'error');
                  return;
              }
              this.edit_note_local_temp_1 = JSON.parse(JSON.stringify(this.edit_note_local_temp_2));
              this.data_is_changed.Forward = true;
              this.data_is_changed.Back = false;
              this.edit_note_local_temp_2 = JSON.parse(JSON.stringify(this.edit_note_local));
              console.log(this.edit_note_local);
              this.$store.commit('saveNote', this.edit_note_local);
          },
      },
      mounted() {
          this.tasks_id_arr = this.edit_note_local.Tasks.map(item => {
              return item.TaskID;
          })
      }
  }
</script>
<style>

  .layout-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    flex-wrap: nowrap;
  }

  .modal-create-note__title {
    background: #f0f0f0;
    padding: 15px;
  }

  .modal-create-note__title > .title__text {
    font-size: 20px;
    font-weight: bolder;
  }

  .main-content__container {
    padding: 10px 15px 15px;
  }

  .name-block {
    margin-top: 5px;
    height: 34px;
  }

  .text-input {
    border: solid 1px #d9d7d7;
    outline: none;
    padding: 5px;
    border-radius: 6px;
    transition: .2s;
  }

  .text-input:focus {
    border-color: #a1a1a1;
  }

  .control-wrapper {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .tasks-block {
    margin-top: 5px;
  }

  .tasks-block__title {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .tasks-block__title > div:first-child {
    font-weight: bold;
  }

  .tasks-block-item-wrapper {
    max-height: 204px;
    min-height: 204px;
    min-width: 255px;
    overflow-y: auto;
  }

  .tasks-block__item {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: nowrap;
  }

  .tasks-block__item:not(:first-child) {
    margin-top: 8px;
  }

  .tasks-block__item > input {
    margin-right: 5px;
  }

  .modal-create-note__footer {
    padding: 0px 15px 15px;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: end;
  }
</style>
