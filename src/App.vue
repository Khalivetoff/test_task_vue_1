<template>
  <div id="app">
    <div class="main-container">
      <div class="layout">
        <div class="top-content">
          <button
            class="button button_add-note"
            @click="$store.commit('showModalEditNote')"
          >
            Добавить заметку
          </button>
        </div>
        <div class="main-content">
          <div class="layout">
            <div
              class="main-content__item"
              v-for="(item, index) in main_data"
              :key="index"
            >
              <node-card
                :note_info="item"
                @delete-note="$store.commit('showModalConfirm', $event)"
                @edit-note="$store.commit('showModalEditNote', $event)"
              ></node-card>
            </div>
            <div
              class="notif-null-data"
              v-if="!main_data[0]">
              У Вас нет ни одной заметки
            </div>
          </div>
        </div>
      </div>
    </div>
    <modal-edit v-if="$store.state.modal_edit.View"></modal-edit>
    <modal-confirm
      v-if="$store.state.modal_confirm.View"
      @accept="$store.state.modal_confirm.View = false"
      @reject="$store.commit('modalAccept')"
      :modal_text="$store.state.modal_confirm.ModalText"
    ></modal-confirm>
    <notification></notification>
  </div>

</template>

<script>

    import {store} from './vuex_stores/store.js'
    import ModalConfirm from './components/modal_confirm.vue'
    import NoteCard from './components/note_card.vue'
    import Notification from './components/notification.vue'
    import ModalEdit from './components/modal_edit_note.vue'
    import {emitter} from './components/emitter'

    export default {
        name: 'app',
        store,
        components: {
            'modal-confirm': ModalConfirm,
            'node-card': NoteCard,
            'notification': Notification,
            'modal-edit': ModalEdit
        },
        computed: {
            main_data() {
                return this.$store.state.main_data
            }
        },
        created() {
            this.$store.commit('getDataLS');
        },
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
    padding: 0px 5px;
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

    .main-container .main-content {
      margin-top: 11px;
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
