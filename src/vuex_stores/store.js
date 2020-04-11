import Vue from 'vue';
import Vuex from 'vuex';
import {emitter} from '../components/emitter.js'

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    main_data: [],
    tasks_id_arr: [],

    modal_edit: {
      View: false,
      TitleText: '',
      Value: {
        NoteID: null,
        Name: '',
        Tasks: []
      }
    },
    modal_edit_empty: {
      View: false,
      TitleText: '',
      Value: {
        NoteID: null,
        Name: '',
        Tasks: []
      }
    },

    modal_confirm: {
      View: false,
      Type: null,
      ModalText: ''
    },
    modal_confirm_empty: {
      View: false,
      Type: null,
      ModalText: ''
    },

  },
  mutations: {
    /**В ТЗ сказано, что после перезагрузки сайта, данные должны сохранятся
     * Для этого я юзаю LS
     * При первой загрузке данные берутся из LS
     * Затем они туда сохраняются*/
    getDataLS(state) {
      let data = JSON.parse(localStorage.getItem('data_from_ls'));
      !data ? data = [] : 0;
      state.tasks_id_arr = data.map(item => {
        return item.NoteID
      });
      state.main_data = data;
      emitter.$emit('change-main-data', state.main_data);
    },
    setDataLS(state) {
      emitter.$emit('change-main-data', state.main_data);
      localStorage.setItem('data_from_ls', JSON.stringify(state.main_data));
    },

    saveNote(state, note_data) {
      if (note_data.NoteID == null) {
        let count = 0;
        while (state.tasks_id_arr.includes(count)) count++;
        state.tasks_id_arr.push(count);
        note_data.NoteID = count;
        state.main_data.push(note_data);
        emitter.$emit('notification', 'Заметка успешно добавлена', 'success');
        state.modal_edit.View = false;
      } else {
        for (let item of state.main_data) {
          if (item.NoteID == note_data.NoteID) {
            item.Name = JSON.parse(JSON.stringify(note_data.Name));
            item.Tasks = JSON.parse(JSON.stringify(note_data.Tasks));
          }
        }
        emitter.$emit('notification', 'Заметка успешно изменена', 'success');
      }
      this.commit('setDataLS');
    },
    //открытие модального окна редактирирования/создания заметки
    showModalEditNote(state, note_data) {
      if (note_data) {
        state.modal_edit.Value = note_data;
        state.modal_edit.TitleText = 'Редактирование заметки';
      } else {
        state.modal_edit.Value = JSON.parse(JSON.stringify(state.modal_edit_empty.Value));
        state.modal_edit.TitleText = 'Добавление заметки';
      }
      state.modal_edit.View = true;
    },

    //открытие модалки подтверждения
    showModalConfirm(state, note_data) {
      if (note_data) {
        state.modal_confirm.ModalText = 'Удалить заметку?';
        state.modal_confirm.Type = 'delete';
        state.modal_edit.Value = note_data;
        state.modal_confirm.View = true;
      } else {
        state.modal_edit.Value.NoteID == null ? state.modal_confirm.ModalText = 'Закрыть окно создания?' :
          state.modal_confirm.ModalText = 'Закрыть окно редактирования?';
        state.modal_confirm.Type = 'close';
        state.modal_confirm.View = true;
      }
    },
    //удаление заметки
    deleteNote(state) {
      for (let item = 0; item < state.main_data.length; item++) {
        if (state.main_data[item].NoteID == state.modal_edit.Value.NoteID) {
          state.main_data.splice(item, 1);
        }
        if (state.tasks_id_arr[item] == state.modal_edit.Value.NoteID) {
          state.tasks_id_arr.splice(item, 1);
        }
      }
      state.modal_confirm.View = false;
      state.modal_edit.View = false;
      this.commit('setDataLS');
    },
    //действия после соглашения в модалке подтверждения
    modalAccept(state) {
      if (state.modal_confirm.Type == 'delete') {
        this.commit('deleteNote');
      } else if (state.modal_confirm.Type == 'close') {
        state.modal_confirm = JSON.parse(JSON.stringify(state.modal_confirm_empty));
        state.modal_edit.View = false;
      }
    }
  }
})
