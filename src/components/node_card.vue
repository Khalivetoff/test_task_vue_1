<template>
  <div class="task-card">
    <div class="container">
      <div class="task-card__layout">
        <div class="title-wrapper">
          <div class="title">{{ note_info.Name }}</div>
          <div class="task-item__control-wrapper">
            <button
              class="button button_control"
              @click="showModalConfirmDelete()"
            >
              <i class="material-icons">delete</i>
            </button>
            <button
              class="button button_control"
              @click="$root.$emit('show-modal-edit-note', note_info)"
            >
              <i class="material-icons">edit</i>
            </button>
          </div>
        </div>
        <div
          class="tasks-wrapper"
        >
          <div
            class="task-item"
            v-for="(item, index) in cutTasksArr"
            :key="index"
          >
            <div class="status-icon">
              <i class="material-icons" v-if="item.Done">done</i>
            </div>
            <div class="task-item__name">
              {{ item.Name }}
            </div>
          </div>
          <div
            class="support-text"
            v-if="note_info.Tasks.length > 4"
          >
            {{ 'скрытых задач: ' + (note_info.Tasks.length - 4)}}
          </div>
          <div
            class="notif-null-data"
            v-if="!cutTasksArr[0]"
          >
            Задачи отсутствуют
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
        props: {
            note_info: {
                type: Object,
            },
        },
        methods: {
            showModalConfirmDelete() {
                this.$root.$emit('delete-note-item', this.note_info);
            }
        },
        computed: {
            cutTasksArr() {
                return this.note_info.Tasks.slice(0, 4);
            }
        }
    }
</script>

<style scoped>

  .task-card {
    width: 100%;
    box-shadow: 0px 0px 18px rgba(0, 0, 0, 0.12);
    border-radius: 9px;
  }

  .container {
    padding: 8px 16px;
  }

  .title-wrapper {
    padding-bottom: 5px;
    border-bottom: solid 2px rgba(229, 232, 236, 0.604);
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .title-wrapper .title {
    font-size: 16px;
    font-weight: bolder;
    color: #000;
  }

  .button_control i {
    font-size: 18px;
  }

  .tasks-wrapper {
    display: flex;
    flex-direction: column;
    margin-top: 5px;
    padding: 5px 0px;
  }

  .task-item {
    color: #000;
    font-size: 16px;
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .task-item .status-icon {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-right: 5px;
    width: 24px;
    color: #bababa;

  }

  .task-item .status-icon i {
    font-size: 18px;
  }

  .task-item:not(:first-child) {
    margin-top: 8px;
  }

  .task-item__control-wrapper {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: space-between;
  }

  .support-text {
    margin-top: 8px;
    color: #b8b8b8;
  }

</style>
