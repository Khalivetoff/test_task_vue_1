<template>
  <div class="modal-wrapper">
    <div class="modal">
      <div class="modal-create-note__layout">
        <div class="layout-row modal-create-note__title">
          <div class="title__text">{{ modal_title }}</div>
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
                <div class="control-wrapper" v-if="edit_note_local.NoteID !== undefined">
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
                      v-if="edit_note_local.NoteID !== undefined"
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
                      @click="edit_note_local.Tasks.splice(index, 1)"
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
            v-if="edit_note_local.NoteID !== undefined"
            class="button modal__button"
            @click="deleteNote()"
          >
            <i class="material-icons">delete</i>
          </button>
          <button
            class="button modal__button"
            @click="closeModalEditNote()"
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
  export default {
      props: {
          modal_title: {},
          edit_note: {},
      },
      data() {
          return {
              edit_note_local: JSON.parse(JSON.stringify(this.edit_note)),
              tasks_id_arr: [],
              edit_note_local_temp_1: JSON.parse(JSON.stringify(this.edit_note)),
              edit_note_local_temp_2: JSON.parse(JSON.stringify(this.edit_note)),
              data_is_changed: {
                  Back: false,
                  Forward: false
              }
          }
      },
      methods: {
          test() {
              console.log('test()');
          },
          returnData(type) {
              if (type == 'back') {
                  this.edit_note_local = JSON.parse(JSON.stringify(this.edit_note_local_temp_1));
                  this.$emit('change-edit', this.edit_note_local);
                  this.data_is_changed.Forward = false;
                  this.data_is_changed.Back = true;
              } else if (type == 'forward') {
                  this.edit_note_local = JSON.parse(JSON.stringify(this.edit_note_local_temp_2));
                  this.$emit('change-edit', this.edit_note_local);
                  this.data_is_changed.Forward = true;
                  this.data_is_changed.Back = false;
              }
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
          saveNote() {
              if (this.edit_note_local.Name == '') {
                  this.$root.$emit('notification', 'Чтобы сохранить заметку, необходимо ввести ее название', 'error');
                  return;
              } else if (this.edit_note_local.Tasks.some(item => {return item.Name == ''})) {
                  this.$root.$emit('notification', 'Все пункты заметки должны иметь название', 'error');
                  return;
              }
              this.edit_note_local_temp_1 = JSON.parse(JSON.stringify(this.edit_note_local_temp_2));
              this.data_is_changed.Forward = true;
              this.data_is_changed.Back = false;
              this.edit_note_local_temp_2 = JSON.parse(JSON.stringify(this.edit_note_local));
              this.$emit('change-edit', this.edit_note_local);
          },
          closeModalEditNote() {
              if (this.edit_note_local.NoteID == undefined) {
                  this.$emit('close-modal');
              } else {
                  this.$root.$emit('confirm-close-modal-edit');
              }
          },
          deleteNote() {
              this.$root.$emit('delete-note-item', this.edit_note_local);
          }
      },
      mounted() {
          this.tasks_id_arr = this.edit_note.Tasks.map(item => {
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
