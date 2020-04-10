<template>
  <div class="modal-wrapper">
    <div class="modal">
      <div class="modal__container">
        <div class="modal__layout">
          <div class="modal__text">{{ modal_text }}</div>
          <div class="modal__buttons-wrapper">
            <button
              class="button modal__button"
              @click="reject()"
            >
              <i class="material-icons">clear</i>
            </button>
            <button
              class="button modal__button"
              @click="accept()"
            >
              <i class="material-icons">done</i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
        props: ['modal_text'],
        methods: {
            accept() {
                this.$emit('accept');
            },
            reject() {
                this.$emit('reject');
            }
        }
    }
</script>

<style scoped>

  .modal-wrapper {
    z-index: 101;
  }

  .modal__container {
    padding: 20px 30px;
  }

  .modal__layout {
    display: flex;
    flex-direction: column;

  }

  .modal__text {
    font-size: 20px;
    font-weight: bolder;
  }

  .modal__buttons-wrapper {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: flex-end;
    margin-top: 15px;
  }

</style>
